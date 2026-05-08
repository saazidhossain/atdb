import { useEffect, useState } from "react";

/**
 * In-place skeleton overlay for the hero section.
 *
 * Shown ONLY until BOTH:
 *   • `document.fonts.ready` resolves (so headings don't visibly re-flow
 *     when the display font swaps in)
 *   • the eager LCP hero image has decoded (so stat cards don't pop in
 *     against a still-blank background)
 *
 * After that it fades out in 220 ms. Hard-cap at 1.8 s so a flaky network
 * never leaves placeholders on screen.
 *
 * Layout exactly mirrors HeroSection (eyebrow, 2-line H1, 2-line paragraph,
 * 2 CTA pills, 4 stat cards) so the skeleton can sit absolutely on top
 * with `inset-0` and produce zero CLS when it disappears.
 */
export default function HeroSkeleton() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setHidden(true);
      window.setTimeout(() => setRemoved(true), 240);
    };

    const fonts =
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts
        ?.ready?.then(() => undefined)
        .catch(() => undefined) ?? Promise.resolve();

    const lcp = new Promise<void>((resolve) => {
      const img = document.querySelector<HTMLImageElement>(
        'img[fetchpriority="high"]'
      );
      if (!img) return resolve();
      if (img.complete && img.naturalWidth > 0) return resolve();
      img.decode?.().then(() => resolve()).catch(() => resolve());
      img.addEventListener("load", () => resolve(), { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
    });

    Promise.all([fonts, lcp]).then(() => {
      // Wait one paint so the real text is laid out before we fade.
      requestAnimationFrame(() => requestAnimationFrame(finish));
    });

    const safety = window.setTimeout(finish, 1800);
    return () => window.clearTimeout(safety);
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5]"
      style={{
        opacity: hidden ? 0 : 1,
        transition: "opacity 220ms ease-out",
      }}
    >
      <style>{`
        @keyframes atdb-hero-skel { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        .hskel {
          position: relative; overflow: hidden; border-radius: 10px;
          background: hsl(0 0% 100% / 0.05);
        }
        .hskel::after {
          content:""; position:absolute; inset:0;
          background: linear-gradient(90deg,
            transparent 0%,
            hsl(0 0% 100% / 0.06) 40%,
            hsl(25 95% 55% / 0.10) 50%,
            hsl(0 0% 100% / 0.06) 60%,
            transparent 100%);
          animation: atdb-hero-skel 1.4s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) { .hskel::after { animation:none; } }
      `}</style>

      {/* Mirrors HeroSection padding so placeholders sit exactly over the real content */}
      <div
        className="relative z-10 max-w-7xl mx-auto w-full"
        style={{
          paddingTop: "clamp(7rem, 14vh, 10rem)",
          paddingBottom: "clamp(4rem, 10vh, 8rem)",
          paddingLeft: "clamp(1.25rem, 6vw, 5.5rem)",
          paddingRight: "clamp(1.25rem, 6vw, 5.5rem)",
        }}
      >
        {/* eyebrow */}
        <div className="hskel h-3 w-44 mb-5 sm:mb-7" />
        {/* H1 — two stacked rows */}
        <div className="hskel h-10 sm:h-14 md:h-20 w-[90%] max-w-3xl mb-3" />
        <div className="hskel h-10 sm:h-14 md:h-20 w-[60%] max-w-xl mb-6" />
        {/* paragraph */}
        <div className="hskel h-4 w-[82%] max-w-xl mb-2" />
        <div className="hskel h-4 w-[55%] max-w-md" />
        {/* CTAs */}
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap gap-3">
          <div className="hskel h-12 w-full max-w-[14rem] sm:w-44" />
          <div className="hskel h-12 w-full max-w-[14rem] sm:w-48" />
        </div>
        {/* stats */}
        <div className="mt-12 sm:mt-14 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 max-w-md sm:max-w-xl md:max-w-2xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="hskel h-[5.5rem] sm:h-[6rem] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
