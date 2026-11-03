export const metadata = { title: "You're offline · FlipTally" };

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 9a16 16 0 0 1 22 0M5 13a10.5 10.5 0 0 1 14 0M8.5 17a5.5 5.5 0 0 1 7 0" />
          <path d="M12 20h.01" />
          <path d="M2 2l20 20" />
        </svg>
      </span>

      <h1 className="mt-4 text-xl font-bold">You&rsquo;re offline</h1>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
        FlipTally can&rsquo;t reach the server right now. Pages you&rsquo;ve already
        opened may still work from where you left off, but adding or editing sales
        needs a connection.
      </p>

      {/* A plain anchor forces a full navigation/network retry, which is what
          "try again" should do here — a client-side <Link> would just fail silently. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="mt-6 rounded-xl bg-brand-dark px-5 py-3 text-sm font-semibold text-white"
      >
        Try again
      </a>
    </div>
  );
}
