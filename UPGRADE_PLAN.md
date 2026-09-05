# IPMA Publishing — Digital Publishing Upgrade Plan

Updated: 2026-09-05

## 1. Upgrade goal

Transform IPMA Publishing into an eBook-centered global digital publishing platform while preserving catalog, ISBN, Verification and archive trust infrastructure.

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

## 2. Current baseline on main

Core routes and infrastructure now include:

- `/about/`
- `/catalog/`
- `/catalog/book/`
- `/catalog/official/`
- `/series/`
- `/authors/`
- `/isbn/`
- `/distribution/`
- `/resources/`
- `/news/`
- `/media/`
- `/submissions/`
- `/verification/`
- `/operations/`
- `/contact/`
- `/imprints/`
- `data/books.json`
- `data/official-publications.csv`
- `data/publications-source.json`
- `data/verify.json`
- `data/templates/multilingual-editions-template.csv`
- `assets/js/catalog.js`
- `assets/js/operations.js`
- `assets/js/verify.js`
- `assets/css/style.css`
- `assets/css/book-detail.css`
- `assets/css/catalog-stability.css`
- `assets/css/operations.css`
- `ools/xlsx_to_json.py`
- `PUBLISHING_DATA_GUIDE.md`
- `OPERATIONS_GUIDE.md`
- `OFFICIAL_PUBLICATION_TAXONOMY.md`
- `GLOBAL_PUBLISHING_GUIDE.md`

## 3. Preservation rules

1. Keep catalog loading and book detail routes working.
2. Keep Verification and direct `?code=` lookup working.
3. Keep ISBN / Edition / Version concepts.
4. Never invent ISBN, publication date, author, copyright or verification facts.
5. Preserve existing historical records when new editions are created.
6. Keep the site deployable as a static site unless a backend is explicitly introduced later.

## 4. Current data model

Digital Library supports optional fields including:

- `isbn`
- `language`
- `author` / `authors`
- `author_ids`
- `keywords`
- `status`
- `featured`
- `new_release`
- `ebook_url`
- `preview_url`
- `purchase_url`
- `download_policy`
- `rights`
- `updated_at`
- multilingual/localized metadata containers for future approved translations

Official historical publications are stored separately from enriched digital-book records so verified bibliographic facts are not confused with editorial/eBook metadata.

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

Secondary public routes:

- Distribution
- Resources
- News
- Media
- Imprints

Internal/operational route:

- Publishing Operations (`/operations/`) — intentionally removed from public homepage navigation and marked `noindex,nofollow`; direct URL remains available for operating use.

## 6. Image asset plan

Image production remains a separate image-only workflow.

Prepared production paths:

- `assets/images/publishing/hero-main.webp`
- `assets/images/publishing/digital-library.webp`
- `assets/images/publishing/martial-education.webp`
- `assets/images/publishing/research-knowledge.webp`
- `assets/images/publishing/global-publishing.webp`
- `assets/images/publishing/verification.webp`
- `assets/images/publishing/submissions.webp`

Do not delete placeholders until approved production assets are connected and verified.

## 7. Phased implementation

### PHASE 1 — Baseline audit
Status: COMPLETE

Repository, routes, CSS/JS, catalog, Verification, ISBN, submissions and import tooling inspected. Preservation rules defined.

### PHASE 2 — eBook-first identity and homepage
Status: COMPLETE

Homepage upgraded to Global Digital Publishing / eBook-first positioning with simplified mobile-safe navigation and preserved routes.

### PHASE 3 — Digital Library
Status: COMPLETE

Search, category/format filtering, sorting, responsive book cards, optional metadata and official publication integration implemented.

### PHASE 4 — Book detail
Status: COMPLETE

Premium cover/detail layout, metadata, ISBN, author, publication date, TOC, preview/eBook/purchase links, Verification and mobile layout implemented with missing-data safety.

### PHASE 5 — Real publication migration
Status: COMPLETE / ACTIVE DATASET

- Historical workbook validated.
- 185 official publication records confirmed.
- ISBN checksum errors: 0.
- Duplicate ISBN: 0.
- Duplicate titles: 0.
- Full official register stored in `data/official-publications.csv`.
- Source provenance retained in `data/publications-source.json`.
- Editorial category/series taxonomy created.
- DIGITAL LIBRARY can load enriched books plus official publication records.

Future additions must continue to use verified source material only.

### PHASE 6 — Publishing operations
Status: COMPLETE — FOUNDATION

Implemented browser-side registration workspace, ISBN/date validation, JSON/CSV generation and operating guidance. Direct public GitHub write-back remains disabled because there is no authenticated backend.

### PHASE 7 — Global expansion foundation
Status: COMPLETE — FOUNDATION

Implemented:

- Korean / English / Chinese-ready metadata strategy.
- Language-aware Digital Library filtering.
- Multilingual search metadata support.
- Source-edition to translated-edition relationship rules.
- `data/templates/multilingual-editions-template.csv`.
- `GLOBAL_PUBLISHING_GUIDE.md`.
- Rule that translated editions receive their own verified ISBN only when officially assigned.
- Korean source records remain unchanged until approved translation metadata exists.

### PHASE 8 — Integrated stability audit
Status: COMPLETE — FIRST PASS

Audit and fixes completed:

- Catalog now uses generated fallback covers for official records and missing placeholder covers, preventing broken-card visuals while production images are pending.
- Language filter now includes legacy Korean records consistently.
- Internal Publishing Operations route removed from public homepage navigation.
- Publishing Operations page marked `noindex,nofollow`.
- Placeholder `YOUR_GITHUB_ID` removed from `sitemap.xml` and `robots.txt`.
- Public sitemap refreshed with actual repository Pages host and public routes only.
- Existing catalog, official publication detail, ISBN and Verification route structure preserved.

## 8. Non-regression rules

- Do not delete functional pages during redesign.
- Do not replace verified publication facts with samples.
- Do not invent ISBN values or dates.
- Do not remove Verification.
- Do not break `books.json` or official-publication catalog loading.
- Do not break direct Verification queries.
- Do not overwrite approved production images or historical records without source confirmation.
- Do not expose unauthenticated internal operating tools as primary public navigation.
- Each phase should remain independently testable and reversible.

## 9. Immediate next action

Move from foundation work to content completion: connect approved production imagery, enrich the highest-priority official publications with verified covers/descriptions/eBook links, and then add approved English/Chinese editions when source translations and ISBN facts are available.
