/** Shared mark for icon.tsx, apple-icon.tsx and the manifest icon routes (next/og ImageResponse). */
export function brandMark({
  canvasSize,
  background = "#146356",
  radius = 0,
  markRatio = 0.56,
  strokeWidth = 2.6,
}: {
  canvasSize: number;
  background?: string;
  radius?: number;
  markRatio?: number;
  strokeWidth?: number;
}) {
  const markSize = Math.round(canvasSize * markRatio);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
        borderRadius: radius,
      }}
    >
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 17l5-5 4 4 8-8" />
        <path d="M15 8h5v5" />
      </svg>
    </div>
  );
}
