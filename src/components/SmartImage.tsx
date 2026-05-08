import { useState, type ImgHTMLAttributes } from "react";

/**
 * Image with a built-in shimmer skeleton until it paints.
 * Drop-in replacement for <img> inside a positioned wrapper (relative + sized).
 */
export default function SmartImage({
  className = "",
  onLoad,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <span
          aria-hidden
          className="atdb-skel absolute inset-0 z-[1]"
        />
      )}
      <img
        {...props}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      />
    </>
  );
}
