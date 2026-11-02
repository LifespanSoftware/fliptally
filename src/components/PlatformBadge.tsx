import { platformInitial } from "@/lib/money";

const STYLES: Record<string, string> = {
  VINTED: "bg-[var(--vinted-bg)] text-[var(--vinted-fg)]",
  EBAY: "bg-[var(--ebay-bg)] text-[var(--ebay-fg)]",
  DEPOP: "bg-[var(--depop-bg)] text-[var(--depop-fg)]",
  OTHER: "bg-[var(--other-bg)] text-[var(--other-fg)]",
};

export default function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
        STYLES[platform] ?? STYLES.OTHER
      }`}
    >
      {platformInitial(platform)}
    </span>
  );
}
