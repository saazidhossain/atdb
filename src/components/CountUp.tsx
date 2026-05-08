import { useEffect, useRef, useState } from "react";

interface Props {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * Animated counter that counts up from 0 when scrolled into view.
 * Uses easeOutExpo for a satisfying deceleration curve.
 */
export default function CountUp({ end, suffix = "", duration = 1800, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Start immediately if any pixel is already in the viewport on mount
    // (mobile hero counters often sit at the very bottom of 100dvh and
    //  never reach a 0.3 intersection ratio without a scroll).
    const inViewportNow = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    };
    if (inViewportNow()) {
      setStarted(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      // threshold 0 + small bottom inset → fires the moment ANY pixel
      // enters, with a 64px lead-in so the count begins just before the
      // card is fully on-screen. Works for short mobile viewports where
      // the stat row never reaches a 30% visibility ratio without scroll.
      { threshold: 0, rootMargin: "0px 0px -64px 0px" }
    );
    io.observe(el);

    // Hard safety: if nothing fires in 2.5s (orientation change, hidden
    // tab, exotic browser), still animate so users never see a static "0".
    const safety = window.setTimeout(() => setStarted(true), 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);


  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, end, duration]);

  return (
    <span ref={ref} className={className}>
      {value}{suffix}
    </span>
  );
}
