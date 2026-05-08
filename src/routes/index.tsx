import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

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
      { property: "og:description", content: "Cranes, excavators, rollers and more — 26+ years serving Bangladesh's biggest projects." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});
