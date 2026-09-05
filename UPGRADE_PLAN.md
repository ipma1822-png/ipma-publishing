# IPMA Publishing — Digital Publishing Upgrade Plan

Updated: 2026-09-05

## 1. Upgrade goal

Transform the current IPMA Publishing site from a static publishing/archive hub into an eBook-centered global digital publishing platform while preserving all existing working routes, catalog loading, ISBN guidance, verification lookup, and archive concepts.

Core identity:

- IPMA Publishing
- Digital Publishing
- eBook
- Knowledge
- Martial Arts
- Education
- Research
- Global Growth
- Archive
- ISBN
- Verification

## 2. Current baseline confirmed on main

The repository contains the core publishing information architecture:

- `/about/`
- `/catalog/`
- `/series/`
- `/authors/`
- `/isbn/`
- `/distribution/`
- `/resources/`
- `/news/`
- `/media/`
- `/submissions/`
- `/verification/`
- `/contact/`
- `/imprints/`
- `data/books.json`
- `data/verify.json`
- `assets/js/catalog.js`
- `assets/js/verify.js`
- `assets/css/style.css`

The catalog remains data-driven from `data/books.json` and Verification remains data-driven from `data/verify.json`.

## 3. Existing functions that must be preserved

1. Catalog automatic loading from `data/books.json`
2. Book detail route based on book id
3. Verification code lookup
4. Direct Verification query format `/verification/?code=...`
5. ISBN / Edition / Version guidance
6. Series / Authors / Distribution / Resources / News / Media / Contact routes
7. Responsive layout
8. Existing static-site deployment compatibility

## 4. Confirmed weaknesses / upgrade targets

### A. Visual assets are placeholders

Several important assets currently exist as 1-byte placeholder files, including:

- `assets/images/logo.png`
- `assets/images/hero.jpg`
- `assets/images/og.jpg`
- `assets/images/placeholders/cover-default.jpg`
- `assets/downloads/catalog.pdf`
- `assets/downloads/press-kit.zip`

These must be replaced only when approved production assets are available.

### B. Publishing identity was archive-first, not eBook-first

The homepage has now been upgraded to lead with eBooks and Digital Library discovery, while Archive, ISBN, Edition, Version and Verification remain the trust infrastructure.

### C. Catalog data model must grow safely

Current book data supports title, subtitle, series, category, format, edition, version, publish date, publisher, cover, summary, TOC and verification example.

The Digital Library UI now safely recognizes optional future fields without requiring existing records to change:

- `isbn`
- `language`
- `author` / `authors`
- `keywords`
- `status`
- `featured`
- `new_release`
- future eBook access fields

No ISBN or publication facts may be invented. Real source data must be used.

### D. Public content should remain reader-oriented

Developer and operating notes should not be exposed as primary public content. Public pages should speak to readers, authors, institutions and partners.

### E. Mobile navigation

The homepage and Digital Library now use responsive navigation and mobile-safe layouts. Further simplification can happen after more real content is loaded.

### F. Data import tool exists but folder naming is irregular

An Excel-to-JSON utility exists at `ools/xlsx_to_json.py`. It expects `ipma_data.xlsx` and generates books and verification JSON. This infrastructure is preserved. Folder cleanup should happen only after usage and deployment references are checked.

## 5. Public information architecture

Primary hierarchy:

1. HOME
2. eBOOKS / DIGITAL LIBRARY
3. SERIES
4. AUTHORS
5. ISBN & PUBLICATION INFO
6. VERIFICATION
7. SUBMISSIONS
8. ABOUT
9. CONTACT

Secondary links:

- Distribution
- Resources
- News
- Media
- Imprints

## 6. Homepage structure

1. Premium digital publishing HERO
2. eBook / Digital Library entry
3. Publishing fields and categories
4. Global knowledge positioning
5. ISBN + Verification trust section
6. Author / manuscript submission
7. Secondary archive / distribution links
8. Footer

## 7. Image asset plan

Image production is handled in a separate image-only workflow.

Prepared production paths:

- `assets/images/publishing/hero-main.webp`
- `assets/images/publishing/digital-library.webp`
- `assets/images/publishing/martial-education.webp`
- `assets/images/publishing/research-knowledge.webp`
- `assets/images/publishing/global-publishing.webp`
- `assets/images/publishing/verification.webp`
- `assets/images/publishing/submissions.webp`

No existing placeholder file should be deleted until replacements are connected and verified.

## 8. Phased implementation

### PHASE 1 — Baseline audit
Status: COMPLETE

- Repository access confirmed
- Main branch baseline inspected
- Core routes inspected
- Catalog data flow inspected
- Verification data flow inspected
- ISBN page inspected
- Submission page inspected
- CSS baseline inspected
- Excel import utility inspected
- Placeholder assets identified
- Preservation rules defined

### PHASE 2 — eBook-first identity and homepage
Status: COMPLETE

- Homepage information hierarchy rewritten
- Existing routes preserved
- Digital Library / eBook-first messaging introduced
- Production image paths prepared with CSS fallback visuals
- Public developer notes removed from homepage
- Mobile-first header/navigation improved

### PHASE 3 — Digital Library catalog upgrade
Status: COMPLETE

- Search by title / subtitle / series / category / optional metadata
- Category filter
- Format filter
- Sort by newest / title / series
- Responsive digital-library book cards
- Featured/new-release state support when future records provide those fields
- Optional ISBN/language/author/keyword metadata support
- Safe compatibility with current legacy book records
- Empty-result and load-error states
- Public-facing internal JSON operating note removed from catalog

### PHASE 4 — Book detail upgrade
Status: NEXT

- Premium book detail layout
- Cover
- Metadata
- ISBN when real data exists
- Publication date
- Author when real data exists
- Description
- TOC
- Preview link support
- eBook access/purchase link support
- Verification link
- Remove internal/developer notes from public book detail page

### PHASE 5 — Real publication data migration

Wait for verified source material:

- Book title
- ISBN
- Publication date
- Publisher / copyright
- Author / editor data

Do not fabricate missing values.

### PHASE 6 — Publishing operations

- Excel/JSON operating workflow cleanup
- Future admin-friendly publishing workflow
- Author/manuscript intake improvements
- Version/history management
- Optional backend migration only if justified

### PHASE 7 — Global expansion

- Korean / English / Chinese-ready metadata
- Multilingual editions
- International distribution links
- International SEO / Open Graph / structured metadata

## 9. Non-regression rules

- Do not delete existing functional pages during redesign.
- Do not replace real publication facts with samples.
- Do not invent ISBN values.
- Do not remove Verification.
- Do not remove Edition / Version concepts.
- Do not break `books.json`-driven catalog loading.
- Do not break direct verification queries.
- Do not overwrite image placeholders until actual approved assets exist.
- Each PHASE should be independently testable and reversible.

## 10. Immediate next action

Proceed to PHASE 4: upgrade the book detail experience while keeping the current `?id=` route and all existing catalog/verification links compatible.
