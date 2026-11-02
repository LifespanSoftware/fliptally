import Link from "next/link";
import type { SaleDTO } from "@/lib/types";
import PlatformBadge from "./PlatformBadge";
import { formatDate } from "@/lib/dates";
import { platformLabel, saleProfit } from "@/lib/money";

export default function SaleRow({ sale }: { sale: SaleDTO }) {
  const isResale = sale.reason === "RESALE";
  const profit = saleProfit(sale);

  return (
    <Link
      href={`/sales/${sale.id}`}
      className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-b-0"
    >
      <PlatformBadge platform={sale.platform} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{sale.itemName}</p>
        <p className="text-sm text-muted">
          {platformLabel(sale.platform)} · {formatDate(sale.dateSold)} ·{" "}
          {isResale ? "Resale" : "Clear-out"}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-semibold">£{sale.soldFor.toFixed(2)}</p>
        <p className={`text-sm ${isResale ? "text-profit" : "text-muted"}`}>
          {isResale ? `+£${profit.toFixed(2)}` : "Own item"}
        </p>
      </div>
    </Link>
  );
}
