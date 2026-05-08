import { createFileRoute } from "@tanstack/react-router";
import { equipmentData, equipmentCategories } from "@/data/equipment";

const SITE = "https://atdbtrade.com";

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const staticUrls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/equipment", priority: "0.9", changefreq: "weekly" },
    { loc: "/projects", priority: "0.7", changefreq: "monthly" },
    { loc: "/about", priority: "0.6", changefreq: "monthly" },
    { loc: "/contact", priority: "0.6", changefreq: "monthly" },
  ];
  const categoryUrls = equipmentCategories.map((c) => ({
    loc: `/equipment/${c.slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));
  const itemUrls = equipmentData.map((e) => ({
    loc: `/equipment/${e.category}/${e.id}`,
    priority: "0.7",
    changefreq: "monthly",
  }));
  const all = [...staticUrls, ...categoryUrls, ...itemUrls];
  const body = all
    .map(
      (u) =>
        `  <url><loc>${SITE}${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
