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

The current repository already contains the core publishing information architecture:

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

The catalog is already data-driven from `data/books.json` and Verification is already data-driven from `data/verify.json`.

## 3. Existing functions that must be preserved

1. Catalog automatic loading from `data/books.json`
2. Book detail route based on book id
3. Verification code lookup
4. Direct Verification query format `/verification/?code=...`
5. ISBN / Edition / Version guidance
6. Series / Authors / Distribution / Resources / News / Media / Contact routes
7. Responsive layout and current navigation until replacement is verified
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

### B. Publishing identity is archive-first, not eBook-first

The current homepage message emphasizes publishing system / archive / verification. The new homepage should lead with eBooks and digital library discovery, while keeping Archive, ISBN, Edition, Version and Verification as trust infrastructure.

### C. Catalog data model is too small for long-term digital publishing

Current book data supports title, subtitle, series, category, format, edition, version, publish date, publisher, cover, summary, TOC and verification example.

Future-safe fields should be added gradually, without breaking old records:

- `isbn`
- `language`
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

No ISBN or publication facts may be invented. Real source data must be used.

### D. Content is currently too internally oriented

Some public-facing pages expose operational notes such as JSON file management instructions and internal publishing philosophy. Public pages should be rewritten for readers/authors/institutions. Developer/operation notes should move to documentation.

### E. Mobile navigation needs a future redesign

The current navigation wraps many pill buttons. It is functional, but as the eBook catalog grows it should become a simpler responsive navigation with clear primary actions.

### F. Data import tool exists but folder naming is irregular

An Excel-to-JSON utility exists at `ools/xlsx_to_json.py`. It expects `ipma_data.xlsx` and generates books and verification JSON. This is useful infrastructure and should be preserved. Folder cleanup should happen only after usage and deployment references are checked.

## 5. New public information architecture

Recommended main hierarchy:

1. HOME
2. eBOOKS / DIGITAL LIBRARY
3. CATEGORIES
4. SERIES
5. AUTHORS
6. ISBN & PUBLICATION INFO
7. VERIFICATION
8. SUBMISSIONS
9. ABOUT
10. CONTACT

Secondary links:

- Distribution
- Resources
- News
- Media
- Imprints

## 6. Homepage target structure

1. Premium digital publishing HERO
2. Featured eBooks
3. New releases
4. Browse by category
5. Digital Library introduction
6. Global Publishing / multilingual expansion
7. ISBN + Verification trust section
8. Author / manuscript submission
9. Archive / institutional distribution
10. Footer

The homepage must show books first and system explanations second.

## 7. Image asset plan

Image production is handled in a separate image-only workflow. This repository should prepare predictable paths for those assets.

Recommended production paths:

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
Status: NEXT

- Rewrite homepage information hierarchy
- Keep all existing routes working
- Introduce Digital Library / eBook-first messaging
- Add production image hooks with safe fallbacks
- Remove public developer notes from homepage
- Improve mobile-first header/navigation without breaking route access

### PHASE 3 — Digital Library catalog upgrade

- Search/filter/sort
- Category browsing
- Featured/new-release states
- ISBN/language/author metadata support
- Safe compatibility with old book records

### PHASE 4 — Book detail upgrade

- Cover
- Metadata
- ISBN
- Publication date
- Author
- Description
- TOC
- Preview
- eBook access/purchase link
- Verification link

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

Proceed to PHASE 2: eBook-first homepage and identity upgrade, using the current main branch as the baseline and preserving every confirmed working route and data-driven function.
