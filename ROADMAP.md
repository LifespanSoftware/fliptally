# FlipTally roadmap

A working list of where FlipTally could go after v0.0.0-beta. Nothing here is committed
or scheduled — it's a set of suggestions to prioritise against real usage.

See [`CHANGELOG.md`](./CHANGELOG.md) for what's shipped.

## Now — beta hardening

Things that matter before calling this a stable v1, mostly closing gaps the beta
knowingly shipped with:

- **Multi-user accounts.** Today FlipTally is single-tenant with an optional shared
  passcode (`FLIPTALLY_PASSCODE`). Real accounts (email/password or passkey) with
  per-user data would let it serve more than one seller per deployment.
- **Photo storage off the database.** Receipt photos are stored as inline base64 in
  SQLite, capped at 1.5MB. That's fine for a handful of sales but won't scale — move to
  disk or object storage (S3-compatible, e.g. via Dokploy/MinIO) with the DB just holding
  a reference.
- **Automated tests.** There's no test suite yet. Priority order: unit tests for
  `src/lib/money.ts` and `src/lib/csv.ts` (the HMRC threshold and trading allowance math
  is exactly the kind of logic that should never silently regress), then integration
  tests for the sale CRUD API routes.
- **Database backups.** No backup/restore story beyond "copy the SQLite file." A
  one-click export-everything (sales + settings) and import would double as a backup
  mechanism and a migration path between deployments.
- **Error states & empty states.** Network failures on the add/edit sale form just show
  a generic message; worth differentiating "you're offline" from "server rejected this."

## Next — v0.x

Features that build directly on what exists:

- **Edit flow polish.** Sale editing exists (`/sales/[id]`) but isn't linked from the
  mockup-driven UI as prominently as it could be — add swipe-to-edit/delete on the sales
  list, and undo-after-delete instead of a hard confirm dialog.
- **Bulk actions.** Multi-select on the Sales list to bulk re-tag platform/reason, or
  bulk-delete an incorrect CSV import.
- **Smarter CSV import.** Current import is column-name matching; add a preview-before-
  import step showing parsed rows and flagged errors, so a bad import doesn't require a
  bulk-delete afterwards. Pre-built mapping profiles for Vinted's and eBay's actual
  export formats (once we have real samples) would remove most manual mapping.
- **Previous tax years.** The Tax year screen only shows the current year — add a year
  switcher so people can review (and export) 2025/26, 2024/25, etc.
- **Previous calendar years on the HMRC check.** Same idea for the Home dashboard's
  reporting check, which is currently locked to the current calendar year.
- **Search/sort improvements.** Sales list search is item-name-only; extend to notes,
  and add sort by profit/date/price.
- **PWA basics.** Add a web app manifest + service worker so FlipTally can be "installed"
  to a phone home screen with an offline fallback page — cheap win given the design is
  already mobile-first.

## Later — v1+

Bigger, riskier bets:

- **Live platform integrations.** Vinted/eBay/Depop APIs (where available) to pull sales
  automatically instead of manual entry or CSV import. eBay has a public API; Vinted and
  Depop's are more limited — likely CSV/email-parsing bridges remain necessary for those.
- **Self Assessment export.** A guided flow that maps FlipTally's tax-year summary onto
  the actual HMRC Self Assessment "trading income" boxes, for people who do cross the
  trading allowance and need to file.
- **Multi-currency.** Currently GBP-only by design (it's a UK-HMRC-specific tool); if
  there's demand from sellers using non-UK platforms, this would need real thought about
  whether it dilutes the product's focus.
- **Accountant sharing.** A read-only, time-limited share link for a tax-year summary so
  sellers can hand it to an accountant without exporting/emailing files.
- **Insights/trends.** Profit-over-time charts, best/worst performing platform or
  category, average margin per item — useful once there's enough transaction history per
  user to make trends meaningful.
- **Native mobile wrapper.** The UI is already designed mobile-first; wrapping it with
  Capacitor/Expo for push notifications (e.g. "you're 80% to the HMRC threshold") would
  be more impactful than a from-scratch native rebuild.

## Someday / needs validation

Ideas worth revisiting once there's real user feedback, not committed to:

- VAT registration threshold (£90,000) tracking, for sellers who outgrow the trading
  allowance entirely and become VAT-relevant.
- Postage cost presets per platform/carrier to speed up data entry.
- Item categories/tags beyond platform and resale/clear-out, for people who want finer
  reporting (e.g. clothing vs electronics).
- Dark mode (the design system in `globals.css` already has CSS variables ready for it;
  it was left out of v0.0.0-beta to keep scope tight).
- Localisation for non-UK tax regimes — a much bigger undertaking, since the whole
  premise of the app is UK-specific thresholds.

---

Have a suggestion? Open an issue or PR against
[christopherdally/fliptally](https://github.com/christopherdally/fliptally).
