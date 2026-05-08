import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { CheckCircle2, Circle, ExternalLink, Download, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/hooks/useLang";
import { equipmentData, equipmentCategories, WHATSAPP_NUMBER } from "@/data/equipment";

interface Check {
  id: string;
  group: string;
  title: string;
  detail?: string;
  href?: string; // internal route to deep-link
  external?: string; // external URL (e.g. wa.me)
}

const STORAGE_KEY = "atdb_qa_checks_v1";

export default function QA() {
  const { t, lang, setLang } = useLang();
  const sampleReal =
    equipmentData.find((e) => e.realPhotos && e.videos) || equipmentData.find((e) => e.realPhotos);
  const sampleMock = equipmentData.find((e) => !e.realPhotos);

  const checks: Check[] = useMemo(
    () =>
      [
        // Pages
        {
          id: "home",
          group: "Pages",
          title: "Home page renders (hero, marquee, categories, featured, projects, why, CTA)",
          href: "/",
        },
        {
          id: "eq",
          group: "Pages",
          title: "Equipment landing shows all 5 categories with correct unit counts",
          href: "/equipment",
        },
        ...equipmentCategories.map((c) => ({
          id: `cat-${c.slug}`,
          group: "Pages",
          title: `Category “${c.label}” lists ${c.units}`,
          href: `/equipment/${c.slug}`,
        })),
        sampleReal && {
          id: "detail-real",
          group: "Pages",
          title: `Detail page (real photos + video): ${sampleReal.id} ${sampleReal.name}`,
          href: `/equipment/${sampleReal.category}/${sampleReal.id}`,
        },
        sampleMock && {
          id: "detail-mock",
          group: "Pages",
          title: `Detail page (mockup only): ${sampleMock.id} ${sampleMock.name}`,
          href: `/equipment/${sampleMock.category}/${sampleMock.id}`,
        },
        {
          id: "projects",
          group: "Pages",
          title: "Projects page renders all 13 entries with correct images",
          href: "/projects",
        },
        {
          id: "about",
          group: "Pages",
          title: "About page renders (story, certifications, team)",
          href: "/about",
        },
        {
          id: "contact",
          group: "Pages",
          title: "Contact page shows phone, email, address, WhatsApp",
          href: "/contact",
        },

        // Language toggle
        {
          id: "lang-en",
          group: "Language",
          title: "Switch to EN — all UI strings show English",
          detail: "Use the EN/বাংলা toggle in the navbar.",
        },
        {
          id: "lang-bn",
          group: "Language",
          title: "Switch to বাংলা — all UI strings show Bengali, font reads cleanly",
        },
        {
          id: "lang-persist",
          group: "Language",
          title: "Reload the page — selected language persists",
        },

        // WhatsApp
        {
          id: "wa-fab",
          group: "WhatsApp",
          title: "Floating WhatsApp button opens wa.me with prefilled message",
          external: `https://wa.me/${WHATSAPP_NUMBER}`,
        },
        {
          id: "wa-card",
          group: "WhatsApp",
          title: "“Quote on WhatsApp” on an equipment card prefills the unit name + ID",
        },
        {
          id: "wa-detail",
          group: "WhatsApp",
          title: "Equipment detail “Quick WhatsApp quote” works",
        },

        // Spec sheet PDF
        {
          id: "pdf-card",
          group: "PDF",
          title: "Click PDF icon on a card → downloads ATDB-<ID>-Spec-Sheet.pdf",
        },
        {
          id: "pdf-detail",
          group: "PDF",
          title: "Detail page “Download Spec Sheet (PDF)” downloads correctly",
        },
        {
          id: "pdf-content",
          group: "PDF",
          title: "PDF shows ATDB header, hero image, specs, gallery (where available), CTA",
        },

        // Quote cart
        {
          id: "cart-add",
          group: "Cart",
          title: "Add an item to cart — drawer opens, count increments",
        },
        { id: "cart-multi", group: "Cart", title: "Add multiple items, change qty, remove one" },
        {
          id: "cart-wa",
          group: "Cart",
          title: "“Send to WhatsApp” opens wa.me with all items listed",
        },
        { id: "cart-persist", group: "Cart", title: "Reload — cart contents persist" },

        // Responsive
        {
          id: "resp-mobile",
          group: "Responsive",
          title: "Mobile (375px): no horizontal scroll, navbar collapses, no overflow",
        },
        {
          id: "resp-tablet",
          group: "Responsive",
          title: "Tablet (768px): grids align, no orphan cards",
        },
        {
          id: "resp-desktop",
          group: "Responsive",
          title: "Desktop (1440px): hero crisp, footer columns aligned",
        },

        // Polish
        {
          id: "404",
          group: "Polish",
          title: "Visit /not-a-real-page — friendly 404 with link home",
          href: "/__not_real",
        },
        {
          id: "imgs",
          group: "Polish",
          title: "All product images are correct (no wrong photo on wrong product)",
        },
        {
          id: "no-dupes",
          group: "Polish",
          title: "No duplicate equipment entries; IDs match the master list",
        },
      ].filter(Boolean) as Check[],
    [sampleReal, sampleMock],
  );

  const [state, setState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch {
      /* */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* */
    }
  }, [state]);

  const total = checks.length;
  const done = checks.filter((c) => state[c.id]).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const groups = useMemo(() => {
    const m = new Map<string, Check[]>();
    checks.forEach((c) => {
      if (!m.has(c.group)) m.set(c.group, []);
      m.get(c.group)!.push(c);
    });
    return [...m.entries()];
  }, [checks]);

  const toggle = (id: string) => setState((s) => ({ ...s, [id]: !s[id] }));
  const reset = () => {
    if (confirm("Reset all QA checks?")) setState({});
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      total,
      done,
      percent: pct,
      lang,
      results: checks.map((c) => ({
        id: c.id,
        group: c.group,
        title: c.title,
        passed: !!state[c.id],
      })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ATDB-QA-Report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono tracking-[0.3em] text-orange-400 uppercase mb-3">
            Pre-Handover QA
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Smoke-Test Checklist</h1>
          <p className="text-white/50 mb-6 max-w-2xl">
            Walk through every check before handover. Progress is saved in your browser. Hidden from
            search engines.
          </p>

          {/* Progress bar */}
          <div className="glass-card rounded-2xl p-5 mb-8 sticky top-20 z-30 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <div>
                <p className="text-2xl font-bold">
                  {done} <span className="text-white/40 text-base font-normal">/ {total}</span>
                </p>
                <p className="text-xs text-white/50">{pct}% complete</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setLang(lang === "en" ? "bn" : "en")}
                  className="px-3 py-2 rounded-lg glass hover:bg-white/10 text-xs font-semibold"
                >
                  Quick toggle: {lang === "en" ? "EN → বাংলা" : "বাংলা → EN"}
                </button>
                <button
                  onClick={exportReport}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Export report
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass hover:bg-white/10 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Groups */}
          <div className="space-y-8">
            {groups.map(([group, items]) => (
              <div key={group}>
                <h2 className="text-sm font-mono tracking-wider uppercase text-orange-400 mb-3">
                  {group}
                </h2>
                <ul className="space-y-2">
                  {items.map((c) => {
                    const checked = !!state[c.id];
                    return (
                      <li
                        key={c.id}
                        className={`glass-card rounded-xl p-4 flex items-start gap-3 transition-all ${checked ? "opacity-60" : ""}`}
                      >
                        <button
                          onClick={() => toggle(c.id)}
                          aria-label={checked ? "Mark incomplete" : "Mark complete"}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {checked ? (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-white/30 hover:text-white/60 transition-colors" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm sm:text-base ${checked ? "line-through text-white/50" : "text-white"}`}
                          >
                            {c.title}
                          </p>
                          {c.detail && <p className="text-xs text-white/40 mt-1">{c.detail}</p>}
                        </div>
                        {(c.href || c.external) &&
                          (c.external ? (
                            <a
                              href={c.external}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs font-semibold text-orange-300"
                            >
                              Test <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <Link
                              to={c.href!}
                              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs font-semibold text-orange-300"
                              {...({ target: "_blank", rel: "noopener noreferrer" } as Record<
                                string,
                                string
                              >)}
                            >
                              Test <ExternalLink className="w-3 h-3" />
                            </Link>
                          ))}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/40 text-center mt-12">
            Internal QA tool · Not linked from public navigation · noindex
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
