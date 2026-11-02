import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";
import type { Sale } from "@prisma/client";
import { isPlatform, isReason } from "./types";

export const CSV_HEADERS = [
  "Item",
  "Platform",
  "Reason",
  "Sold for",
  "Paid",
  "Postage & fees",
  "Date sold",
  "Notes",
] as const;

export function salesToCsv(sales: Sale[]): string {
  const rows = sales.map((s) => [
    s.itemName,
    s.platform,
    s.reason === "RESALE" ? "Resale" : "Clear-out",
    s.soldFor.toFixed(2),
    s.paidFor.toFixed(2),
    s.fees.toFixed(2),
    new Date(s.dateSold).toISOString().slice(0, 10),
    s.notes ?? "",
  ]);
  return stringify([CSV_HEADERS as unknown as string[], ...rows]);
}

export interface ParsedCsvRow {
  itemName: string;
  platform: string;
  reason: string;
  soldFor: number;
  paidFor: number;
  fees: number;
  dateSold: string;
  notes: string | null;
}

export interface CsvParseResult {
  rows: ParsedCsvRow[];
  errors: { row: number; message: string }[];
}

const HEADER_ALIASES: Record<string, string> = {
  item: "item",
  "item name": "item",
  title: "item",
  description: "item",
  platform: "platform",
  site: "platform",
  marketplace: "platform",
  reason: "reason",
  type: "reason",
  "sold for": "soldFor",
  price: "soldFor",
  "sale price": "soldFor",
  "total price": "soldFor",
  paid: "paidFor",
  cost: "paidFor",
  "you paid": "paidFor",
  "item cost": "paidFor",
  "postage & fees": "fees",
  "postage and fees": "fees",
  fees: "fees",
  postage: "fees",
  "date sold": "dateSold",
  date: "dateSold",
  notes: "notes",
};

export function parseSalesCsv(text: string): CsvParseResult {
  const records: Record<string, string>[] = parse(text, {
    columns: (header: string[]) =>
      header.map((h) => HEADER_ALIASES[h.trim().toLowerCase()] ?? h.trim()),
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  const rows: ParsedCsvRow[] = [];
  const errors: { row: number; message: string }[] = [];

  records.forEach((record, index) => {
    const rowNum = index + 2; // header is row 1
    try {
      const itemName = (record.item ?? "").trim();
      if (!itemName) throw new Error("Missing item name.");

      const platform = (record.platform ?? "OTHER").trim().toUpperCase();
      const resolvedPlatform = isPlatform(platform) ? platform : "OTHER";

      const reasonRaw = (record.reason ?? "RESALE").trim().toUpperCase();
      const resolvedReason = reasonRaw.startsWith("CLEAR") || reasonRaw === "CLEAR_OUT"
        ? "CLEAR_OUT"
        : isReason(reasonRaw)
          ? reasonRaw
          : "RESALE";

      const soldFor = parseMoney(record.soldFor);
      if (soldFor === null) throw new Error("Missing or invalid 'Sold for' amount.");
      const paidFor = parseMoney(record.paidFor) ?? 0;
      const fees = parseMoney(record.fees) ?? 0;

      const dateSold = parseDateFlexible(record.dateSold);
      if (!dateSold) throw new Error("Missing or invalid date sold.");

      rows.push({
        itemName: itemName.slice(0, 200),
        platform: resolvedPlatform,
        reason: resolvedReason,
        soldFor,
        paidFor,
        fees,
        dateSold,
        notes: record.notes?.trim() || null,
      });
    } catch (err) {
      errors.push({ row: rowNum, message: err instanceof Error ? err.message : "Could not read this row." });
    }
  });

  return { rows, errors };
}

function parseMoney(value: string | undefined): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[£,\s]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

function parseDateFlexible(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  const direct = new Date(trimmed);
  if (!Number.isNaN(direct.getTime())) return direct.toISOString();

  const dmy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const year = y.length === 2 ? Number(y) + 2000 : Number(y);
    const date = new Date(year, Number(m) - 1, Number(d));
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  return null;
}
