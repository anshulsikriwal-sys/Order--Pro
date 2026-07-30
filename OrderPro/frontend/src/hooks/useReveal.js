import { useEffect, useRef, useState } from "react";

/**
 * Adds a "reveal" class once the element scrolls into view.
 * Usage: const [ref, visible] = useReveal();  <div ref={ref} className={visible ? "reveal-in" : "reveal-out"}>
 */
export default function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}
