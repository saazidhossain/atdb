import { createFileRoute } from "@tanstack/react-router";
import Equipment from "@/pages/Equipment";

export const Route = createFileRoute("/equipment/")({
  head: () => ({
    meta: [
      { title: "Equipment Catalog — ATDB Trade International" },
      { name: "description", content: "Browse ATDB's full fleet of cranes, excavators, rollers, and support equipment available for rental in Bangladesh." },
      { property: "og:title", content: "Equipment Catalog — ATDB" },
      { property: "og:description", content: "Cranes, excavators, rollers, and support equipment for rental." },
    ],
  }),
  component: Equipment,
});
