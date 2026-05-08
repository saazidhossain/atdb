import { createFileRoute } from "@tanstack/react-router";
import Equipment from "@/pages/Equipment";
import { equipmentCategories } from "@/data/equipment";

const SITE = "https://atdbtrade.com";

export const Route = createFileRoute("/equipment/")({
  head: () => ({
    meta: [
      { title: "Equipment Catalog — ATDB Trade International" },
      { name: "description", content: "Browse ATDB's full fleet of cranes, excavators, rollers, loaders and support equipment available for rental in Bangladesh." },
      { property: "og:title", content: "Equipment Catalog — ATDB" },
      { property: "og:description", content: "Cranes, excavators, rollers, loaders and support equipment for rental." },
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
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "ATDB Equipment Categories",
          itemListElement: equipmentCategories.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            url: `${SITE}/equipment/${c.slug}`,
          })),
        }),
      },
    ],
  }),
  component: Equipment,
});
