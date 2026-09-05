(function () {
  const grid = document.querySelector("#catalogGrid");
  const empty = document.querySelector("#catalogEmpty");
  const meta = document.querySelector("#catalogMeta");
  const resultMeta = document.querySelector("#catalogResultMeta");
  const searchInput = document.querySelector("#catalogSearch");
  const categoryFilter = document.querySelector("#categoryFilter");
  const formatFilter = document.querySelector("#formatFilter");
  const sortFilter = document.querySelector("#sortFilter");
  const resetButton = document.querySelector("#resetFilters");
  if (!grid) return;

  const DATA_URL = "../data/books.json";
  let allBooks = [];

  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function load() {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("books.json 로드 실패");
    return await res.json();
  }

  function normalized(value) {
    return String(value || "").trim().toLowerCase();
  }

  function cleanDate(value) {
    if (!value || value === "TBD") return "";
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
  }

  function publicationLabel(book) {
    return cleanDate(book.publish_date) ? book.publish_date : "발행 예정";
  }

  function statusLabel(book) {
    if (book.status) return book.status;
    if (book.edition && normalized(book.edition).includes("draft")) return "준비 중";
    return cleanDate(book.publish_date) ? "발행" : "예정";
  }

  function formatTags(value) {
    return String(value || "")
      .split("/")
      .map(v => v.trim())
      .filter(Boolean);
  }

  function searchableText(book) {
    const authors = Array.isArray(book.authors) ? book.authors.join(" ") : (book.author || "");
    const keywords = Array.isArray(book.keywords) ? book.keywords.join(" ") : "";
    return normalized([
      book.title,
      book.subtitle,
      book.series,
      book.category,
      book.format,
      book.isbn,
      book.language,
      authors,
      keywords,
      book.summary
    ].filter(Boolean).join(" "));
  }

  function optionValues(books, field, splitter) {
    const set = new Set();
    books.forEach(book => {
      const raw = book[field];
      const values = splitter ? splitter(raw) : [raw];
      values.filter(Boolean).forEach(v => set.add(String(v).trim()));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ko"));
  }

  function fillSelect(select, values, firstLabel) {
    if (!select) return;
    const current = select.value;
    select.innerHTML = `<option value="">${esc(firstLabel)}</option>` + values.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    if (values.includes(current)) select.value = current;
  }

  function coverMarkup(book) {
    const cover = book.cover || "../assets/images/placeholders/cover-default.jpg";
    return `
      <div class="library-cover-wrap">
        <img class="library-cover" src="${esc(cover)}" alt="${esc(book.title || "도서")} 표지" loading="lazy" />
        <span class="library-status">${esc(statusLabel(book))}</span>
      </div>
    `;
  }

  function card(book) {
    const href = `./book/?id=${encodeURIComponent(book.id || "")}`;
    const pub = publicationLabel(book);
    const formats = formatTags(book.format);
    const primaryFormat = formats[0] || "Publication";
    const isbn = book.isbn ? `<span class="library-meta-line">ISBN ${esc(book.isbn)}</span>` : "";
    const language = book.language ? `<span class="library-meta-line">${esc(book.language)}</span>` : "";
    const featured = book.featured ? `<span class="badge library-featured">추천</span>` : "";
    const newRelease = book.new_release ? `<span class="badge library-new">NEW</span>` : "";

    return `
      <a class="library-book-card" href="${href}">
        ${coverMarkup(book)}
        <div class="library-book-body">
          <div class="library-book-flags">${newRelease}${featured}</div>
          <p class="library-eyebrow">${esc(book.category || "IPMA Publishing")}</p>
          <h3>${esc(book.title || "제목 미정")}</h3>
          <p class="library-subtitle">${esc(book.subtitle || book.summary || "")}</p>
          <div class="library-book-meta">
            <span>${esc(primaryFormat)}</span>
            <span>${esc(pub)}</span>
            ${language}
            ${isbn}
          </div>
          <div class="library-book-bottom">
            <span>${esc(book.series || "독립 출판")}</span>
            <strong>상세보기 →</strong>
          </div>
        </div>
      </a>
    `;
  }

  function compareBooks(a, b, sortMode) {
    if (sortMode === "title") return String(a.title || "").localeCompare(String(b.title || ""), "ko");
    if (sortMode === "series") {
      const seriesCompare = String(a.series || "").localeCompare(String(b.series || ""), "ko");
      return seriesCompare || String(a.title || "").localeCompare(String(b.title || ""), "ko");
    }

    const aDate = cleanDate(a.publish_date);
    const bDate = cleanDate(b.publish_date);
    if (aDate && bDate) return bDate.localeCompare(aDate);
    if (aDate) return -1;
    if (bDate) return 1;
    return String(a.title || "").localeCompare(String(b.title || ""), "ko");
  }

  function applyFilters() {
    const q = normalized(searchInput?.value);
    const category = categoryFilter?.value || "";
    const format = formatFilter?.value || "";
    const sortMode = sortFilter?.value || "newest";

    const filtered = allBooks
      .filter(book => !q || searchableText(book).includes(q))
      .filter(book => !category || String(book.category || "") === category)
      .filter(book => !format || formatTags(book.format).includes(format))
      .sort((a, b) => compareBooks(a, b, sortMode));

    grid.innerHTML = filtered.map(card).join("");
    if (empty) empty.hidden = filtered.length !== 0;
    if (resultMeta) resultMeta.textContent = `현재 ${filtered.length}권 표시`;
  }

  function bindEvents() {
    searchInput?.addEventListener("input", applyFilters);
    categoryFilter?.addEventListener("change", applyFilters);
    formatFilter?.addEventListener("change", applyFilters);
    sortFilter?.addEventListener("change", applyFilters);
    resetButton?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (categoryFilter) categoryFilter.value = "";
      if (formatFilter) formatFilter.value = "";
      if (sortFilter) sortFilter.value = "newest";
      applyFilters();
      searchInput?.focus();
    });
  }

  (async () => {
    try {
      const data = await load();
      allBooks = Array.isArray(data.books) ? data.books : [];

      fillSelect(categoryFilter, optionValues(allBooks, "category"), "전체 분야");
      fillSelect(formatFilter, optionValues(allBooks, "format", formatTags), "전체 형태");

      if (meta) meta.textContent = `업데이트 ${data.updated || "-"} · 등록 ${allBooks.length}권`;
      bindEvents();
      applyFilters();
    } catch (e) {
      grid.innerHTML = `
        <div class="library-empty card pad">
          <h3>도서 정보를 불러오지 못했습니다.</h3>
          <p>잠시 후 다시 시도하거나 IPMA Publishing에 문의해 주세요.</p>
        </div>
      `;
      if (meta) meta.textContent = "도서 정보를 불러오지 못했습니다.";
      if (resultMeta) resultMeta.textContent = "";
    }
  })();
})();
