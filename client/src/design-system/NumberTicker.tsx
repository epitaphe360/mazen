import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../lib/cn";

interface NumberTickerProps {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Add thousand separators */
  separator?: string;
}

/**
 * NumberTicker — animated counter that runs once when in view.
 */
export default function NumberTicker({
  value,
  decimals = 0,
  duration = 1.6,
  prefix = "",
  suffix = "",
  separator = "\u00A0",
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState("0");
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (!inView) return;
    motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      const n = Number(latest);
      const formatted = n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).replace(/,/g, separator);
      setDisplay(formatted);
    });
  }, [spring, decimals, separator]);

  return (
    <span ref={ref} className={cn("ticker tabular-nums", className)}>
      {prefix}{display}{suffix}
    </span>
  );
}
