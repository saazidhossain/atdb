/**
 * Pure CSS scroll-driven progress bar — zero JS, zero re-renders.
 * Falls back gracefully in browsers without animation-timeline support.
 */
export default function ScrollProgress() {
  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 origin-left"
        style={{
          boxShadow: "0 0 12px hsl(25 95% 55% / 0.6)",
          transform: "scaleX(0)",
          animation: "scroll-progress auto linear",
          animationTimeline: "scroll(root)",
        }}
      />
    </div>
  );
}
