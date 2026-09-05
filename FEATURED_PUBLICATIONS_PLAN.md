# IPMA Publishing — PHASE 9 Featured Publications Plan

Updated: 2026-09-05

## Purpose
Turn the verified 185-title official register into a reader-facing digital publishing collection without inventing missing content.

## Current asset check
`assets/images/publishing/` currently contains only `README.md`. Production hero/library/category images are therefore not connected yet. Keep CSS fallbacks active until approved images are uploaded.

## Editorial priority groups

### A. Brand / flagship
- DOUBLE CROSS
- 경찰무도의 본질과 미래
- ACTS MISSION ALLIANCE

### B. ACTS Mission collection
Start with the 15 verified ACTS Mission Series titles already present in the official register. Preserve each ISBN/date/copyright exactly.

### C. Martial arts / police martial arts
Prioritize representative works from `Police Martial Arts & Martial Education Series`, followed by the verified Taekwonkumdo titles in the register.

### D. Future-facing knowledge
Prioritize representative Drone/AI/Safety, Global Leadership/Public Value, Certification/Quality, and Global News24 Media titles.

## Enrichment layers
For each selected official publication, enrich only approved/verified values:
1. cover image
2. author / contributor
3. reader-facing summary
4. table of contents
5. eBook URL
6. preview URL
7. purchase/use URL
8. rights statement
9. Verification code
10. English / Chinese edition relationship when an actual approved edition exists

## Data safety rule
The 185-row `data/official-publications.csv` remains the bibliographic source register. Do not overwrite its verified title, ISBN, publication date or copyright fields with editorial text.

Reader-facing enrichment should be stored separately and joined by ISBN. This prevents cover/summary/eBook updates from changing historical bibliographic facts.

## Recommended enrichment file
Create `data/publication-enrichment.json` when the first approved cover/summary/eBook metadata is available. Suggested shape:

```json
{
  "updated": "YYYY-MM-DD",
  "publications": [
    {
      "isbn": "verified ISBN",
      "cover": "approved asset path",
      "author": "verified author",
      "summary": "approved summary",
      "toc": [],
      "ebook_url": "",
      "preview_url": "",
      "purchase_url": "",
      "verification_code": ""
    }
  ]
}
```

Do not create fabricated example records in the live data file.

## Image handoff
When the image-production chat finishes, upload approved assets under `assets/images/publishing/` (homepage/category visuals) and a dedicated book-cover directory such as `assets/images/books/`. Then connect them by ISBN through the enrichment layer.

## Definition of PHASE 9 complete
- flagship collection selected from verified titles
- approved production images connected
- representative real covers connected
- selected titles have approved summaries/author/eBook metadata
- no fabricated bibliographic facts
- Digital Library visually distinguishes enriched digital books from archive-only ISBN records
