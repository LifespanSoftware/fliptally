import type { Sale } from "@prisma/client";
import { calendarYearRange, taxYearRange } from "./dates";

/**
 * HMRC's digital platform reporting rules (DAC7) make platforms like Vinted, eBay and
 * Depop report sellers who, in a calendar year, either complete 30+ sales or take
 * £1,700+ in total. Being reported doesn't itself mean tax is owed.
 */
export const HMRC_SALES_THRESHOLD = 30;
export const HMRC_TAKINGS_THRESHOLD = 1700;

/** The annual tax-free trading allowance for miscellaneous/trading income. */
export const TRADING_ALLOWANCE = 1000;

/** Making Tax Digital for Income Tax applies to sole traders above this gross income, from April 2027. */
export const MTD_THRESHOLD = 30000;

export function saleProfit(sale: Pick<Sale, "soldFor" | "paidFor" | "fees">): number {
  return round2(sale.soldFor - sale.paidFor - sale.fees);
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function platformLabel(platform: string): string {
  switch (platform) {
    case "VINTED":
      return "Vinted";
    case "EBAY":
      return "eBay";
    case "DEPOP":
      return "Depop";
    default:
      return "Other";
  }
}

export function platformInitial(platform: string): string {
  return platformLabel(platform).charAt(0);
}

export interface HmrcCheck {
  year: number;
  salesCount: number;
  salesTarget: number;
  moneyTaken: number;
  moneyTarget: number;
  status: "On track" | "Getting close" | "Likely to be reported";
}

export function hmrcCheck(sales: Sale[], year: number): HmrcCheck {
  const { start, end } = calendarYearRange(year);
  const inYear = sales.filter((s) => {
    const d = new Date(s.dateSold);
    return d >= start && d <= end;
  });

  const salesCount = inYear.length;
  const moneyTaken = round2(inYear.reduce((sum, s) => sum + s.soldFor, 0));

  const salesRatio = salesCount / HMRC_SALES_THRESHOLD;
  const moneyRatio = moneyTaken / HMRC_TAKINGS_THRESHOLD;
  const worstRatio = Math.max(salesRatio, moneyRatio);

  let status: HmrcCheck["status"] = "On track";
  if (worstRatio >= 1) status = "Likely to be reported";
  else if (worstRatio >= 0.7) status = "Getting close";

  return {
    year,
    salesCount,
    salesTarget: HMRC_SALES_THRESHOLD,
    moneyTaken,
    moneyTarget: HMRC_TAKINGS_THRESHOLD,
    status,
  };
}

export interface TaxYearSummary {
  startYear: number;
  resaleTakings: number;
  costOfGoods: number;
  postageFees: number;
  profit: number;
  clearOutTotal: number;
  byPlatform: { platform: string; profit: number }[];
}

export function taxYearSummary(sales: Sale[], startYear: number): TaxYearSummary {
  const { start, end } = taxYearRange(startYear);
  const inYear = sales.filter((s) => {
    const d = new Date(s.dateSold);
    return d >= start && d <= end;
  });

  const resale = inYear.filter((s) => s.reason === "RESALE");
  const clearOuts = inYear.filter((s) => s.reason === "CLEAR_OUT");

  const resaleTakings = round2(resale.reduce((sum, s) => sum + s.soldFor, 0));
  const costOfGoods = round2(resale.reduce((sum, s) => sum + s.paidFor, 0));
  const postageFees = round2(resale.reduce((sum, s) => sum + s.fees, 0));
  const profit = round2(resaleTakings - costOfGoods - postageFees);
  const clearOutTotal = round2(clearOuts.reduce((sum, s) => sum + s.soldFor, 0));

  const platforms = ["VINTED", "EBAY", "DEPOP", "OTHER"];
  const byPlatform = platforms
    .map((platform) => ({
      platform,
      profit: round2(
        resale
          .filter((s) => s.platform === platform)
          .reduce((sum, s) => sum + saleProfit(s), 0)
      ),
    }))
    .filter((p) => p.profit !== 0);

  return { startYear, resaleTakings, costOfGoods, postageFees, profit, clearOutTotal, byPlatform };
}
