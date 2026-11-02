import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "fliptally_auth";

export async function POST(request: NextRequest) {
  const passcode = process.env.FLIPTALLY_PASSCODE;
  const body = await request.json().catch(() => ({}));
  const entered = typeof body.passcode === "string" ? body.passcode : "";

  if (!passcode || entered !== passcode) {
    return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, passcode, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });
  return res;
}
