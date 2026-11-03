import { ImageResponse } from "next/og";
import { brandMark } from "@/lib/brandMark";

// Dedicated PWA manifest icon (not a favicon tag) — see src/app/manifest.ts.
export const dynamic = "force-static";
export const size = 512;

export function GET() {
  return new ImageResponse(brandMark({ canvasSize: size, radius: 85 }), {
    width: size,
    height: size,
  });
}
