import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { getWhatsAppQuoteUrl } from "@/data/equipment";
import { useLang } from "@/hooks/useLang";
import HeroMedia from "./HeroMedia";
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

      {/* Single subtle ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 w-[32rem] h-[32rem] rounded-full bg-orange-500/[0.07] blur-3xl" style={{ zIndex: 2 }} />

      <div
        className="relative z-10 max-w-7xl mx-auto w-full"
        style={{
          paddingBottom: "clamp(5rem, 12vh, 9rem)",
          paddingLeft: "clamp(1.5rem, 7vw, 6rem)",
          paddingRight: "clamp(1.5rem, 7vw, 6rem)",
        }}
      >
        <p className="text-xs font-mono tracking-[0.3em] text-white/50 uppercase mb-6 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          {t("Since 2000 · Dhaka & Tangail, Bangladesh", "২০০০ সাল থেকে · ঢাকা ও টাঙ্গাইল, বাংলাদেশ")}
        </p>

        <h1 className="display-hero max-w-4xl font-display animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
          {t("Bangladesh's premier ", "বাংলাদেশের সেরা ")}
          <span className="text-shimmer">{t("heavy equipment", "হেভি ইকুইপমেন্ট")}</span>
          {t(" rental partner.", " রেন্টাল পার্টনার।")}
        </h1>

        <p className="mt-6 text-white/60 text-lg max-w-2xl leading-relaxed animate-fade-in" style={{ animationDelay: "600ms", animationFillMode: "both" }}>
          {t(
            "Professional heavy equipment rental and infrastructure support services for national-scale projects.",
            "জাতীয় পর্যায়ের প্রকল্পের জন্য পেশাদার হেভি ইকুইপমেন্ট রেন্টাল ও অবকাঠামো সাপোর্ট সার্ভিস।"
          )}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-in" style={{ animationDelay: "800ms", animationFillMode: "both" }}>
          <Link to="/equipment" className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm tracking-wide transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-400/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
            {t("BROWSE EQUIPMENT", "ইকুইপমেন্ট দেখুন")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href={getWhatsAppQuoteUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-7 py-3.5 rounded-full glass hover:bg-white/10 text-white font-semibold text-sm tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t("WHATSAPP A QUOTE", "হোয়াটসঅ্যাপে কোটেশন")}
          </a>
        </div>

        {/* Stats with animated counters */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-2xl">
          {[
            { value: 26, suffix: "+", label: t("Years Experience", "বছরের অভিজ্ঞতা") },
            { value: 30, suffix: "+", label: t("Equipment Units", "ইকুইপমেন্ট ইউনিট") },
            { value: 25, suffix: "", label: t("Skilled Staff", "দক্ষ কর্মী") },
            { value: 2, suffix: "", label: t("Office Locations", "অফিস") },
          ].map((stat, i) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 text-center hover:bg-white/10 transition-all group" style={{ animationDelay: `${1000 + i * 100}ms` }}>
              <div className="text-2xl md:text-3xl font-bold text-orange-400">
                <CountUp end={stat.value} suffix={stat.suffix} duration={1600 + i * 200} />
              </div>
              <div className="text-xs text-white/50 mt-1 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
