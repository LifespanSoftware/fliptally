import { isPlatform, isReason } from "./types";

export interface SaleInput {
  itemName: string;
  platform: string;
  reason: string;
  soldFor: number;
  paidFor: number;
  fees: number;
  dateSold: string;
  notes?: string | null;
}

export class ValidationError extends Error {}

export function parseSaleInput(body: unknown): SaleInput {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Expected a JSON object.");
  }
  const b = body as Record<string, unknown>;

  const itemName = String(b.itemName ?? "").trim();
  if (!itemName) throw new ValidationError("What did you sell? is required.");

  const platform = String(b.platform ?? "").toUpperCase();
  if (!isPlatform(platform)) throw new ValidationError("Choose a valid platform.");

  const reason = String(b.reason ?? "").toUpperCase();
  if (!isReason(reason)) throw new ValidationError("Choose why you were selling it.");

  const soldFor = toNumber(b.soldFor);
  if (soldFor === null || soldFor < 0) throw new ValidationError("Enter what it sold for.");

  const paidFor = toNumber(b.paidFor);
  if (paidFor === null || paidFor < 0) throw new ValidationError("Enter what you paid for it.");

  const fees = toNumber(b.fees) ?? 0;
  if (fees < 0) throw new ValidationError("Postage & fees can't be negative.");

  const dateSoldRaw = String(b.dateSold ?? "");
  const dateSold = new Date(dateSoldRaw);
  if (Number.isNaN(dateSold.getTime())) throw new ValidationError("Enter a valid date sold.");

  const notes = b.notes ? String(b.notes).trim().slice(0, 2000) : null;

  return { itemName: itemName.slice(0, 200), platform, reason, soldFor, paidFor, fees, dateSold: dateSold.toISOString(), notes };
}

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}
