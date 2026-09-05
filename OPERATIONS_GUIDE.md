# IPMA Publishing — Publishing Operations Guide

Updated: 2026-09-05

## Purpose

The `/operations/` page is a browser-side helper for preparing new publication records without editing JSON by hand.

It does not automatically write to GitHub and does not store secrets. This is intentional for the current static-site architecture.

## Recommended workflow

1. Confirm the original source document.
2. Enter title, ISBN, publication date, publisher/copyright and other metadata.
3. Generate the record in `/operations/`.
4. Resolve all validation warnings.
5. Check existing book id and ISBN for duplicates.
6. Save/export JSON or CSV.
7. Add the approved record to the repository data source.
8. Confirm the record appears in DIGITAL LIBRARY.
9. Connect cover, preview, eBook, purchase/use and Verification only when real links/codes exist.

## Validation rules

- Never invent an ISBN.
- ISBN-10 and ISBN-13 values must pass checksum validation.
- Publication date must use `YYYY-MM-DD` when a complete date is known.
- Never invent unknown month/day values.
- Book id must be stable and unique.
- Do not overwrite a historical record to represent a new edition.
- Edition and Version should remain explicit when applicable.
- Verification codes must be real registered values.

## Current publication sources

- `data/books.json`: enriched digital-library records.
- `data/official-publications.csv`: verified official publication register imported from the historical workbook.
- `data/verify.json`: verification records.
- `data/publications-source.json`: source/migration provenance.

## Static-site limitation

The current site has no authenticated backend. Therefore `/operations/` prepares records but cannot securely save directly to GitHub by itself. Direct write-back should only be added later through an authenticated backend/admin layer if operational volume justifies it.
