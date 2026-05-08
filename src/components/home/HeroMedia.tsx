import { useEffect, useRef, useState, useCallback } from "react";

/**
 * HeroMedia — cinematic looping hero background with parallax.
 *
 * Loading strategy (anti-jank):
 * 1. LCP image renders immediately as a real <img fetchpriority="high">
 *    (CSS background-image is too low priority for LCP).
 * 2. Video is NOT mounted on first paint. After the page is idle
 *    (requestIdleCallback) AND the hero is in the viewport, we mount
 *    a `preload="auto"` <video> that fades in once it can play.
 * 3. Skipped entirely on mobile, reduced-motion, save-data, or 2g/3g.
 * 4. Pauses when the tab is hidden or the hero scrolls out of view.
 */

const VIDEO_SRC = "/videos/atdb-hero-animated.mp4";
const FALLBACK_IMG = "/assets/hero/atdb-hero-monument-C3bd27q6-1280.webp";
const FALLBACK_IMG_SM = "/assets/hero/atdb-hero-monument-C3bd27q6-768.webp";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

function shouldLoadVideo(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(max-width: 768px)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /(^|-)(2g|3g)$/.test(conn.effectiveType)) return false;
  return true;
}

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Defer mounting the <video> element until idle + visible
  const [mountVideo, setMountVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);

  // Track viewport size — controls fallback image variant + video gating
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Lazy-mount the video: wait for idle, gate on capability + visibility
  useEffect(() => {
    if (!shouldLoadVideo()) return;
    let cancelled = false;

    const ric =
      (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 800));

    const idleHandle = ric(() => {
      if (cancelled || !containerRef.current) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setMountVideo(true);
            io.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      io.observe(containerRef.current);
    }, { timeout: 1500 });

    return () => {
      cancelled = true;
      const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cic && typeof idleHandle === "number") cic(idleHandle);
    };
  }, []);

  // Pause video when tab hidden or scrolled far past hero
  useEffect(() => {
    if (!mountVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const onVisibility = () => {
      if (document.hidden) v.pause();
      else if (videoReady) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [mountVideo, videoReady]);

  // Mark video ready ONLY after first frame is actually painted AND
  // playback has begun. Prevents fading in a black/empty frame, and
  // prevents the opacity ramp from finishing before play() resolves
  // (which manifested as a snap-to-content mid-fade).
  useEffect(() => {
    if (!mountVideo) return;
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;

    const markReady = () => { if (!cancelled) setVideoReady(true); };

    const tryStart = async () => {
      try { await v.play(); } catch { /* user-gesture or autoplay block — image stays */ return; }
      const rvfc = (v as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => number;
      }).requestVideoFrameCallback;
      if (typeof rvfc === "function") {
        rvfc.call(v, markReady);
      } else {
        // Fallback: loadeddata + 1 rAF ≈ first paint
        if (v.readyState >= 2) requestAnimationFrame(markReady);
        else v.addEventListener("loadeddata", () => requestAnimationFrame(markReady), { once: true });
      }
    };

    if (v.readyState >= 3) tryStart();
    else v.addEventListener("canplay", tryStart, { once: true });

    return () => {
      cancelled = true;
      v.removeEventListener("canplay", tryStart);
    };
  }, [mountVideo]);

  // Parallax scroll effect — GPU-accelerated via translate3d
  const rafId = useRef(0);
  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      // Skip parallax once well past hero (saves layout work)
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      setParallaxY(y * 0.4);
    });
  }, []);

  useEffect(() => {
    // Skip parallax on touch devices entirely — saves a scroll listener + re-renders.
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [onScroll]);

  const fallbackSrc = isMobile ? FALLBACK_IMG_SM : FALLBACK_IMG;
  // Same transform on image + video → no drift between layers as the
  // video fades in over a scrolled hero.
  const parallaxStyle = {
    transform: `translate3d(0, ${parallaxY}px, 0)`,
    willChange: "transform" as const,
  };

  return (
    <div
      ref={containerRef}
      className="hero-bg absolute inset-0 overflow-hidden"
      style={{ zIndex: 0, backgroundColor: "#0b0f14" }}
    >
      {/* LCP image — preloaded, sync-decoded for instant first paint.
          Intrinsic 1376x768 matches the source so the browser reserves the
          correct aspect-ratio box (zero CLS) without forcing a reflow.
          srcSet/sizes lets the browser pick the cheapest variant to decode. */}
      <img
        src={FALLBACK_IMG}
        srcSet="/assets/hero/atdb-hero-monument-C3bd27q6-768.webp 768w, /assets/hero/atdb-hero-monument-C3bd27q6-1280.webp 1280w, /assets/hero/atdb-hero-monument-C3bd27q6-1920.webp 1920w"
        sizes="100vw"
        width={1920}
        height={1072}
        alt=""
        aria-hidden
        decoding="sync"
        fetchPriority="high"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ zIndex: 0, ...parallaxStyle }}
      />

      {mountVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={fallbackSrc}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "cover",
            objectPosition: "center center",
            zIndex: 1,
            ...parallaxStyle,
            opacity: videoReady ? 1 : 0,
            transition: "opacity 600ms ease-out",
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
          zIndex: 2,
          background: `linear-gradient(to right, rgba(7,11,15,0.92) 0%, rgba(7,11,15,0.70) 45%, rgba(7,11,15,0.30) 75%, rgba(7,11,15,0.10) 100%), linear-gradient(to top, rgba(7,11,15,1.00) 0%, rgba(7,11,15,0.50) 18%, transparent 40%)`,
        }}
      />
    </div>
  );
}
