import { useEffect, useRef, useState } from "react";

/**
 * MagneticCursor — custom cursor that grows on interactive elements.
 * Auto-disabled on touch devices and reduced-motion preference.
 */
export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;

    setEnabled(true);
    document.body.classList.add("has-magnetic-cursor");

    function onMove(e: MouseEvent) {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
    }
    function onOver(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!dotRef.current) return;
      if (t.closest("a, button, [role='button'], .magnetic, .surface-interactive, .editorial-card, .institution-card")) {
        dotRef.current.dataset.variant = "hover";
      } else if (t.closest("input, textarea, [contenteditable='true']")) {
        dotRef.current.dataset.variant = "text";
      } else {
        delete dotRef.current.dataset.variant;
      }
    }

    let raf = 0;
    function loop() {
      currentX.current += (targetX.current - currentX.current) * 0.22;
      currentY.current += (targetY.current - currentY.current) * 0.22;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${currentX.current}px, ${currentY.current}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("has-magnetic-cursor");
    };
  }, []);

  if (!enabled) return null;
  return <div ref={dotRef} className="magnetic-cursor" aria-hidden="true" />;
}
