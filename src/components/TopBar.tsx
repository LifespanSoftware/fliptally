import Link from "next/link";

export default function TopBar({ title }: { title?: string }) {
  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17l5-5 4 4 8-8" />
            <path d="M15 8h5v5" />
          </svg>
        </span>
        <span className="text-lg font-bold tracking-tight">
          {title ?? (
            <>
              Flip<span className="text-brand">Tally</span>
            </>
          )}
        </span>
      </Link>
      <Link
        href="/me"
        aria-label="Notifications and account"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </Link>
    </header>
  );
}
