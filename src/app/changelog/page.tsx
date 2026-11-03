import Link from "next/link";
import { HMRC_SALES_THRESHOLD, HMRC_TAKINGS_THRESHOLD, TRADING_ALLOWANCE, MTD_THRESHOLD } from "@/lib/money";

export const metadata = { title: "Changelog · FlipTally" };

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background px-5 pb-16 pt-6">
      <Link href="/me" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17l5-5 4 4 8-8" />
            <path d="M15 8h5v5" />
          </svg>
        </span>
        <div>
          <h1 className="text-2xl font-bold">
            Flip<span className="text-brand">Tally</span> changelog
          </h1>
          <p className="text-sm text-muted">Designed by Lifespan Software</p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-bold text-accent">
            Unreleased
          </span>
        </div>
        <h2 className="mt-3 text-lg font-bold">Installable, works offline</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          FlipTally can now be added to your home screen and keeps the app shell working
          without a connection.
        </p>

        <ChangeList
          title="Added"
          items={[
            "Installable as a home-screen app, with a generated icon and app manifest.",
            "Offline app shell — pages you've visited still open without a connection, with a dedicated offline screen as a fallback. Adding or editing sales still needs a connection.",
            "A Me → Help tab with a screenshot-led tour of every screen.",
          ]}
        />
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand-dark">
            v0.0.0-beta
          </span>
          <span className="text-sm text-muted">2 November 2026</span>
        </div>
        <h2 className="mt-3 text-lg font-bold">First beta build</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          The first release of FlipTally — a profit and HMRC-threshold tracker for sellers
          on Vinted, eBay, Depop and similar platforms.
        </p>

        <ChangeList
          title="Added"
          items={[
            "Home dashboard with the HMRC reporting check, profit this tax year, and a by-platform breakdown.",
            "Add a sale — log an item in seconds, with live profit as you type and an optional receipt photo.",
            "Sales list — searchable, filterable by resale/clear-out and by platform.",
            "CSV import for bringing in sales from a spreadsheet or platform export.",
            "Tax year summary against the £1,000 trading allowance, with a Making Tax Digital note.",
            "Export a tax year summary as PDF or CSV.",
          ]}
        />

        <ChangeList
          title="Known limitations"
          items={[
            "Single-user, self-hosted beta — no multi-account login yet.",
            "No live sync with Vinted, eBay or Depop; sales are logged manually or via CSV import.",
            "Receipt photos are stored inline and very large images are rejected rather than resized.",
          ]}
        />
      </section>

      <section id="hmrc" className="mt-5 scroll-mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="text-lg font-bold">What the HMRC reporting check means</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Since 2024, UK digital platforms including Vinted, eBay and Depop must report
          sellers to HMRC who, in a calendar year, either make {HMRC_SALES_THRESHOLD} or
          more sales, or take £{HMRC_TAKINGS_THRESHOLD.toLocaleString()} or more in total
          payments. FlipTally tracks your progress towards both so there are no surprises.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          <strong className="text-foreground">Being reported doesn&rsquo;t itself mean you owe tax.</strong> It
          just means the platform shares your sales totals with HMRC, the same way a bank
          reports interest. Separately, everyone gets a £{TRADING_ALLOWANCE.toLocaleString()}{" "}
          tax-free trading allowance each tax year — if your resale takings (not clear-outs
          of your own belongings) stay under that, you usually don&rsquo;t need to declare
          anything. Making Tax Digital for Income Tax starts to apply from April 2027 for
          sole traders with gross income over £{MTD_THRESHOLD.toLocaleString()}.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          FlipTally gives general guidance based on published HMRC rules, not tax advice.
          For your specific situation, check{" "}
          <a href="https://www.gov.uk/guidance/selling-online-and-paying-taxes-income-tax" className="font-semibold text-brand">
            gov.uk
          </a>{" "}
          or speak to an accountant.
        </p>
      </section>

      <p className="mt-6 text-center text-xs text-muted">
        FlipTally · designed by Lifespan Software · not affiliated with Vinted, eBay, Depop or HMRC.
      </p>
    </div>
  );
}

function ChangeList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
