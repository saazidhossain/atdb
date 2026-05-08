import { Milestone } from "lucide-react";
import { useLang } from "@/hooks/useLang";

export default function JourneyTimeline() {
  const { t } = useLang();

  const milestones = [
    {
      year: "2000",
      title: t("Founded in Dhaka", "ঢাকায় প্রতিষ্ঠা"),
      desc: t(
        "ATDB Trade International begins heavy-equipment rental operations.",
        "ATDB Trade International হেভি ইকুইপমেন্ট রেন্টাল অপারেশন শুরু।",
      ),
    },
    {
      year: "2008",
      title: t("Tangail Branch Opens", "টাঙ্গাইল শাখা চালু"),
      desc: t(
        "Regional yard expands fleet reach to north-central infrastructure projects.",
        "আঞ্চলিক ইয়ার্ড — উত্তর-কেন্দ্রীয় ইনফ্রাস্ট্রাকচার প্রজেক্টে ফ্লিট সম্প্রসারণ।",
      ),
    },
    {
      year: "2014",
      title: t("Cranes & Rollers Modernised", "ক্রেন ও রোলার আধুনিকায়ন"),
      desc: t(
        "Sakai, Liebherr & Kato units added; fleet crosses 25 machines.",
        "সাকাই, লিবহার ও কাটো ইউনিট যুক্ত; ফ্লিট ২৫ মেশিন অতিক্রম।",
      ),
    },
    {
      year: "2018",
      title: t("CIS Certification", "CIS সার্টিফিকেশন"),
      desc: t(
        "All lifting equipment independently inspected — CIS/077/2018.",
        "সব লিফটিং ইকুইপমেন্ট স্বাধীনভাবে পরিদর্শিত — CIS/077/2018।",
      ),
    },
    {
      year: "2022",
      title: t("1st Class Contractor", "১ম শ্রেণির ঠিকাদার"),
      desc: t(
        "Government classification; eligible for top-tier tenders nationwide.",
        "সরকার-শ্রেণিভুক্ত; দেশজুড়ে শীর্ষ-স্তরের টেন্ডারের জন্য যোগ্য।",
      ),
    },
    {
      year: "2026",
      title: t("26 Years Strong", "২৬ বছর শক্তিশালী"),
      desc: t(
        "30+ certified machines, 25 staff, two offices, one trusted partner.",
        "৩০+ সার্টিফাইড মেশিন, ২৫ কর্মী, দুই অফিস — একটি বিশ্বস্ত পার্টনার।",
      ),
    },
  ];

  return (
    <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-3">
          <Milestone className="w-5 h-5 text-orange-400" />
          <p className="eyebrow">{t("Our Journey", "আমাদের যাত্রা")}</p>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-display max-w-3xl mb-10">
          {t("26 years, one trusted partner.", "২৬ বছর, একটি বিশ্বস্ত পার্টনার।")}
        </h2>

        <ol className="relative border-l border-orange-500/30 pl-6 sm:pl-8 space-y-6">
          {milestones.map((m) => (
            <li key={m.year} className="relative">
              <span
                aria-hidden
                className="absolute -left-[33px] sm:-left-[41px] top-1 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-orange-500/15"
              />
              <div className="glass-card rounded-2xl p-5 glass-hover card-tilt">
                <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                  <span className="font-display text-2xl font-bold text-orange-400">{m.year}</span>
                  <span className="text-base font-semibold text-white">{m.title}</span>
                </div>
                <p className="text-sm text-white/55 leading-relaxed">{m.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
