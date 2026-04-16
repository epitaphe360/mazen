import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Waves, BarChart2 } from "lucide-react";

type NavLink = { href: string; label: string };

type PublicNavbarProps = {
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
};

const DEFAULT_LINKS: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/case-studies", label: "Cas d'usage" },
  { href: "/news", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

const SOLUTIONS = [
  {
    href: "/solutions/maritime",
    label: "Souveraineté Maritime",
    desc: "Maritime Surveillance Grid · 3 couches",
    icon: Waves,
  },
  {
    href: "/solutions/revenues",
    label: "Recettes Publiques",
    desc: "Revenue Intelligence Platform · Fiscalité",
    icon: BarChart2,
  },
];

export default function PublicNavbar({
  links = DEFAULT_LINKS,
  ctaLabel = "Connexion",
  ctaHref = "/login",
}: PublicNavbarProps) {
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Ferme le dropdown solutions en cliquant ailleurs */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSolutionActive = location.startsWith("/solutions");

  return (
    <nav className="sticky top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-[0_8px_30px_rgba(15,42,95,0.06)]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/">
          <a className="flex items-center gap-3" aria-label="Retour à l'accueil">
            <img src="/mazen-logo.jpg?v=20260413" alt="Mazen GovTech Groupe" className="h-10 w-auto object-contain" />
            <div className="hidden md:block">
              <div className="text-sm font-extrabold text-gray-900 leading-tight">
                Mazen GovTech <span className="text-blue-700">Groupe</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">Sovereign Strategic Infrastructure Company</div>
            </div>
          </a>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
          {links.map((item) =>
            item.href.startsWith("#") ? (
              <a key={item.href} href={item.href} className="hover:text-govblue transition-colors">
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href}>
                <a className={`hover:text-govblue transition-colors ${
                  location === item.href ? "text-govblue font-bold" : ""
                }`}>{item.label}</a>
              </Link>
            )
          )}

          {/* Dropdown Solutions */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setSolutionsOpen((v) => !v)}
              className={`flex items-center gap-1 hover:text-govblue transition-colors ${
                isSolutionActive ? "text-govblue font-bold" : ""
              }`}
            >
              Solutions
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
            </button>
            {solutionsOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-blue-100 rounded-xl shadow-xl py-2 z-50">
                {SOLUTIONS.map((sol) => (
                  <Link key={sol.href} href={sol.href}>
                    <a
                      onClick={() => setSolutionsOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50/80 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-200 transition-colors">
                        <sol.icon className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <p className={`font-semibold text-gray-900 text-sm ${
                          location === sol.href ? "text-govblue" : ""
                        }`}>{sol.label}</p>
                        <p className="text-xs text-gray-500">{sol.desc}</p>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={ctaHref}>
            <a className="btn-primary py-2.5 px-5 text-sm">{ctaLabel}</a>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-blue-50"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-blue-100 px-6 py-4 bg-white">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            {links.map((item) =>
              item.href.startsWith("#") ? (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="hover:text-govblue transition-colors">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href}>
                  <a onClick={() => setOpen(false)} className={`hover:text-govblue transition-colors ${
                    location === item.href ? "text-govblue font-bold" : ""
                  }`}>
                    {item.label}
                  </a>
                </Link>
              )
            )}

            {/* Solutions (mobile) */}
            <div>
              <button
                type="button"
                onClick={() => setMobileExpanded((v) => !v)}
                className={`flex items-center gap-1 w-full text-left hover:text-govblue transition-colors ${
                  isSolutionActive ? "text-govblue font-bold" : ""
                }`}
              >
                Solutions
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ml-auto ${mobileExpanded ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded && (
                <div className="mt-2 ml-4 flex flex-col gap-2">
                  {SOLUTIONS.map((sol) => (
                    <Link key={sol.href} href={sol.href}>
                      <a onClick={() => { setOpen(false); setMobileExpanded(false); }} className={`text-sm hover:text-govblue transition-colors ${
                        location === sol.href ? "text-govblue font-bold" : "text-slate-600"
                      }`}>
                        {sol.label}
                      </a>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href={ctaHref}>
              <a onClick={() => setOpen(false)} className="btn-primary justify-center py-2.5 mt-1">
                {ctaLabel}
              </a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}