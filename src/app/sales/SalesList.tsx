"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SaleRow from "@/components/SaleRow";
import type { SaleDTO } from "@/lib/types";
import { platformLabel } from "@/lib/money";

type ReasonFilter = "ALL" | "RESALE" | "CLEAR_OUT";

export default function SalesList({ sales }: { sales: SaleDTO[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState<ReasonFilter>("ALL");
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const platformsPresent = useMemo(
    () => Array.from(new Set(sales.map((s) => s.platform))),
    [sales]
  );

  const counts = useMemo(
    () => ({
      ALL: sales.length,
      RESALE: sales.filter((s) => s.reason === "RESALE").length,
      CLEAR_OUT: sales.filter((s) => s.reason === "CLEAR_OUT").length,
    }),
    [sales]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sales.filter((s) => {
      if (reasonFilter !== "ALL" && s.reason !== reasonFilter) return false;
      if (platformFilter && s.platform !== platformFilter) return false;
      if (q && !s.itemName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sales, query, reasonFilter, platformFilter]);

  async function handleImport(file: File) {
    setImporting(true);
    setImportMessage(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/sales/import", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed.");
      setImportMessage(
        `Imported ${data.imported} sale${data.imported === 1 ? "" : "s"}.` +
          (data.errors?.length ? ` ${data.errors.length} row(s) skipped.` : "")
      );
      router.refresh();
    } catch (err) {
      setImportMessage(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5">
        <h1 className="text-2xl font-bold">Sales</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-semibold disabled:opacity-60"
        >
          <DownloadIcon />
          {importing ? "Importing…" : "Import CSV"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImport(file);
          }}
        />
      </div>

      {importMessage && (
        <p className="mx-5 mt-2 rounded-xl bg-brand-light px-3 py-2 text-sm text-brand-dark">
          {importMessage}
        </p>
      )}

      <div className="mx-5 mt-4">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your sales"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div className="mx-5 mt-3 flex flex-wrap gap-2">
        <Chip active={reasonFilter === "ALL"} onClick={() => setReasonFilter("ALL")}>
          All · {counts.ALL}
        </Chip>
        <Chip active={reasonFilter === "RESALE"} onClick={() => setReasonFilter("RESALE")}>
          Resale · {counts.RESALE}
        </Chip>
        <Chip active={reasonFilter === "CLEAR_OUT"} onClick={() => setReasonFilter("CLEAR_OUT")}>
          Clear-out · {counts.CLEAR_OUT}
        </Chip>
      </div>

      {platformsPresent.length > 0 && (
        <div className="mx-5 mt-2 flex flex-wrap gap-2">
          {platformsPresent.map((p) => (
            <Chip
              key={p}
              active={platformFilter === p}
              onClick={() => setPlatformFilter(platformFilter === p ? null : p)}
            >
              {platformLabel(p)}
            </Chip>
          ))}
        </div>
      )}

      <p className="mx-5 mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Latest
      </p>

      <div className="mx-5 rounded-2xl border border-border bg-surface">
        {filtered.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">
            {sales.length === 0 ? "No sales logged yet." : "No sales match your filters."}
          </p>
        ) : (
          filtered.map((sale) => <SaleRow key={sale.id} sale={sale} />)
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-foreground text-background" : "border border-border bg-surface text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}
