import { Link, useParams } from "@/lib/router-compat";
import { useNavigate, useSearch, getRouteApi } from "@tanstack/react-router";
import { ArrowRight, Download, ShoppingCart, X, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { equipmentData, equipmentCategories, getWhatsAppRentUrl } from "@/data/equipment";
import { generateEquipmentPDF } from "@/lib/generatePDF";
import { useLang } from "@/hooks/useLang";
import { useCart } from "@/hooks/useCart";

const categoryRouteApi = getRouteApi("/equipment/$category/");

export default function EquipmentPage() {
  const { category } = useParams();
  const { t, lang } = useLang();
  const { add } = useCart();

  const currentCategory = category
    ? equipmentCategories.find((c) => c.slug === category)
    : undefined;

  if (!category) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <section className="pt-28 pb-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-mono tracking-[0.3em] text-orange-400 uppercase mb-3">
              {t("Equipment", "যন্ত্রপাতি")}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">
              {t(
                "A certified fleet of 28 machines, ready to mobilise.",
                "২৮টি সার্টিফাইড মেশিনের বহর, মোবিলাইজের জন্য প্রস্তুত।",
              )}
            </h1>
            <p className="text-white/50 mt-4 max-w-2xl">
              {t(
                "From 120-tonne mobile cranes to road rollers, excavators and on-site support equipment — every unit is inspection-certified and operator-supported.",
                "১২০ টন মোবাইল ক্রেন থেকে রোড রোলার, এক্সক্যাভেটর এবং সাপোর্ট ইকুইপমেন্ট — প্রতিটি ইউনিট পরিদর্শন-সার্টিফাইড।",
              )}
            </p>
          </div>
        </section>
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {equipmentCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/equipment/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl glass-card glass-hover aspect-[16/10]"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-6">
                  <p className="text-orange-300/80 text-xs mb-1">{cat.bangla}</p>
                  <h3 className="text-2xl font-bold">{cat.label}</h3>
                  <p className="text-white/50 text-sm mt-1">
                    {cat.units} · {cat.brands}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-orange-400 text-xs font-semibold tracking-wider group-hover:gap-3 transition-all">
                    {t("EXPLORE CATEGORY", "ক্যাটাগরি দেখুন")}{" "}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <Footer />
        <WhatsAppFAB />
      </div>
    );
  }

  return (
    <CategoryView
      categorySlug={category}
      currentCategory={currentCategory}
      t={t}
      lang={lang}
      add={add}
    />
  );
}

function CategoryView({
  categorySlug,
  currentCategory,
  t,
  lang,
  add,
}: {
  categorySlug: string;
  currentCategory: ReturnType<typeof equipmentCategories.find>;
  t: (en: string, bn: string) => string;
  lang: "en" | "bn";
  add: ReturnType<typeof useCart>["add"];
}) {
  const search = useSearch({ from: "/equipment/$category/" }) as {
    brand: string;
    origin: string;
    year: string;
    q: string;
  };
  const navigate = useNavigate({ from: categoryRouteApi.id });

  const allItems = useMemo(
    () => equipmentData.filter((e) => e.category === categorySlug),
    [categorySlug],
  );

  const brandOptions = useMemo(
    () => Array.from(new Set(allItems.map((e) => e.brand))).sort(),
    [allItems],
  );
  const originOptions = useMemo(
    () => Array.from(new Set(allItems.map((e) => e.origin))).sort(),
    [allItems],
  );
  const yearOptions = useMemo(
    () =>
      Array.from(new Set(allItems.map((e) => e.year).filter(Boolean) as number[]))
        .sort((a, b) => b - a)
        .map(String),
    [allItems],
  );

  const items = useMemo(() => {
    const q = search.q.trim().toLowerCase();
    return allItems.filter((e) => {
      if (search.brand && e.brand !== search.brand) return false;
      if (search.origin && e.origin !== search.origin) return false;
      if (search.year && String(e.year) !== search.year) return false;
      if (q) {
        const hay = `${e.name} ${e.id} ${e.model} ${e.capacity}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allItems, search]);

  const setFilter = (k: "brand" | "origin" | "year" | "q", v: string) => {
    navigate({ search: (prev: typeof search) => ({ ...prev, [k]: v }), replace: true });
  };
  const clearAll = () =>
    navigate({ search: { brand: "", origin: "", year: "", q: "" }, replace: true });

  const activeCount = (["brand", "origin", "year", "q"] as const).filter((k) => search[k]).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-10 relative overflow-hidden">
        {currentCategory && (
          <>
            <img
              src={currentCategory.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
          </>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-orange-300/80 text-xs mb-1">{currentCategory?.bangla}</p>
          <h1 className="text-4xl md:text-5xl font-bold">
            {currentCategory?.label || t("Equipment", "যন্ত্রপাতি")}
          </h1>
          <p className="text-white/50 mt-3">
            {items.length}
            {items.length !== allItems.length ? ` / ${allItems.length}` : ""}{" "}
            {t("units shown", "ইউনিট দেখানো হচ্ছে")} · {currentCategory?.brands}
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="w-4 h-4 text-orange-400" />
              <h2 className="text-xs font-semibold tracking-[0.22em] uppercase text-white/70">
                {t("Filters", "ফিল্টার")}
              </h2>
              {activeCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold">
                  {activeCount}
                </span>
              )}
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="ml-auto inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-orange-300"
                >
                  <X className="w-3 h-3" /> {t("Clear all", "সব মুছুন")}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <FilterInput
                label={t("Search", "খুঁজুন")}
                value={search.q}
                onChange={(v) => setFilter("q", v)}
                placeholder={t("Model, ID, capacity…", "মডেল, আইডি, ক্ষমতা…")}
              />
              <FilterSelect
                label={t("Brand", "ব্র্যান্ড")}
                value={search.brand}
                onChange={(v) => setFilter("brand", v)}
                options={brandOptions}
                allLabel={t("All brands", "সব ব্র্যান্ড")}
              />
              <FilterSelect
                label={t("Origin", "উৎপত্তি")}
                value={search.origin}
                onChange={(v) => setFilter("origin", v)}
                options={originOptions}
                allLabel={t("All origins", "সব উৎপত্তি")}
              />
              <FilterSelect
                label={t("Year", "সাল")}
                value={search.year}
                onChange={(v) => setFilter("year", v)}
                options={yearOptions}
                allLabel={t("All years", "সব সাল")}
              />
            </div>

            {activeCount > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(["brand", "origin", "year", "q"] as const).map((k) => {
                  const v = search[k];
                  if (!v) return null;
                  return (
                    <button
                      key={k}
                      onClick={() => setFilter(k, "")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-200 text-[11px] hover:bg-orange-500/25"
                    >
                      <span className="opacity-60">{k}:</span>{" "}
                      <span className="font-semibold">{v}</span>
                      <X className="w-3 h-3" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <p className="text-white/70">
                {t("No equipment matches your filters.", "আপনার ফিল্টারে কোনো ইকুইপমেন্ট মেলেনি।")}
              </p>
              <button onClick={clearAll} className="mt-3 text-orange-400 text-sm hover:underline">
                {t("Clear filters", "ফিল্টার মুছুন")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((eq) => (
                <div
                  key={eq.id}
                  className="group glass-card rounded-2xl overflow-hidden glass-hover flex flex-col"
                >
                  <Link
                    to={`/equipment/${eq.category}/${eq.id}`}
                    className="relative aspect-[4/3] overflow-hidden"
                  >
                    <img
                      src={eq.realPhotos?.[0] || eq.image}
                      alt={eq.name}
                      loading="lazy"
                      decoding="async"
                      className="image-polish w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs font-medium text-white/80">
                      {eq.brand}
                    </div>
                    {eq.realPhotos && eq.realPhotos.length > 0 && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-green-600/80 backdrop-blur text-[10px] font-semibold text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />{" "}
                        {t("REAL", "আসল")}
                      </div>
                    )}
                    {eq.videos && eq.videos.length > 0 && (
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-red-600/80 backdrop-blur text-[10px] font-semibold text-white flex items-center gap-1">
                        ▶ VIDEO
                      </div>
                    )}
                    {parseInt(eq.quantity, 10) > 1 && (
                      <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-orange-500/90 backdrop-blur text-[10px] font-semibold text-white">
                        ×{eq.quantity.replace(/^0/, "")} {t("units", "ইউনিট")}
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[10px] font-mono text-white/40 mb-1">{eq.id}</span>
                    <Link
                      to={`/equipment/${eq.category}/${eq.id}`}
                      className="text-lg font-semibold text-white hover:text-orange-400 transition-colors"
                    >
                      {eq.name}
                    </Link>
                    <p className="text-sm text-white/40 mt-1">
                      {eq.capacity} · {eq.origin} · {eq.year || "—"}
                    </p>
                    <div className="mt-auto pt-4 flex items-center gap-2">
                      <a
                        href={getWhatsAppRentUrl(eq.name, eq.id, eq.capacity)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-all shadow-lg shadow-green-900/30 hover:shadow-green-500/40 hover:-translate-y-0.5"
                        title={t("Quote on WhatsApp", "হোয়াটসঅ্যাপে কোটেশন")}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.522 5.273l.59.937-1.001 3.654 3.378-.563zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.711.307 1.265.491 1.697.629.713.227 1.362.195 1.875.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                        </svg>
                        {t("Quote on WhatsApp", "WhatsApp কোটেশন")}
                      </a>
                      <button
                        onClick={() => generateEquipmentPDF(eq, lang)}
                        className="w-10 h-10 rounded-xl glass hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-orange-400 transition-colors"
                        title={t("Download PDF", "PDF ডাউনলোড")}
                        aria-label={t("Download spec sheet", "স্পেক শিট ডাউনলোড")}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          add({
                            id: eq.id,
                            name: eq.name,
                            brand: eq.brand,
                            capacity: eq.capacity,
                            image: eq.realPhotos?.[0] || eq.image,
                          })
                        }
                        className="w-10 h-10 rounded-xl glass hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-orange-400 transition-colors"
                        title={t("Add to Cart", "কার্টে যোগ করুন")}
                        aria-label={t("Add to quotation cart", "কোটেশন কার্টে যোগ")}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/equipment/${eq.category}/${eq.id}`}
                        className="w-10 h-10 rounded-xl glass hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-orange-400 transition-colors"
                        title={t("View details", "বিস্তারিত দেখুন")}
                        aria-label={t("View details", "বিস্তারিত দেখুন")}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-white/50 mb-1.5">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/60"
      />
    </label>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-white/50 mb-1.5">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/60"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[hsl(220_20%_10%)]">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
