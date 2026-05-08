import { createFileRoute, notFound } from "@tanstack/react-router";
import Equipment from "@/pages/Equipment";
import { equipmentCategories } from "@/data/equipment";

export const Route = createFileRoute("/equipment/$category/")({
  head: ({ params }) => {
    const cat = equipmentCategories.find((c) => c.slug === params.category);
    const label = cat?.label ?? "Equipment";
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
        { property: "og:image", content: cat?.image ?? "/assets/atdb-hero-monument-C3bd27q6.webp" },
        { name: "twitter:image", content: cat?.image ?? "/assets/atdb-hero-monument-C3bd27q6.webp" },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    if (!equipmentCategories.find((c) => c.slug === params.category)) throw notFound();
  },
  component: Equipment,
});
