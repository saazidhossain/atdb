import { createFileRoute, notFound } from "@tanstack/react-router";
import EquipmentDetail from "@/pages/EquipmentDetail";
import { equipmentData, equipmentCategories } from "@/data/equipment";

const SITE = "https://atdbtrade.com";

export const Route = createFileRoute("/equipment/$category/$id")({
  head: ({ params }) => {
    const eq = equipmentData.find((e) => e.id === params.id);
    if (!eq) return { meta: [{ title: "Equipment — ATDB" }] };
    const cat = equipmentCategories.find((c) => c.slug === eq.category);
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
        { property: "product:brand", content: eq.brand },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: eq.name,
            sku: eq.id,
            mpn: eq.model,
            brand: { "@type": "Brand", name: eq.brand },
            model: eq.model,
            image: img,
            description: desc,
            countryOfOrigin: eq.origin,
            category: cat?.label ?? "Heavy Equipment",
            additionalProperty: [
              { "@type": "PropertyValue", name: "Capacity", value: eq.capacity },
              { "@type": "PropertyValue", name: "Fuel", value: eq.fuel },
              ...(eq.year
                ? [{ "@type": "PropertyValue", name: "Year", value: String(eq.year) }]
                : []),
              { "@type": "PropertyValue", name: "Quantity Available", value: eq.quantity },
            ],
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "BDT",
              price: "0",
              priceValidUntil: "2026-12-31",
              url: `${SITE}/equipment/${eq.category}/${eq.id}`,
              seller: { "@type": "Organization", name: "M/S ATDB Trade International" },
            },
          }),
        },
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
                name: cat?.label ?? "Category",
                item: `${SITE}/equipment/${eq.category}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: eq.name,
                item: `${SITE}/equipment/${eq.category}/${eq.id}`,
              },
            ],
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
