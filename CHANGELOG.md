# FlipTally changelog

All notable changes to FlipTally are documented here. FlipTally is designed and built by
[Lifespan Software](https://lifespansoftware.com).

Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Installable app** — a web app manifest (`src/app/manifest.ts`) with generated brand
  icons, so FlipTally can be added to a phone or desktop home screen.
- **Offline app shell** — a lightweight service worker (`public/sw.js`) caches visited
  pages and static assets so the app still opens without a connection, falling back to a
  dedicated `/offline` screen. Sales data always requires a live connection; this isn't
  offline editing.
- **Me → Help** tab with a screenshot-led tour of every screen, and a README screenshots
  section.

## [0.0.0-beta] — 2026-11-02

First beta build of FlipTally — a profit and HMRC-threshold tracker for people selling on
Vinted, eBay, Depop and similar platforms.

### Added

- **Home dashboard** — an HMRC reporting check for the current calendar year, tracking
  progress towards the 30-sale and £1,700 platform-reporting thresholds, plus profit for
  the current tax year and a by-platform breakdown.
- **Add a sale** — log an item in seconds: platform (Vinted, eBay, Depop, Other), whether
  it was a resale or a clear-out of your own things, sold price, cost, postage & fees, and
  date sold. Profit is calculated live as you type. Optional receipt photo attachment.
- **Sales list** — every sale in one place, searchable and filterable by resale/clear-out
  and by platform.
- **CSV import** — bring in sales from a spreadsheet or another platform's export.
  Recognises common column names (Item, Platform, Sold for, Paid, Date sold, etc.).
- **Tax year summary** — resale takings against the £1,000 trading allowance, cost of
  goods, postage & fees, and profit for the current UK tax year (6 April – 5 April).
  Clear-outs are shown separately as usually non-taxable. A note on Making Tax Digital for
  Income Tax (from April 2027, £30,000+ income).
- **Export summary** — download a tax year's sales as a PDF summary or a CSV file.
- **Me tab** — app info, links to HMRC guidance, changelog, and a full CSV export of all
  sales.

### Known limitations (beta)

- Single-user, self-hosted: no multi-account login yet. An optional shared passcode can
  gate access to a deployment (`FLIPTALLY_PASSCODE`).
- No live integrations with Vinted, eBay or Depop — sales are logged manually or imported
  via CSV.
- Receipt photos are stored inline in the database; very large images are rejected rather
  than resized.
- FlipTally gives general guidance based on published HMRC thresholds, not tax advice.
  Always check current rules on [gov.uk](https://www.gov.uk) or with an accountant.

---

_FlipTally is not affiliated with Vinted, eBay, Depop or HMRC._
