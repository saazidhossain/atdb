import { ArrowRight, Phone, Zap, Check } from "lucide-react";
import { getWhatsAppQuoteUrl } from "@/data/equipment";
import { useLang } from "@/hooks/useLang";

const PHONE_DISPLAY = "+880 17 1210 6242";
const PHONE_HREF = "tel:+8801712106242";

export default function CTASection() {
  const { t } = useLang();

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-orange-950/30 via-background to-background border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 lg:gap-12 items-start">
          {/* Left: copy */}
          <div className="max-w-2xl">
            <p className="eyebrow mb-4 flex items-center gap-2 text-orange-300/90">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400" />
              {t("GET STARTED", "শুরু করুন")}
            </p>

            <h2 className="font-display font-bold text-orange-400 text-[clamp(1.9rem,5.5vw,2.75rem)] leading-[1.1] tracking-tight text-balance">
              {t("Ready to mobilise?", "মোবিলাইজ করতে প্রস্তুত?")}
              <br className="hidden sm:block" />
              <span className="text-white/95">
                {" "}
                {t("Get a quote in minutes.", "মিনিটে কোটেশন নিন।")}
              </span>
            </h2>

            {/* Accent rule */}
            <div
              aria-hidden="true"
              className="mt-5 h-px w-32 bg-gradient-to-r from-orange-400 via-orange-400/60 to-transparent"
            />

            <p className="mt-5 text-white/60 leading-relaxed text-base sm:text-lg max-w-xl">
              {t(
                "Tell us your equipment, location and dates on WhatsApp — we'll respond with availability and pricing.",
                "হোয়াটসঅ্যাপে আমাদের ইকুইপমেন্ট, লোকেশন ও তারিখ জানান — আমরা অ্যাভেইলেবিলিটি ও প্রাইস জানিয়ে দেব।",
              )}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href={getWhatsAppQuoteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold tracking-wide transition-all shadow-2xl shadow-green-600/20 hover:shadow-green-500/30"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                </span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
                {t("START ON WHATSAPP", "হোয়াটসঅ্যাপে শুরু করুন")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 hover:ring-white/20 text-white/90 font-medium transition-all"
              >
                <Phone className="w-4 h-4 text-orange-300" />
                <span className="tracking-wide">{PHONE_DISPLAY}</span>
              </a>
            </div>

            {/* Trust ticks */}
            <ul className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-y-2 gap-x-6 text-sm text-white/55">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                {t("Replies in < 30 min", "৩০ মিনিটেরও কম সময়ে উত্তর")}
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                {t("Bengali & English support", "বাংলা ও ইংরেজি সাপোর্ট")}
              </li>
            </ul>
          </div>

          {/* Right: stat badge */}
          <aside className="lg:justify-self-end lg:self-start lg:mt-2">
            <div className="inline-flex lg:flex flex-row lg:flex-col items-center lg:items-start gap-3 lg:gap-2 rounded-2xl bg-white/[0.03] ring-1 ring-orange-400/20 px-5 py-4 lg:px-6 lg:py-5 backdrop-blur-sm shadow-[0_10px_40px_-20px_rgba(251,146,60,0.4)]">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/15 ring-1 ring-orange-400/30">
                <Zap className="w-5 h-5 text-orange-300" aria-hidden="true" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-2xl lg:text-3xl text-white">30+</span>
                <span className="text-[11px] tracking-[0.18em] uppercase text-white/55">
                  {t("Projects this yr", "এই বছরের প্রজেক্ট")}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
