import { createFileRoute, notFound } from "@tanstack/react-router";
import EquipmentDetail from "@/pages/EquipmentDetail";
import { equipmentData } from "@/data/equipment";

export const Route = createFileRoute("/equipment/$category/$id")({
  head: ({ params }) => {
    const eq = equipmentData.find((e) => e.id === params.id);
    if (!eq) return { meta: [{ title: "Equipment — ATDB" }] };
    const img = eq.realPhotos?.[0] || eq.image;
    const title = `${eq.name} (${eq.id}) — Rent from ATDB`;
    const desc = `${eq.brand} ${eq.model} · ${eq.capacity} · ${eq.origin}${eq.year ? ` · ${eq.year}` : ""}. Available for rent across Bangladesh.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: img },
        { name: "twitter:image", content: img },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: eq.name,
            sku: eq.id,
            brand: { "@type": "Brand", name: eq.brand },
            model: eq.model,
            image: img,
            description: desc,
            countryOfOrigin: eq.origin,
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "BDT",
              price: "0",
              priceValidUntil: "2026-12-31",
              seller: { "@type": "Organization", name: "M/S ATDB Trade International" },
            },
          }),
        },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    if (!equipmentData.find((e) => e.id === params.id)) throw notFound();
  },
  component: EquipmentDetail,
});
