import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

const SITE = "https://atdbtrade.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATDB Trade International — Heavy Equipment Rental in Bangladesh" },
      {
        name: "description",
        content:
          "Bangladesh's premier heavy equipment rental partner since 2000. Cranes, excavators, rollers, and infrastructure support for national-scale projects.",
      },
      { property: "og:title", content: "ATDB Trade International — Heavy Equipment Rental" },
      {
        property: "og:description",
        content:
          "Cranes, excavators, rollers and more — 26+ years serving Bangladesh's biggest projects.",
      },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ATDB Trade International",
          url: `${SITE}/`,
          inLanguage: ["en", "bn"],
          publisher: { "@type": "Organization", name: "M/S ATDB Trade International" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "M/S ATDB Trade International",
          image: `${SITE}/assets/atdb-hero-monument-C3bd27q6.webp`,
          telephone: "+8801712106242",
          email: "saifulaapi@gmail.com",
          priceRange: "৳৳",
          address: {
            "@type": "PostalAddress",
            streetAddress: "House #319 (8F), Lane #8, East Kazi Para, Kafrul",
            addressLocality: "Dhaka",
            postalCode: "1216",
            addressCountry: "BD",
          },
          areaServed: { "@type": "Country", name: "Bangladesh" },
          foundingDate: "2000",
          sameAs: ["https://www.facebook.com/atdbtrade"],
        }),
      },
    ],
  }),
  component: Index,
});
