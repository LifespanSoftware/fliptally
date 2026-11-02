import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSalesCsv } from "@/lib/csv";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Attach a CSV file to import." }, { status: 400 });
  }

  const text = await file.text();
  const { rows, errors } = parseSalesCsv(text);

  if (rows.length > 0) {
    await prisma.sale.createMany({ data: rows });
  }

  return NextResponse.json({ imported: rows.length, errors });
}
