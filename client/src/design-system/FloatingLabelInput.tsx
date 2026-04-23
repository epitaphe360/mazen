import { useId, useRef, useState, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/cn";

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Icon rendered inside left side */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * FloatingLabelInput — Material-style floating label with gold focus underline.
 */
export default function FloatingLabelInput({
  label,
  error,
  icon: Icon,
  className,
  value,
  defaultValue,
  onChange,
  ...rest
}: FloatingLabelInputProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const filled = value !== undefined ? String(value).length > 0 : String(internalValue).length > 0;
  const float = focused || filled;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (value === undefined) setInternalValue(e.target.value);
    onChange?.(e);
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-white/90 transition-all duration-200",
          focused
            ? "border-gold-500 shadow-[0_0_0_3px_rgba(189,134,50,0.18)]"
            : error
            ? "border-rose-500 shadow-[0_0_0_3px_rgba(239,68,68,0.14)]"
            : "border-slate-200 hover:border-slate-300"
        )}
      >
        {Icon && (
          <span className={cn("ml-4 flex-shrink-0 transition-colors duration-200", focused ? "text-gold-600" : "text-slate-400")}>
            <Icon className="w-4 h-4" />
          </span>
        )}
        <div className="relative flex-1">
          <motion.label
            htmlFor={id}
            animate={{ y: float ? -10 : 2, scale: float ? 0.78 : 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            style={{ originX: 0, originY: 0 }}
            className={cn(
              "absolute left-4 top-4 font-medium pointer-events-none select-none whitespace-nowrap",
              float ? (focused ? "text-gold-600" : "text-slate-400") : "text-slate-500",
              float ? "text-xs" : "text-sm"
            )}
          >
            {label}
          </motion.label>
          <input
            id={id}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent px-4 pb-2.5 pt-6 text-sm text-slate-900 outline-none"
            {...rest}
          />
        </div>
      </div>
      {/* Gold underline that expands on focus */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0.5 }}
          className="h-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-xs text-rose-600 ml-4"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
