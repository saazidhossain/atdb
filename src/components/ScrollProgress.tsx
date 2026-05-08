import { useEffect, useRef, useState } from "react";

/**
 * Thin amber scroll progress bar fixed to the top of the viewport.
 * Uses requestAnimationFrame for smooth 60fps updates without jank.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none"
      style={{ opacity: progress > 0.5 ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 12px hsl(25 95% 55% / 0.6)",
          transition: "width 60ms linear",
        }}
      />
    </div>
  );
}
