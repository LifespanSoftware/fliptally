export const PLATFORMS = ["VINTED", "EBAY", "DEPOP", "OTHER"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const REASONS = ["RESALE", "CLEAR_OUT"] as const;
export type Reason = (typeof REASONS)[number];

export function isPlatform(value: string): value is Platform {
  return (PLATFORMS as readonly string[]).includes(value);
}

export function isReason(value: string): value is Reason {
  return (REASONS as readonly string[]).includes(value);
}

/** Plain-JSON shape of a Sale, safe to pass from a server component to a client component. */
export interface SaleDTO {
  id: string;
  itemName: string;
  platform: string;
  reason: string;
  soldFor: number;
  paidFor: number;
  fees: number;
  dateSold: string;
  photoUrl: string | null;
  notes: string | null;
}

export function toSaleDTO(sale: {
  id: string;
  itemName: string;
  platform: string;
  reason: string;
  soldFor: number;
  paidFor: number;
  fees: number;
  dateSold: Date | string;
  photoUrl: string | null;
  notes: string | null;
}): SaleDTO {
  return {
    ...sale,
    dateSold: new Date(sale.dateSold).toISOString(),
  };
}
