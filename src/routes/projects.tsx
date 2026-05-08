import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/pages/Projects";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — ATDB Trade International" },
      {
        name: "description",
        content:
          "National-scale infrastructure projects supported by ATDB Trade International across Bangladesh.",
      },
      { property: "og:title", content: "Projects — ATDB" },
      {
        property: "og:description",
        content: "Selected works on bridges, roads, airports and industrial sites.",
      },
    ],
  }),
  component: Projects,
});
