import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PageLoader — initial app loader with logo stroke animation + wipe.
 */
export default function PageLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
            transition: { duration: 0.8, ease: [0.83, 0, 0.17, 1] },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center mesh-bg"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          <div className="flex flex-col items-center gap-8">
            {/* Animated Mazen mark */}
            <motion.svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M 12 60 L 12 20 L 40 50 L 68 20 L 68 60"
                stroke="#dcbc6c"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>

            {/* Loading bar */}
            <div className="w-44 h-[2px] bg-white/15 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1] }}
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              />
            </div>

            <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium">
              Sovereign Infrastructure
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
