# BioWound landing page

Public URL: `https://klinikinocare.my/biowound/`

## Where to make routine updates

- Edit all English and Bahasa Malaysia wording, phone numbers, address, links, and WhatsApp message templates in `src/biowound/content.ts`.
- Edit page layout and components in `src/biowound/BioWoundApp.tsx`.
- Edit search/social metadata and structured data in `biowound/index.html`.
- Shared fonts, focus styles, and reduced-motion behaviour live in `src/index.css`.

The page reuses the approved Klinik Inocare logo and existing responsive clinic imagery from `assets/`. Do not recolour, crop, redraw, distort, or replace the logo with typed text.

## Local review

Run:

```text
npm run dev
```

Then open `http://localhost:5173/biowound/`.

## Production check

Run:

```text
npm run build
```

The production page is written to `dist/biowound/index.html`. The GitHub Pages workflow deploys this directory with the rest of the site.

## Before publishing medical or service changes

Confirm all treatment descriptions, prices, appointment availability, home-visit coverage, opening hours, clinician details, statistics, and outcome claims with the clinic's authorised reviewer. Do not publish guarantees of healing or universal suitability.

