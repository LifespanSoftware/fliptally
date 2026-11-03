import Link from "next/link";

export const metadata = { title: "Terms & licence · FlipTally" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-5 pb-16 pt-6">
      <Link href="/me" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold">Terms of use &amp; licence</h1>
        <p className="text-sm text-muted">What FlipTally is, and isn&rsquo;t, for</p>
      </div>

      <div className="mt-6 space-y-5">
        <section className="rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed">
          <h2 className="text-base font-bold">Usage</h2>
          <p className="mt-2">
            FlipTally is a single-user, self-hosted app for tracking your own sales, costs and
            profit on Vinted, eBay, Depop and similar sites, and for giving general guidance on
            HMRC&rsquo;s reporting thresholds. It is provided for your own personal record-keeping.
          </p>
          <p className="mt-2">
            FlipTally gives general guidance, not tax advice, and isn&rsquo;t affiliated with
            Vinted, eBay, Depop or HMRC. You&rsquo;re responsible for checking your own figures
            and for any tax filings — for anything beyond general guidance, speak to an
            accountant or HMRC directly.
          </p>
          <p className="mt-2">
            Your data lives in a single SQLite file on your own server or device. You&rsquo;re
            responsible for backing it up; FlipTally doesn&rsquo;t sync it anywhere.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed">
          <h2 className="text-base font-bold">Licence</h2>
          <p className="mt-2">
            Copyright &copy; {new Date().getFullYear()}{" "}
            <a href="https://lifespansoftware.com" className="font-semibold text-brand">
              Lifespan Software
            </a>
            . All rights reserved.
          </p>
          <p className="mt-2">
            FlipTally&rsquo;s source code is proprietary and provided for running your own
            instance of the app. It may not be copied, modified, redistributed or sublicensed
            without prior written permission. See the <code>LICENSE</code> file in the project
            repository for the full terms.
          </p>
        </section>
      </div>
    </div>
  );
}
