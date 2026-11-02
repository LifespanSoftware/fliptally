import { prisma } from "@/lib/prisma";
import TopBar from "@/components/TopBar";
import SalesList from "./SalesList";
import { toSaleDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const sales = await prisma.sale.findMany({ orderBy: { dateSold: "desc" } });

  return (
    <div>
      <TopBar />
      <SalesList sales={sales.map(toSaleDTO)} />
    </div>
  );
}
