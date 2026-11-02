import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salesToCsv } from "@/lib/csv";
import { taxYearRange } from "@/lib/dates";

export async function GET(request: NextRequest) {
  const startYear = Number(request.nextUrl.searchParams.get("taxYear"));
  let sales = await prisma.sale.findMany({ orderBy: { dateSold: "desc" } });

  if (Number.isFinite(startYear) && startYear > 0) {
    const { start, end } = taxYearRange(startYear);
    sales = sales.filter((s) => {
      const d = new Date(s.dateSold);
      return d >= start && d <= end;
    });
  }

  const csv = salesToCsv(sales);
  const filename = Number.isFinite(startYear) && startYear > 0
    ? `fliptally-${startYear}-${startYear + 1}.csv`
    : "fliptally-all-sales.csv";

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
