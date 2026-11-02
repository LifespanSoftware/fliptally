import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toSaleDTO } from "@/lib/types";
import SaleForm from "../SaleForm";

export default async function EditSalePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sale = await prisma.sale.findUnique({ where: { id } });
  if (!sale) notFound();

  return <SaleForm mode="edit" sale={toSaleDTO(sale)} />;
}
