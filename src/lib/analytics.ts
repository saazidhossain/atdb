/**
 * Lightweight, provider-agnostic analytics dispatcher.
 *
 * Forwards events to whichever provider is loaded on the page:
 *   - Google Tag Manager  (window.dataLayer.push)
 *   - Google Analytics 4  (window.gtag)
 *   - Plausible           (window.plausible)
 *   - PostHog             (window.posthog.capture)
 *
 * Also dispatches a `atdb:track` CustomEvent so any other listener can subscribe.
 * Safe to call before any provider is installed — calls are silently no-op.
 */
export type TrackProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: TrackProps }) => void;
    posthog?: { capture: (event: string, props?: TrackProps) => void };
  }
}

export function trackEvent(event: string, props: TrackProps = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
    window.gtag?.("event", event, props);
    window.plausible?.(event, { props });
    window.posthog?.capture(event, props);
    window.dispatchEvent(new CustomEvent("atdb:track", { detail: { event, props } }));
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, props);
    }
  } catch {
    /* never let analytics break the UI */
  }
}
