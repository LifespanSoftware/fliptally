import { ImageResponse } from "next/og";
import { brandMark } from "@/lib/brandMark";

// Dedicated PWA manifest icon (not a favicon tag) — see src/app/manifest.ts.
export const dynamic = "force-static";
export const size = 192;

export function GET() {
  return new ImageResponse(brandMark({ canvasSize: size, radius: 32 }), {
    width: size,
    height: size,
  });
}
