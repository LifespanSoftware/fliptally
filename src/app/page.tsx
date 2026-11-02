import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TopBar from "@/components/TopBar";
import SaleRow from "@/components/SaleRow";
import ProgressBar from "@/components/ProgressBar";
import { ukTaxYearStart } from "@/lib/dates";
import { hmrcCheck, taxYearSummary, platformLabel } from "@/lib/money";
import { toSaleDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sales = await prisma.sale.findMany({ orderBy: { dateSold: "desc" } });

  const today = new Date();
  const check = hmrcCheck(sales, today.getFullYear());
  const startYear = ukTaxYearStart(today);
  const summary = taxYearSummary(sales, startYear);
  const recent = sales.slice(0, 3).map(toSaleDTO);

  const statusStyles: Record<typeof check.status, string> = {
    "On track": "bg-brand-light text-brand-dark",
    "Getting close": "bg-accent-light text-accent",
    "Likely to be reported": "bg-accent text-white",
  };

  return (
    <div>
      <TopBar />

      <section className="mx-5 mt-2 rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            HMRC reporting check · {check.year}
          </p>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[check.status]}`}>
            {check.status}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium">Sales</span>
            <span>
              <span className="font-semibold">{check.salesCount}</span> of {check.salesTarget}
            </span>
          </div>
          <div className="mt-1.5">
            <ProgressBar value={check.salesCount} max={check.salesTarget} />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium">Money taken</span>
            <span>
              <span className="font-semibold">£{check.moneyTaken.toFixed(0)}</span> of £
              {check.moneyTarget.toFixed(0)}
            </span>
          </div>
          <div className="mt-1.5">
            <ProgressBar value={check.moneyTaken} max={check.moneyTarget} color="var(--brand)" />
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          {remainingCopy(check)} Being reported doesn&rsquo;t mean you owe tax.
        </p>

        <Link href="/changelog#hmrc" className="mt-2 inline-block text-sm font-semibold text-brand">
          What this means for me →
        </Link>
      </section>

      <section className="mx-5 mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-brand p-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wide text-white/75">
            Profit this tax year
          </p>
          <p className="mt-1 text-2xl font-bold">£{summary.profit.toFixed(0)}</p>
          <p className="mt-1 text-xs text-white/70">
            6 Apr {startYear} – today
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">By platform</p>
          <div className="mt-2 space-y-1.5 text-sm">
            {summary.byPlatform.length === 0 && (
              <p className="text-muted">No sales yet</p>
            )}
            {summary.byPlatform.map((p) => (
              <div key={p.platform} className="flex items-center justify-between">
                <span>{platformLabel(p.platform)}</span>
                <span className="font-semibold">£{p.profit.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="flex items-center justify-between px-5">
          <h2 className="text-lg font-bold">Recent sales</h2>
          <Link href="/sales" className="text-sm font-semibold text-brand">
            See all
          </Link>
        </div>

        <div className="mt-2 rounded-2xl border border-border bg-surface">
          {recent.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted">
              No sales logged yet.{" "}
              <Link href="/sales/new" className="font-semibold text-brand">
                Add your first sale
              </Link>
              .
            </div>
          ) : (
            recent.map((sale) => <SaleRow key={sale.id} sale={sale} />)
          )}
        </div>
      </section>
    </div>
  );
}

function remainingCopy(check: ReturnType<typeof hmrcCheck>) {
  const salesLeft = Math.max(0, check.salesTarget - check.salesCount);
  const moneyLeft = Math.max(0, check.moneyTarget - check.moneyTaken);

  if (check.status === "Likely to be reported") {
    return `You've passed ${check.salesTarget} sales or £${check.moneyTarget.toFixed(0)} taken this calendar year, so Vinted, eBay and Depop are likely to share your totals with HMRC.`;
  }

  return `${salesLeft} more sale${salesLeft === 1 ? "" : "s"} (or £${moneyLeft.toFixed(0)} more taken) this calendar year and Vinted, eBay and Depop will share your totals with HMRC.`;
}
