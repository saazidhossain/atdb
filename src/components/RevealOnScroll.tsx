import { useEffect, useRef, useState, Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Enable staggered reveal for direct children (e.g. grid cards) */
  stagger?: number;
}

/**
 * Wraps children in a div that fades + slides up when it enters the viewport.
 * With `stagger` prop, each direct child animates with incremental delay.
 * Respects prefers-reduced-motion (renders immediately, no transform).
 */
export default function RevealOnScroll({ children, className = "", delay = 0, stagger }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Stagger mode: wrap each child with individual delay
  if (stagger && stagger > 0) {
    const childArray = Children.toArray(children);
    return (
      <div ref={ref} className={className}>
        {childArray.map((child, i) => {
          const childDelay = delay + i * stagger;
          if (isValidElement(child)) {
            return (
              <div
                key={(child as ReactElement).key ?? i}
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 600ms ease ${childDelay}ms, transform 600ms cubic-bezier(0.2,0.7,0.2,1) ${childDelay}ms`,
                  willChange: shown ? "auto" : "opacity, transform",
                }}
              >
                {child}
              </div>
            );
          }
          return child;
        })}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.2,0.7,0.2,1) ${delay}ms`,
        willChange: shown ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
