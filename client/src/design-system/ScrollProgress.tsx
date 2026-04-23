import { motion, useScroll, useSpring } from "framer-motion";

/** ScrollProgress — slim gold bar at top of viewport tracking page progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: 0.3 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 origin-left z-[60] shadow-[0_0_12px_rgba(220,188,108,0.6)]"
      aria-hidden="true"
    />
  );
}
