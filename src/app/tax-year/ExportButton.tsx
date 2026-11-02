"use client";

import { useState } from "react";

export default function ExportButton({ startYear }: { startYear: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-4 font-semibold text-background"
      >
        <DownloadIcon />
        Export summary (PDF or CSV)
      </button>

      {open && (
        <div className="absolute inset-x-0 bottom-full z-10 mb-2 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
          <a
            href={`/api/sales/export/pdf?taxYear=${startYear}`}
            className="block px-4 py-3 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Download as PDF
          </a>
          <a
            href={`/api/sales/export?taxYear=${startYear}`}
            className="block border-t border-border px-4 py-3 text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Download as CSV
          </a>
        </div>
      )}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}
