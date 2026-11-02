"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });

    if (!res.ok) {
      setError("That passcode isn't right.");
      setSubmitting(false);
      return;
    }

    router.replace(params.get("next") ?? "/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l5-5 4 4 8-8" />
          <path d="M15 8h5v5" />
        </svg>
      </span>
      <h1 className="mt-4 text-xl font-bold">
        Flip<span className="text-brand">Tally</span>
      </h1>
      <p className="mt-1 text-sm text-muted">Enter the passcode to continue</p>

      <form onSubmit={handleSubmit} className="mt-6 w-full max-w-xs">
        <input
          autoFocus
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          className="input text-center text-lg tracking-widest"
        />
        {error && <p className="mt-2 text-center text-sm text-accent">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-xl bg-brand-dark py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
