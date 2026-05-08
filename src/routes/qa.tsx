import { createFileRoute } from "@tanstack/react-router";
import QA from "@/pages/QA";

export const Route = createFileRoute("/qa")({
  head: () => ({
    meta: [
      { title: "QA Smoke Test — ATDB (internal)" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: QA,
});
