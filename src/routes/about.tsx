import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ATDB Trade International" },
      { name: "description", content: "ATDB Trade International — 26+ years of heavy equipment rental and infrastructure support in Bangladesh." },
      { property: "og:title", content: "About ATDB Trade International" },
      { property: "og:description", content: "Our story, certifications, and team behind Bangladesh's premier equipment rental partner." },
    ],
  }),
  component: About,
});
