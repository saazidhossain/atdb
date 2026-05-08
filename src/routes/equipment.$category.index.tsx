import { createFileRoute, notFound } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import Equipment from "@/pages/Equipment";
import { equipmentCategories, equipmentData } from "@/data/equipment";

const SITE = "https://atdbtrade.com";

const equipmentSearchSchema = z.object({
  brand: fallback(z.string(), "").default(""),
  origin: fallback(z.string(), "").default(""),
  year: fallback(z.string(), "").default(""),
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/equipment/$category/")({
  validateSearch: zodValidator(equipmentSearchSchema),
  head: ({ params }) => {
    const cat = equipmentCategories.find((c) => c.slug === params.category);
    const label = cat?.label ?? "Equipment";
    const img = cat?.image ?? "/assets/atdb-hero-monument-C3bd27q6.webp";
    const items = equipmentData.filter((e) => e.category === params.category);
    return {
      meta: [
        { title: `${label} for Rent — ATDB Trade International` },
        {
          name: "description",
          content: cat
            ? `Rent ${label.toLowerCase()} in Bangladesh. ${cat.units} · ${cat.brands}. CIS-certified fleet, operator-supported.`
            : "Heavy equipment rental in Bangladesh.",
        },
        { property: "og:title", content: `${label} — ATDB` },
        { property: "og:image", content: img },
        { name: "twitter:image", content: img },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Equipment", item: `${SITE}/equipment` },
              {
                "@type": "ListItem",
                position: 3,
                name: label,
                item: `${SITE}/equipment/${params.category}`,
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${label} — ATDB Fleet`,
            numberOfItems: items.length,
            itemListElement: items.map((e, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE}/equipment/${e.category}/${e.id}`,
              name: e.name,
            })),
          }),
        },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    if (!equipmentCategories.find((c) => c.slug === params.category)) throw notFound();
  },
  component: Equipment,
});
