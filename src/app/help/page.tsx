import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Help · FlipTally" };

interface Section {
  title: string;
  screenshot: string;
  summary: string;
  tips: string[];
}

const SECTIONS: Section[] = [
  {
    title: "Home — your HMRC reporting check",
    screenshot: "/screenshots/home.png",
    summary:
      "The home screen tracks your progress towards the point where Vinted, eBay and Depop start sharing your sales totals with HMRC, plus your profit for the current tax year and a quick breakdown by platform.",
    tips: [
      "The sales count and money-taken bars reset every calendar year (1 Jan – 31 Dec), separately from the tax year below.",
      "“Getting close” appears once you're 70% of the way to either threshold; “Likely to be reported” once you pass one.",
      "Tap “What this means for me” for a plain-English explanation — being reported doesn't mean you owe tax.",
    ],
  },
  {
    title: "Add a sale",
    screenshot: "/screenshots/add-sale.png",
    summary:
      "Tap the + button from any tab to log a sale. Profit is calculated live as you fill in the form.",
    tips: [
      "Choose Resale if you bought the item to sell on, or Clear-out if it's one of your own things — clear-outs are usually not taxable and are kept separate from your trading totals.",
      "Postage & fees covers anything that ate into what you actually received — platform fees, packaging, postage you paid.",
      "A receipt photo is optional and stored with the sale for your own records.",
    ],
  },
  {
    title: "Sales — everything in one list",
    screenshot: "/screenshots/sales.png",
    summary:
      "Every sale across every platform, searchable and filterable, with resale profit or clear-out status shown at a glance.",
    tips: [
      "Use the search bar to find a sale by item name.",
      "Filter by Resale/Clear-out, and tap a platform chip to narrow to just Vinted, eBay, Depop or Other.",
      "Import CSV brings in sales from a spreadsheet — FlipTally recognises common column names like Item, Platform, Sold for, Paid and Date sold.",
      "Tap any sale to edit or delete it.",
    ],
  },
  {
    title: "Tax year — your trading allowance",
    screenshot: "/screenshots/tax-year.png",
    summary:
      "A plain-English summary of where you stand for the current UK tax year (6 April – 5 April) against the £1,000 trading allowance.",
    tips: [
      "Only resale takings count towards the £1,000 allowance — clear-outs of your own belongings are shown separately and usually aren't taxable.",
      "Profit = resale takings minus what you paid for items minus postage & fees.",
      "Export summary gives you a PDF or CSV of the full tax year, handy for your own records or an accountant.",
      "Making Tax Digital for Income Tax starts from April 2027 for sole traders earning over £30,000 — FlipTally will keep this card updated as rules change.",
    ],
  },
  {
    title: "Me — settings and guidance",
    screenshot: "/screenshots/me.png",
    summary:
      "Export all your data, revisit this Help page or the Changelog, and jump straight to HMRC's own guidance.",
    tips: [
      "“Export all sales (CSV)” downloads every sale you've ever logged, not just the current tax year.",
      "If your deployment has a passcode set, this is also where you'd go to find out what FlipTally can and can't do for you.",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background px-5 pb-16 pt-6">
      <Link href="/me" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 0 1 4.8 1c0 1.5-2.3 1.8-2.3 3.5" />
            <path d="M12 17.2v.1" />
          </svg>
        </span>
        <div>
          <h1 className="text-2xl font-bold">Help</h1>
          <p className="text-sm text-muted">A quick tour of FlipTally, tab by tab</p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {SECTIONS.map((section) => (
          <section key={section.title} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="relative aspect-[407/883] w-full border-b border-border bg-background">
              <Image
                src={section.screenshot}
                alt={`${section.title} screenshot`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 480px) 100vw, 407px"
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold">{section.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{section.summary}</p>
              <ul className="mt-3 space-y-2">
                {section.tips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-sm leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        Still stuck?{" "}
        <Link href="/changelog#hmrc" className="font-semibold text-brand">
          Read how HMRC reporting works
        </Link>{" "}
        or check{" "}
        <a
          href="https://www.gov.uk/guidance/selling-online-and-paying-taxes-income-tax"
          className="font-semibold text-brand"
        >
          gov.uk
        </a>
        .
      </p>
    </div>
  );
}
