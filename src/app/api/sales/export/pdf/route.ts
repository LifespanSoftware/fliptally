import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import { taxYearLabel, taxYearRange, formatDateLong } from "@/lib/dates";
import { platformLabel, taxYearSummary, TRADING_ALLOWANCE } from "@/lib/money";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const startYear = Number(request.nextUrl.searchParams.get("taxYear"));
  if (!Number.isFinite(startYear) || startYear <= 0) {
    return NextResponse.json({ error: "Missing or invalid taxYear." }, { status: 400 });
  }

  const sales = await prisma.sale.findMany({ orderBy: { dateSold: "asc" } });
  const summary = taxYearSummary(sales, startYear);
  const { start, end } = taxYearRange(startYear);
  const inYear = sales.filter((s) => {
    const d = new Date(s.dateSold);
    return d >= start && d <= end;
  });

  const doc = new PDFDocument({ size: "A4", margin: 48 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc
    .fontSize(20)
    .fillColor("#146356")
    .text("FlipTally", { continued: true })
    .fillColor("#1b2420")
    .text(" — Tax year summary");

  doc
    .moveDown(0.2)
    .fontSize(11)
    .fillColor("#51584f")
    .text(`Tax year ${taxYearLabel(startYear)} (6 Apr ${startYear} – 5 Apr ${startYear + 1})`)
    .text(`Generated ${formatDateLong(new Date())}`);

  doc.moveDown(1);
  doc.fontSize(13).fillColor("#1b2420").text("Summary", { underline: true });
  doc.moveDown(0.4);

  const summaryRows: [string, string][] = [
    ["Resale takings", `£${summary.resaleTakings.toFixed(2)}`],
    ["What you paid for items", `-£${summary.costOfGoods.toFixed(2)}`],
    ["Postage & fees", `-£${summary.postageFees.toFixed(2)}`],
    ["Profit", `£${summary.profit.toFixed(2)}`],
    ["Trading allowance", `£${TRADING_ALLOWANCE.toFixed(2)}`],
    ["Clear-outs (own items, usually not taxable)", `£${summary.clearOutTotal.toFixed(2)}`],
  ];

  doc.fontSize(11);
  for (const [label, value] of summaryRows) {
    doc.fillColor("#1b2420").text(label, { continued: true });
    doc.text(value, { align: "right" });
  }

  if (summary.byPlatform.length > 0) {
    doc.moveDown(1);
    doc.fontSize(13).text("Profit by platform", { underline: true });
    doc.moveDown(0.4);
    doc.fontSize(11);
    for (const p of summary.byPlatform) {
      doc.text(platformLabel(p.platform), { continued: true });
      doc.text(`£${p.profit.toFixed(2)}`, { align: "right" });
    }
  }

  doc.moveDown(1);
  doc.fontSize(13).text("Sales", { underline: true });
  doc.moveDown(0.4);
  doc.fontSize(9.5);

  for (const sale of inYear) {
    const date = formatDateLong(sale.dateSold);
    const reason = sale.reason === "RESALE" ? "Resale" : "Clear-out";
    const profit = sale.reason === "RESALE" ? ` · +£${(sale.soldFor - sale.paidFor - sale.fees).toFixed(2)}` : "";
    doc
      .fillColor("#1b2420")
      .text(
        `${date} · ${platformLabel(sale.platform)} · ${sale.itemName} — sold £${sale.soldFor.toFixed(2)} (${reason})${profit}`
      );
  }

  doc.moveDown(1.5);
  doc
    .fontSize(8.5)
    .fillColor("#6b7570")
    .text("FlipTally gives general guidance, not tax advice. Not affiliated with Vinted, eBay, Depop or HMRC.");

  doc.end();
  const buffer = await done;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="fliptally-${startYear}-${startYear + 1}.pdf"`,
    },
  });
}
