import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Waves, BarChart2, Filter, ShieldCheck, Fingerprint, Terminal } from "lucide-react";
import { useTranslation } from "../lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

type NavLink = { href: string; label: string; key?: string };

type PublicNavbarProps = {
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
};

const DEFAULT_LINKS: NavLink[] = [
  { href: "/", label: "Home", key: "nav.home" },
  { href: "/about", label: "About", key: "nav.about" },
  { href: "/case-studies", label: "Case studies", key: "nav.caseStudies" },
  { href: "/news", label: "News", key: "nav.news" },
  { href: "/contact", label: "Contact", key: "nav.contact" },
];

const SOLUTIONS_STATIC = [
  { href: "/solutions/maritime",     key: "maritime",     icon: Waves,      color: "#3b82f6" },
  { href: "/solutions/revenues",     key: "revenues",     icon: BarChart2,  color: "#f59e0b" },
  { href: "/solutions/dpi",          key: "dpi",          icon: Filter,     color: "#6366f1" },
  { href: "/solutions/cybersecurity",key: "cybersecurity",icon: ShieldCheck, color: "#10b981" },
  { href: "/solutions/cybercrime",   key: "cybercrime",   icon: Fingerprint, color: "#f43f5e" },
];

export default function PublicNavbar({
  links = DEFAULT_LINKS,
  ctaLabel = "Login",
  ctaHref = "/login",
}: PublicNavbarProps) {
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t, locale, setLocale } = useTranslation();

  const SOLUTIONS = SOLUTIONS_STATIC.map((s) => ({
    ...s,
    label: t(`nav.sol.${s.key}.label`),
    desc: t(`nav.sol.${s.key}.desc`),
  }));

  // Scroll-aware background
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open command palette via Ctrl+K
  function handleCmdK(e: React.MouseEvent) {
    e.preventDefault();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  }

  const isSolutionActive = location.startsWith("/solutions");

  return (
    <nav
      className={`sticky top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-navy-100/60 shadow-[0_4px_24px_rgba(15,42,95,0.08)]"
          : "bg-white/80 backdrop-blur-md border-b border-navy-100/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Back to homepage">
          <img
            src="/mazen-logo.jpg?v=20260413"
            alt="Mazen GovTech Group"
            className="h-10 w-auto object-contain rounded-lg ring-1 ring-navy-100 group-hover:ring-gold-400/50 transition-all"
          />
          <div className="hidden md:block">
            <div className="text-sm font-black text-navy-950 leading-tight tracking-tight">
              Mazen GovTech{" "}
              <span className="text-navy-600">Group</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium tracking-wide">
              Sovereign Strategic Infrastructure
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-600">
          {links.map((item) =>
            item.href.startsWith("#") ? (
              <a key={item.href} href={item.href} className="relative hover:text-navy-800 transition-colors py-1 group">
                {item.key ? t(item.key) : item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 hover:text-navy-800 transition-colors group ${
                  location === item.href ? "text-navy-900 font-bold" : ""
                }`}
              >
                {item.key ? t(item.key) : item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 rounded-full transition-all duration-300 ${
                    location === item.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            )
          )}

          {/* Dropdown Solutions */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setSolutionsOpen((v) => !v)}
              className={`relative flex items-center gap-1.5 py-1 hover:text-navy-800 transition-colors group ${
                isSolutionActive ? "text-navy-900 font-bold" : ""
              }`}
            >
              {t("nav.solutions") || "Solutions"}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${solutionsOpen ? "rotate-180 text-gold-500" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 rounded-full transition-all duration-300 ${
                  isSolutionActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>

            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-navy-100 rounded-2xl shadow-[0_24px_48px_rgba(15,42,95,0.15)] py-2 z-50 overflow-hidden"
                >
                  {/* Accent bar */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-navy-600 via-gold-400 to-navy-600 mb-1" />
                  {SOLUTIONS.map((sol) => (
                    <Link
                      key={sol.href}
                      href={sol.href}
                      onClick={() => setSolutionsOpen(false)}
                      className="flex items-start gap-3 px-4 py-3.5 hover:bg-navy-50/70 transition-colors group"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                        style={{ background: `${sol.color}18` }}
                      >
                        <sol.icon className="w-4 h-4" style={{ color: sol.color }} />
                      </div>
                      <div>
                        <p
                          className={`font-bold text-sm transition-colors ${
                            location === sol.href ? "text-navy-700" : "text-navy-950 group-hover:text-navy-700"
                          }`}
                        >
                          {sol.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{sol.desc}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3 ml-2">
            {/* Cmd+K hint */}
            <button
              onClick={handleCmdK}
              title="Open command palette (Ctrl+K)"
              className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-navy-700 transition-colors border border-slate-200 hover:border-navy-300 rounded-lg px-2.5 py-1.5 bg-slate-50 hover:bg-navy-50 group"
            >
              <Terminal className="w-3 h-3 group-hover:text-gold-500 transition-colors" />
              <kbd className="font-mono font-bold">⌘K</kbd>
            </button>

            {/* Language switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
              <button
                onClick={() => setLocale("fr")}
                className={`px-2.5 py-1.5 text-xs font-bold transition-colors min-w-[36px] ${
                  locale === "fr" ? "bg-navy-700 text-white" : "text-slate-600 bg-white hover:bg-slate-50"
                }`}
                aria-label="Français"
              >
                FR
              </button>
              <button
                onClick={() => setLocale("en")}
                className={`px-2.5 py-1.5 text-xs font-bold transition-colors min-w-[36px] border-l border-slate-200 ${
                  locale === "en" ? "bg-navy-700 text-white" : "text-slate-600 bg-white hover:bg-slate-50"
                }`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {/* CTA */}
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-navy-500/20 hover:shadow-md"
            >
              {t("nav.login") || ctaLabel}
            </Link>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-navy-50 transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} className="block">
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} className="block">
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-navy-100 bg-white"
          >
            <div className="px-6 py-4 flex flex-col gap-1 text-sm font-semibold text-slate-700">
              {links.map((item) =>
                item.href.startsWith("#") ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="py-2.5 hover:text-navy-700 transition-colors"
                  >
                    {item.key ? t(item.key) : item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`py-2.5 block hover:text-navy-700 transition-colors ${
                      location === item.href ? "text-navy-700 font-bold" : ""
                    }`}
                  >
                    {item.key ? t(item.key) : item.label}
                  </Link>
                )
              )}

              {/* Solutions mobile */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileExpanded((v) => !v)}
                  className={`flex items-center gap-1.5 w-full py-2.5 hover:text-navy-700 transition-colors ${
                    isSolutionActive ? "text-navy-700 font-bold" : ""
                  }`}
                >
                  {t("nav.solutions")}
                  <ChevronDown
                    className={`w-3.5 h-3.5 ml-auto transition-transform ${mobileExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 border-l-2 border-gold-300 pl-4 overflow-hidden"
                    >
                      {SOLUTIONS.map((sol) => (
                        <Link
                          key={sol.href}
                          href={sol.href}
                          onClick={() => { setOpen(false); setMobileExpanded(false); }}
                          className={`flex items-center gap-2 py-2.5 text-sm hover:text-navy-700 transition-colors ${
                            location === sol.href ? "text-navy-700 font-bold" : "text-slate-600"
                          }`}
                        >
                          <sol.icon className="w-4 h-4" style={{ color: sol.color }} />
                          {sol.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom controls */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-navy-100">
                <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setLocale("fr")}
                    className={`px-3 py-2 text-xs font-bold min-w-[40px] ${
                      locale === "fr" ? "bg-navy-700 text-white" : "text-slate-600"
                    }`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => setLocale("en")}
                    className={`px-3 py-2 text-xs font-bold min-w-[40px] border-l border-slate-200 ${
                      locale === "en" ? "bg-navy-700 text-white" : "text-slate-600"
                    }`}
                  >
                    EN
                  </button>
                </div>
                <Link
                  href={ctaHref}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                >
                  {t("nav.login") || ctaLabel}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
