import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "FlipTally — resale profit & HMRC tracker",
    short_name: "FlipTally",
    description:
      "Track your sales, costs and profit on Vinted, eBay, Depop and similar sites, and see where you stand with HMRC's reporting thresholds.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f1e9",
    theme_color: "#146356",
    categories: ["finance", "productivity"],
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      {
        name: "Add a sale",
        short_name: "Add sale",
        description: "Log a new sale",
        url: "/sales/new",
      },
      {
        name: "Sales",
        short_name: "Sales",
        description: "View all your sales",
        url: "/sales",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/home.png",
        sizes: "814x1766",
        type: "image/png",
        form_factor: "narrow",
        label: "Home — HMRC reporting check and profit this tax year",
      },
      {
        src: "/screenshots/sales.png",
        sizes: "814x1766",
        type: "image/png",
        form_factor: "narrow",
        label: "Sales — search and filter every sale",
      },
    ],
  };
}
