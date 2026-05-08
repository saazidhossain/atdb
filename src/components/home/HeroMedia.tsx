import { useEffect, useRef, useState, useCallback } from "react";

/**
 * HeroMedia — cinematic looping hero background with parallax.
 *
 * - Desktop: autoplay muted looping video (z-0).
 * - Mobile (≤768px): video paused, static WebP fallback as background.
 * - Parallax: background scrolls at 40% of content speed for depth.
 * - SSR-safe: always renders the desktop path on server; client
 *   corrects in useEffect (no hydration mismatch).
 */

const VIDEO_SRC = "/videos/atdb-hero-animated.mp4";
const FALLBACK_IMG = "/assets/hero/atdb-hero-monument-C3bd27q6-1280.webp";
const FALLBACK_IMG_SM = "/assets/hero/atdb-hero-monument-C3bd27q6-768.webp";

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Always start false for SSR consistency — correct in useEffect
  const [isMobile, setIsMobile] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);

  // Mobile detection — runs only on client
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => {
      setIsMobile(mq.matches);
      const v = videoRef.current;
      if (v) {
        if (mq.matches) v.pause();
        else v.play().catch(() => {});
      }
    };
    // Set initial value on client
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Parallax scroll effect — GPU-accelerated via translate3d
  const rafId = useRef(0);
  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setParallaxY(window.scrollY * 0.4);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [onScroll]);

  return (
    <div
      ref={containerRef}
      className="hero-bg absolute inset-0 overflow-hidden"
      style={{
        zIndex: 0,
        backgroundImage: `url(${isMobile ? FALLBACK_IMG_SM : FALLBACK_IMG})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      {!isMobile && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "cover",
            objectPosition: "center center",
            zIndex: 0,
            transform: `translate3d(0, ${parallaxY}px, 0)`,
            willChange: "transform",
          }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* Dark gradient overlay — above video, below UI */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `linear-gradient(to right, rgba(7,11,15,0.92) 0%, rgba(7,11,15,0.70) 45%, rgba(7,11,15,0.30) 75%, rgba(7,11,15,0.10) 100%), linear-gradient(to top, rgba(7,11,15,1.00) 0%, rgba(7,11,15,0.50) 18%, transparent 40%)`,
        }}
      />
    </div>
  );
}
