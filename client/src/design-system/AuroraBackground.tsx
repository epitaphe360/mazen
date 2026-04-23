import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * AuroraBackground — animated mesh gradient. WebGL-quality look without WebGL.
 * For dark sections (hero, login, CTA blocks).
 */
export default function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Layer 1 — large slow blobs */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[120%] h-[120%] opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(47,89,159,0.55) 0%, rgba(47,89,159,0) 55%)",
        }}
        animate={{ x: [0, 80, -40, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* Layer 2 — gold accent */}
      <motion.div
        className="absolute top-1/3 -right-1/4 w-[80%] h-[80%] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(189,134,50,0.45) 0%, rgba(189,134,50,0) 60%)",
        }}
        animate={{ x: [0, -60, 30, 0], y: [0, 50, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      {/* Layer 3 — cyan ribbon */}
      <motion.div
        className="absolute bottom-0 left-0 w-[100%] h-[60%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(133,163,211,0.40) 0%, rgba(133,163,211,0) 60%)",
        }}
        animate={{ x: [0, 100, 50, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.10] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
