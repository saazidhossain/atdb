import { useEffect, useState } from "react";

/**
 * Lightweight page preloader + deterministic page-ready flag.
 *
 * Two independent timelines:
 *   • UX overlay  — fades on window 'load' (or 1.2s safety) so users
 *                   never stare at a spinner.
 *   • __APP_READY__ — waits for EVERY signal that affects pixels, then
 *                   flips. E2E snapshots gate on this so there is no
 *                   chance of capturing mid-render frames.
 *
 * Ready signals (all must resolve, with a 6s hard cap):
 *   1. window 'load'                     — subresources downloaded
 *   2. document.fonts.ready              — text widths stable
 *   3. eager <img>.decode() resolves     — LCP image painted
 *   4. CountUp animations elapsed (~2.6s after load)
 *   5. 2× rAF                            — layout + paint flushed
 */
export default function PagePreloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // ── UX overlay timing (independent of __APP_READY__) ──────────────
    let uxDone = false;
    const fadeOverlay = () => {
      if (uxDone) return;
      uxDone = true;
      setHidden(true);
      window.dispatchEvent(new CustomEvent("atdb:preloader-exit"));
      window.setTimeout(() => setRemoved(true), 320);
    };
    const uxSafety = window.setTimeout(fadeOverlay, 1200);
    if (document.readyState === "complete") window.setTimeout(fadeOverlay, 200);
    else window.addEventListener("load", fadeOverlay, { once: true });

    // ── __APP_READY__ timing (snapshot-grade) ─────────────────────────
    let readyDone = false;
    const win = window as Window & { __APP_READY__?: boolean };
    win.__APP_READY__ = false;

    const markReady = () => {
      if (readyDone) return;
      readyDone = true;
      win.__APP_READY__ = true;
      window.dispatchEvent(new Event("atdb:app-ready"));
    };

    const waitForLoad = () =>
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      });

    const waitForFonts = () =>
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready
        ?.then(() => undefined)
        .catch(() => undefined) ?? Promise.resolve();

    const waitForEagerImages = async () => {
      const imgs = Array.from(
        document.querySelectorAll<HTMLImageElement>(
          'img[loading="eager"], img[fetchpriority="high"]'
        )
      );
      await Promise.all(
        imgs.map((img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : (img.decode?.().catch(() => undefined) ??
               new Promise<void>((r) => {
                 img.addEventListener("load", () => r(), { once: true });
                 img.addEventListener("error", () => r(), { once: true });
               }))
        )
      );
    };

    const doubleRaf = () =>
      new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r()))
      );

    // CountUp eases for ~1.6–2.2s; give 2.6s after load to settle.
    const waitForCountUp = () => new Promise<void>((r) => window.setTimeout(r, 2600));

    const hardCap = window.setTimeout(markReady, 6000);

    (async () => {
      await waitForLoad();
      await Promise.all([waitForFonts(), waitForEagerImages(), waitForCountUp()]);
      await doubleRaf();
      window.clearTimeout(hardCap);
      markReady();
    })();

    return () => {
      window.clearTimeout(uxSafety);
      window.clearTimeout(hardCap);
      window.removeEventListener("load", fadeOverlay);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background pointer-events-none"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 280ms ease" }}
    >
      <div className="w-10 h-10 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
    </div>
  );
}
