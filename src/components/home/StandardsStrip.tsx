import { Link } from "@/lib/router-compat";
import { ShieldCheck, BadgeCheck, Award } from "lucide-react";
import { useLang } from "@/hooks/useLang";

export default function StandardsStrip() {
  const { t } = useLang();
  const items = [
    {
      icon: ShieldCheck,
      code: "ISO 9001",
      label: t("Quality Management", "কোয়ালিটি ম্যানেজমেন্ট"),
      tone: "text-blue-300",
      ring: "ring-blue-400/30",
      glow: "from-blue-500/20 to-blue-500/0",
    },
    {
      icon: BadgeCheck,
      code: "CIS",
      label: t("City Inspection Services · Bangladesh", "সিটি ইন্সপেকশন সার্ভিসেস · বাংলাদেশ"),
      tone: "text-emerald-300",
      ring: "ring-emerald-400/30",
      glow: "from-emerald-500/20 to-emerald-500/0",
    },
    {
      icon: Award,
      code: t("1st Class Contractor", "১ম শ্রেণির ঠিকাদার"),
      label: t("Govt. of Bangladesh classification", "বাংলাদেশ সরকার শ্রেণিভুক্ত"),
      tone: "text-orange-300",
      ring: "ring-orange-400/30",
      glow: "from-orange-500/25 to-orange-500/0",
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-24 border-t border-white/5 overflow-hidden [contain:layout_paint]">
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="eyebrow mb-3">
            {t("International Standards & Compliance", "আন্তর্জাতিক মান ও কমপ্লায়েন্স")}
          </p>
          <h2 className="text-[clamp(1.6rem,5.5vw,2.25rem)] font-bold font-display leading-tight text-balance">
            {t(
              "Audited, classed and tender-ready credentials.",
              "অডিটেড, শ্রেণিভুক্ত ও টেন্ডার-প্রস্তুত ক্রেডেনশিয়াল।",
            )}
          </h2>
          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        </div>

        {/* Cards */}
        <ul className="list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-0 m-0 [&>li]:list-none [&>li]:!ml-0 [&>li]:!pl-0 [&>li]:before:content-none [&>li]:marker:content-['']">
          {items.map((it, i) => (
            <li
              key={it.code as string}
              className={`list-none ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <Link
                to="/about"
                aria-label={`${it.code} — ${it.label}`}
                className={`group relative block h-full overflow-hidden glass-card glass-hover rounded-2xl p-5 sm:p-6 ring-1 ${it.ring} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-transform hover:-translate-y-0.5`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${it.glow} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="relative flex items-center gap-4">
                  <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/[0.04] ring-1 ring-white/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                    <it.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${it.tone}`} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/50 mb-1 leading-snug break-words">
                      {it.code}
                    </p>
                    <p className="text-sm sm:text-[15px] font-semibold text-white/90 leading-snug break-words">
                      {it.label}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
