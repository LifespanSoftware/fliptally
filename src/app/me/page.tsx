import Link from "next/link";
import TopBar from "@/components/TopBar";

export default function MePage() {
  return (
    <div>
      <TopBar title="Me" />

      <div className="px-5">
        <section className="mt-2 rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-lg font-bold text-brand-dark">
              FT
            </span>
            <div>
              <p className="font-semibold">Your FlipTally</p>
              <p className="text-sm text-muted">V0.0 beta · self-hosted</p>
            </div>
          </div>
        </section>

        <nav className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
          <MenuLink href="/api/sales/export" label="Export all sales (CSV)" download />
          <MenuLink href="/changelog" label="What's new · Changelog" />
          <MenuLink href="/changelog#hmrc" label="How HMRC reporting works" />
          <MenuLink href="https://www.gov.uk/guidance/selling-online-and-paying-taxes-income-tax" label="HMRC guidance (gov.uk)" external last />
        </nav>

        <section className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-muted">
          <p className="font-semibold text-foreground">About FlipTally</p>
          <p className="mt-1">
            FlipTally keeps every sale in one simple list, works out your profit, and tells you in
            plain English where you stand with HMRC. It gives general guidance, not tax advice, and
            isn&rsquo;t affiliated with Vinted, eBay, Depop or HMRC.
          </p>
          <p className="mt-3">
            Designed by{" "}
            <a href="https://lifespansoftware.com" className="font-semibold text-brand">
              Lifespan Software
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

function MenuLink({
  href,
  label,
  download,
  external,
  last,
}: {
  href: string;
  label: string;
  download?: boolean;
  external?: boolean;
  last?: boolean;
}) {
  const className = `flex items-center justify-between px-4 py-3.5 text-sm font-medium ${
    last ? "" : "border-b border-border"
  }`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
        <ChevronIcon />
      </a>
    );
  }

  if (download) {
    return (
      <a href={href} download className={className}>
        {label}
        <ChevronIcon />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
      <ChevronIcon />
    </Link>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
