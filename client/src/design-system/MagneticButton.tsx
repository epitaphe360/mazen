import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/cn";

type CommonProps = {
  strength?: number;
  children: React.ReactNode;
  className?: string;
};

/**
 * MagneticButton — element drifts toward the cursor when hovered.
 * Wraps both <button> and <a>.
 */
export const MagneticButton = forwardRef<HTMLButtonElement, CommonProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  function MagneticButton({ children, className, strength = 0.35, ...rest }, ref) {
    const localRef = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });

    function onMove(e: React.MouseEvent<HTMLButtonElement>) {
      const el = localRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * strength);
      y.set((e.clientY - (r.top + r.height / 2)) * strength);
    }
    function onLeave() { x.set(0); y.set(0); }

    return (
      <motion.button
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ x: sx, y: sy }}
        className={cn("magnetic", className)}
        {...(rest as any)}
      >
        {children}
      </motion.button>
    );
  }
);

export function MagneticAnchor({
  children,
  className,
  strength = 0.35,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() { x.set(0); y.set(0); }

  return (
    <motion.a
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn("magnetic", className)}
      {...(rest as any)}
    >
      {children}
    </motion.a>
  );
}
