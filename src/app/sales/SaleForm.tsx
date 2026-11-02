"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SaleDTO } from "@/lib/types";
import { PLATFORMS, REASONS } from "@/lib/types";
import { platformLabel, round2 } from "@/lib/money";

const PLATFORM_LABELS: Record<string, string> = Object.fromEntries(
  PLATFORMS.map((p) => [p, platformLabel(p)])
);

function todayInputValue() {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
}

export default function SaleForm({
  mode,
  sale,
}: {
  mode: "create" | "edit";
  sale?: SaleDTO;
}) {
  const router = useRouter();

  const [itemName, setItemName] = useState(sale?.itemName ?? "");
  const [platform, setPlatform] = useState(sale?.platform ?? "VINTED");
  const [reason, setReason] = useState(sale?.reason ?? "RESALE");
  const [soldFor, setSoldFor] = useState(sale ? String(sale.soldFor) : "");
  const [paidFor, setPaidFor] = useState(sale ? String(sale.paidFor) : "");
  const [fees, setFees] = useState(sale ? String(sale.fees) : "");
  const [dateSold, setDateSold] = useState(
    sale ? sale.dateSold.slice(0, 10) : todayInputValue()
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(sale?.photoUrl ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profit = useMemo(() => {
    const sf = parseFloat(soldFor) || 0;
    const pf = parseFloat(paidFor) || 0;
    const fe = parseFloat(fees) || 0;
    return round2(sf - pf - fe);
  }, [soldFor, paidFor, fees]);

  const isResale = reason === "RESALE";

  function close() {
    router.back();
  }

  async function handlePhoto(file: File) {
    if (file.size > 1_500_000) {
      setError("That photo is a bit large — try one under 1.5MB.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setPhotoUrl(dataUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      itemName,
      platform,
      reason,
      soldFor: parseFloat(soldFor) || 0,
      paidFor: parseFloat(paidFor) || 0,
      fees: parseFloat(fees) || 0,
      dateSold,
      photoUrl,
    };

    try {
      const url = mode === "create" ? "/api/sales" : `/api/sales/${sale!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't save that sale.");

      router.push("/sales");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that sale.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col pb-10">
      <div className="flex items-center justify-between px-5 pb-2 pt-6">
        <button
          onClick={close}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <h1 className="text-lg font-bold">{mode === "create" ? "Add a sale" : "Edit sale"}</h1>
        <div className="w-9" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 px-5 pt-4">
        <Field label="What did you sell?">
          <input
            required
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Nike Air Max 90"
            className="input"
          />
        </Field>

        <div>
          <Label>Where?</Label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {PLATFORMS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPlatform(p)}
                className={`rounded-xl border px-2 py-2.5 text-sm font-semibold ${
                  platform === p ? "border-brand bg-brand-light text-brand-dark" : "border-border bg-surface"
                }`}
              >
                {PLATFORM_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Why were you selling it?</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {REASONS.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setReason(r)}
                className={`rounded-xl border px-3 py-2.5 text-left ${
                  reason === r ? "border-brand bg-brand-light" : "border-border bg-surface"
                }`}
              >
                <p className="text-sm font-semibold">{r === "RESALE" ? "Resale" : "Clear-out"}</p>
                <p className="text-xs text-muted">
                  {r === "RESALE" ? "Bought to sell on" : "My own stuff"}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Sold for">
            <MoneyInput value={soldFor} onChange={setSoldFor} />
          </Field>
          <Field label="You paid">
            <MoneyInput value={paidFor} onChange={setPaidFor} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Postage & fees">
            <MoneyInput value={fees} onChange={setFees} />
          </Field>
          <Field label="Date sold">
            <input
              required
              type="date"
              value={dateSold}
              onChange={(e) => setDateSold(e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface px-4 py-3.5 text-sm font-medium text-muted">
          <CameraIcon />
          {photoUrl ? "Receipt photo added — tap to change" : "Add receipt photo (optional)"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handlePhoto(file);
            }}
          />
        </label>

        {error && <p className="rounded-xl bg-accent-light px-3 py-2 text-sm text-accent">{error}</p>}

        <div className="mt-auto flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5">
          <div>
            <p className="font-semibold">Your profit</p>
            <p className="text-xs text-muted">
              {isResale ? "Counts towards trading income" : "Not usually taxable"}
            </p>
          </div>
          <p className="text-2xl font-bold text-profit">£{profit.toFixed(2)}</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-brand-dark py-4 text-center font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save sale"}
        </button>

        {mode === "edit" && sale && (
          <button
            type="button"
            disabled={submitting}
            onClick={async () => {
              if (!confirm("Delete this sale? This can't be undone.")) return;
              setSubmitting(true);
              await fetch(`/api/sales/${sale.id}`, { method: "DELETE" });
              router.push("/sales");
              router.refresh();
            }}
            className="rounded-xl border border-accent py-3.5 text-center font-semibold text-accent disabled:opacity-60"
          >
            Delete sale
          </button>
        )}
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-semibold">{children}</span>;
}

function MoneyInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="input flex items-center gap-1">
      <span className="text-muted">£</span>
      <input
        required
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="w-full bg-transparent outline-none"
      />
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}
