import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSaleInput, ValidationError } from "@/lib/validation";

export async function GET() {
  const sales = await prisma.sale.findMany({ orderBy: { dateSold: "desc" } });
  return NextResponse.json({ sales });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = parseSaleInput(body);
    const sale = await prisma.sale.create({ data: input });
    return NextResponse.json({ sale }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong saving that sale." }, { status: 500 });
  }
}
