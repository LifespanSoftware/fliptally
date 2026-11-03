import { ImageResponse } from "next/og";
import { brandMark } from "@/lib/brandMark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(brandMark({ canvasSize: size.width, radius: 16 }), { ...size });
}
