import { useRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * SpotlightCard — radial gradient glow that follows the cursor.
 * Composes with .surface, .surface-interactive, etc.
 */
export default function SpotlightCard({ children, className, ...rest }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={onMove} className={cn("spotlight", className)} {...rest}>
      {children}
    </div>
  );
}
