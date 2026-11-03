import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "fliptally_auth";

export function proxy(request: NextRequest) {
  const passcode = process.env.FLIPTALLY_PASSCODE;
  if (!passcode) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/_next") ||
    // Service worker, manifest and app icons must stay reachable without a
    // session cookie so an installed/offline PWA shell can always load.
    pathname === "/sw.js" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/offline" ||
    pathname === "/icon-192" ||
    pathname === "/icon-512" ||
    pathname === "/icon" ||
    pathname === "/apple-icon";

  if (isPublic) return NextResponse.next();

  const authed = request.cookies.get(COOKIE_NAME)?.value === passcode;
  if (authed) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
