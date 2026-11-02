import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSaleInput, ValidationError } from "@/lib/validation";

type Params = Promise<{ id: string }>;

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const sale = await prisma.sale.findUnique({ where: { id } });
  if (!sale) return NextResponse.json({ error: "Sale not found." }, { status: 404 });
  return NextResponse.json({ sale });
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const input = parseSaleInput(body);
    const sale = await prisma.sale.update({ where: { id }, data: input });
    return NextResponse.json({ sale });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong updating that sale." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  await prisma.sale.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
