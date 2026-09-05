# IPMA Publishing — Global Publishing Guide

Updated: 2026-09-05

## Purpose
Prepare IPMA Publishing for Korean, English and Chinese editions without changing or fabricating verified publication facts.

## Core rule
The Korean/source publication record is preserved. A translated edition is linked to its source through `parent_id` or `parent_isbn` and is managed as a distinct edition record.

## Language codes
- Korean: `ko` / 한국어
- English: `en` / English
- Chinese: `zh` / 中文

## Translation metadata
A translated edition may contain: localized title, subtitle, author display, translator, ISBN, publication date, edition, version, summary, keywords, eBook/preview/purchase links and verification code.

Only verified values are published. Do not automatically translate legal publication facts, author names, titles or copyright statements and present them as official facts without editorial approval.

## ISBN policy
Do not reuse a Korean ISBN as the ISBN of a separately registered English or Chinese edition. Enter the translated edition ISBN only after it has been officially assigned and verified. Until then the ISBN field remains empty.

## Edition relationship
Recommended structure:
- source record: Korean/original publication
- English edition: `parent_isbn` points to source ISBN
- Chinese edition: `parent_isbn` points to source ISBN

Each edition can have its own ISBN, publication date, cover, eBook file and Verification code.

## Digital Library behavior
The catalog supports language filtering and multilingual search metadata. Current verified official records default to Korean because the historical source list is Korean. English/Chinese records should appear only when approved metadata is added.

## SEO and discovery
For future localized public pages use unique page titles/descriptions, `lang` attributes, canonical URLs and `hreflang` relationships. Structured book metadata should be generated only from verified catalog facts.

## Migration template
Use `data/templates/multilingual-editions-template.csv` to prepare translated editions. Never overwrite the 185 verified source publication records merely to create a translated display title.
