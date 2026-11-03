"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/sales", label: "Sales", icon: ListIcon },
  { href: "/tax-year", label: "Tax year", icon: DocIcon },
  { href: "/me", label: "Me", icon: PersonIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  const hidden =
    pathname.startsWith("/sales/") ||
    pathname.startsWith("/changelog") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/offline");
  if (hidden) return null;

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-border bg-background/95 backdrop-blur">
      <div className="relative flex items-end justify-between px-6 pb-3 pt-2">
        {TABS.slice(0, 2).map((tab) => (
          <NavLink key={tab.href} tab={tab} active={isActive(pathname, tab.href)} />
        ))}

        <Link
          href="/sales/new"
          aria-label="Add a sale"
          className="absolute left-1/2 top-[-22px] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 transition active:scale-95"
        >
          <PlusIcon />
        </Link>

        {TABS.slice(2).map((tab) => (
          <NavLink key={tab.href} tab={tab} active={isActive(pathname, tab.href)} />
        ))}
      </div>
    </nav>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function NavLink({
  tab,
  active,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
}) {
  const Icon = tab.icon;
  return (
    <Link
      href={tab.href}
      className={`flex w-14 flex-col items-center gap-1 text-[11px] font-medium ${
        active ? "text-brand" : "text-muted"
      }`}
    >
      <Icon active={active} />
      {tab.label}
    </Link>
  );
}

function iconProps(active?: boolean) {
  return {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: active ? 2.2 : 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function ListIcon({ active }: { active?: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" />
      <path d="M9 6h11M9 12h11M9 18h11" />
    </svg>
  );
}

function DocIcon({ active }: { active?: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 13h5M9.5 16.5h5" />
    </svg>
  );
}

function PersonIcon({ active }: { active?: boolean }) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
