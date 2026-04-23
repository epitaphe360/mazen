import { useRef, type HTMLAttributes } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../lib/cn";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Degrees of max tilt. Default 12 */
  maxTilt?: number;
  /** Scale on hover. Default 1.03 */
  scale?: number;
}

/**
 * TiltCard — 3D perspective tilt that follows the cursor.
 */
export default function TiltCard({
  children,
  className,
  maxTilt = 12,
  scale = 1.03,
  ...rest
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 260,
    damping: 22,
  });
  const scaleVal = useSpring(1, { stiffness: 260, damping: 22 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onEnter() { scaleVal.set(scale); }
  function onLeave() { x.set(0); y.set(0); scaleVal.set(1); }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, scale: scaleVal, transformStyle: "preserve-3d" }}
      className={cn("perspective-1000", className)}
      {...(rest as any)}
    >
      {children}
    </motion.div>
  );
}
