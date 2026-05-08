import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ATDB Trade International" },
      { name: "description", content: "Get in touch with ATDB Trade International. Offices in Dhaka and Tangail. WhatsApp, phone, and email." },
      { property: "og:title", content: "Contact ATDB" },
      { property: "og:description", content: "Reach our rental desk via WhatsApp, phone, or email." },
    ],
  }),
  component: Contact,
});
