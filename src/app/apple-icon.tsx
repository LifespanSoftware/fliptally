import { ImageResponse } from "next/og";
import { brandMark } from "@/lib/brandMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // iOS applies its own corner mask, so this stays a plain square.
  return new ImageResponse(brandMark({ canvasSize: size.width, radius: 0 }), { ...size });
}
