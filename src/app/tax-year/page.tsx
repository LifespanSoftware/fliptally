import { prisma } from "@/lib/prisma";
import { ukTaxYearStart, taxYearLabel, taxYearRange, formatDateLong } from "@/lib/dates";
import { taxYearSummary, TRADING_ALLOWANCE, MTD_THRESHOLD, round2 } from "@/lib/money";
import ProgressBar from "@/components/ProgressBar";
import ExportButton from "./ExportButton";

export const dynamic = "force-dynamic";

export default async function TaxYearPage() {
  const sales = await prisma.sale.findMany();
  const startYear = ukTaxYearStart(new Date());
  const summary = taxYearSummary(sales, startYear);
  const { start, end } = taxYearRange(startYear);

  const allowanceLeft = round2(Math.max(0, TRADING_ALLOWANCE - summary.resaleTakings));
  const overAllowance = summary.resaleTakings > TRADING_ALLOWANCE;

  return (
    <div className="px-5 pt-6">
      <h1 className="text-2xl font-bold">Tax year {taxYearLabel(startYear)}</h1>
      <p className="mt-1 text-sm text-muted">
        {formatDateLong(start)} – {formatDateLong(end)}
      </p>

      <section className="mt-5 rounded-2xl border border-border bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Trading allowance
        </p>
        <p className="mt-1">
          <span className="text-3xl font-bold">£{summary.resaleTakings.toFixed(0)}</span>
          <span className="ml-1.5 text-muted">of £{TRADING_ALLOWANCE.toFixed(0)}</span>
        </p>
        <div className="mt-3">
          <ProgressBar
            value={summary.resaleTakings}
            max={TRADING_ALLOWANCE}
            color={overAllowance ? "var(--accent)" : "var(--accent)"}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {overAllowance ? (
            <>
              Your resale takings are £{round2(summary.resaleTakings - TRADING_ALLOWANCE).toFixed(0)} over the
              allowance this tax year. You usually need to tell HMRC about this income.
            </>
          ) : (
            <>
              Your resale takings are £{allowanceLeft.toFixed(0)} under the allowance. If they stay under
              £{TRADING_ALLOWANCE.toFixed(0)} this tax year, you usually don&rsquo;t need to tell HMRC.
            </>
          )}
        </p>
      </section>

      <section className="mt-3 rounded-2xl border border-border bg-surface p-4">
        <Row label="Resale takings" value={`£${summary.resaleTakings.toFixed(2)}`} />
        <Row label="What you paid for items" value={`-£${summary.costOfGoods.toFixed(2)}`} />
        <Row label="Postage & fees" value={`-£${summary.postageFees.toFixed(2)}`} />
        <Row label="Profit" value={`£${summary.profit.toFixed(2)}`} bold highlight last />
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Clear-outs</p>
          <p className="mt-1 text-2xl font-bold">£{summary.clearOutTotal.toFixed(0)}</p>
          <p className="mt-1 text-xs text-muted">Selling your own things is usually not taxable</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Making Tax Digital
          </p>
          <p className="mt-1 text-2xl font-bold">Not yet</p>
          <p className="mt-1 text-xs text-muted">
            Starts at £{(MTD_THRESHOLD / 1000).toFixed(0)},000 income from April 2027
          </p>
        </div>
      </section>

      <div className="mt-5">
        <ExportButton startYear={startYear} />
      </div>

      <p className="mt-3 pb-4 text-center text-xs text-muted">
        FlipTally gives general guidance, not tax advice.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
  last,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${last ? "" : "border-b border-border"}`}>
      <span className={bold ? "font-semibold" : "text-sm"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-profit" : ""}`}>
        {value}
      </span>
    </div>
  );
}
