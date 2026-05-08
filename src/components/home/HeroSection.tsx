import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { getWhatsAppQuoteUrl } from "@/data/equipment";
import { useLang } from "@/hooks/useLang";
import HeroMedia from "./HeroMedia";
import HeroSkeleton from "./HeroSkeleton";
import CountUp from "@/components/CountUp";

export default function HeroSection() {
  const { t } = useLang();
  return (
    <section
      className="relative flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* Cinematic looping hero video background */}
      <HeroMedia />

      {/* Ambient glow + bottom vignette + fade into next section */}
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 w-[32rem] h-[32rem] rounded-full bg-orange-500/[0.07] blur-3xl" style={{ zIndex: 2 }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-vignette" style={{ zIndex: 2 }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 hero-fade-bottom" style={{ zIndex: 3 }} />

      {/* Skeleton placeholders — sit above the media but below the real
          text. Auto-fade once fonts + LCP image are ready, eliminating the
          jarring "blank → pop" sequence on slow mobile networks. */}
      <HeroSkeleton />

      <div
        className="relative z-10 max-w-7xl mx-auto w-full"
        style={{
          paddingTop: "clamp(7rem, 14vh, 10rem)",
          paddingBottom: "clamp(4rem, 10vh, 8rem)",
          paddingLeft: "clamp(1.25rem, 6vw, 5.5rem)",
          paddingRight: "clamp(1.25rem, 6vw, 5.5rem)",
        }}
      >
        <p className="text-[10px] sm:text-xs font-mono tracking-[0.25em] sm:tracking-[0.3em] text-white/55 uppercase mb-4 sm:mb-6 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          {t("Since 2000 · Dhaka & Tangail, Bangladesh", "২০০০ সাল থেকে · ঢাকা ও টাঙ্গাইল, বাংলাদেশ")}
        </p>

        <h1 className="display-hero max-w-[18ch] sm:max-w-3xl lg:max-w-4xl font-display animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
          {t("Bangladesh's premier ", "বাংলাদেশের সেরা ")}
          <span className="text-shimmer">{t("heavy equipment", "হেভি ইকুইপমেন্ট")}</span>
          {t(" rental partner.", " রেন্টাল পার্টনার।")}
        </h1>

        <p className="mt-5 sm:mt-6 md:mt-7 text-white/65 text-[15px] sm:text-base md:text-lg max-w-xl md:max-w-2xl leading-relaxed text-pretty animate-fade-in" style={{ animationDelay: "600ms", animationFillMode: "both" }}>
          {t(
            "Professional heavy equipment rental and infrastructure support services for national-scale projects.",
            "জাতীয় পর্যায়ের প্রকল্পের জন্য পেশাদার হেভি ইকুইপমেন্ট রেন্টাল ও অবকাঠামো সাপোর্ট সার্ভিস।"
          )}
        </p>

        {/*
          CTA cluster — alignment rules:
          • <480px : single column, both buttons full-width, equal min-height.
          • ≥480px : two columns side-by-side, equal width via 1fr 1fr,
                    wrap to stack only if labels truly overflow.
          • ≥640px : auto-width pills, left-aligned, baseline shared.
          Buttons share min-height + base classes so they align pixel-perfect.
        */}
        <div
          className="mt-8 sm:mt-10 md:mt-12 grid w-full max-w-md grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:flex sm:max-w-none sm:flex-wrap sm:items-stretch sm:gap-4 animate-fade-in"
          style={{ animationDelay: "800ms", animationFillMode: "both" }}
        >
          <Link
            to="/equipment"
            className="group inline-flex min-h-[3rem] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-orange-500 px-6 py-3.5 text-[13px] font-semibold tracking-wide text-white shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-orange-400/40 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto sm:px-7 sm:text-sm"
          >
            {t("BROWSE EQUIPMENT", "ইকুইপমেন্ট দেখুন")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={getWhatsAppQuoteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-strong inline-flex min-h-[3rem] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-all hover:-translate-y-0.5 hover:border-white/25 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:w-auto sm:px-7 sm:text-sm"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {t("WHATSAPP A QUOTE", "হোয়াটসঅ্যাপে কোটেশন")}
          </a>
        </div>

        {/* Stats with animated counters */}
        <div className="mt-12 sm:mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-w-md sm:max-w-xl md:max-w-2xl">
          {[
            { value: 26, suffix: "+", label: t("Years Experience", "বছরের অভিজ্ঞতা") },
            { value: 30, suffix: "+", label: t("Equipment Units", "ইকুইপমেন্ট ইউনিট") },
            { value: 25, suffix: "", label: t("Skilled Staff", "দক্ষ কর্মী") },
            { value: 2, suffix: "", label: t("Office Locations", "অফিস") },
          ].map((stat, i) => (
            <div key={stat.label} className="glass-card stat-accent rounded-2xl px-3 py-4 sm:p-4 text-center transition-all duration-300 hover:-translate-y-0.5" style={{ animationDelay: `${1000 + i * 100}ms` }}>
              <div className="font-display text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-orange-300 to-orange-500 leading-none">
                <CountUp end={stat.value} suffix={stat.suffix} duration={1600 + i * 200} />
              </div>
              <div className="text-[11px] sm:text-xs text-white/55 mt-2 tracking-wide leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
