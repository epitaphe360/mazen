import React from "react";
import { Link } from "wouter";
import { useTranslation } from "../lib/i18n";
import { ShieldCheck, Globe, Mail, MapPin, Phone, ArrowUpRight, Linkedin, Twitter } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    titleKey: "footer.navigate",
    fallback: "Navigate",
    links: [
      { href: "/", labelKey: "nav.home", fallback: "Home" },
      { href: "/about", labelKey: "nav.about", fallback: "About" },
      { href: "/case-studies", labelKey: "nav.caseStudies", fallback: "Case studies" },
      { href: "/news", labelKey: "nav.news", fallback: "News" },
      { href: "/contact", labelKey: "nav.contact", fallback: "Contact" },
    ],
  },
  {
    titleKey: "footer.solutions",
    fallback: "Solutions",
    links: [
      { href: "/solutions/maritime", labelKey: "", fallback: "Maritime Sovereignty" },
      { href: "/solutions/revenues", labelKey: "", fallback: "Public Revenues" },
      { href: "/dashboard", labelKey: "", fallback: "Government Dashboard" },
      { href: "/dashboard/reporting", labelKey: "", fallback: "Reporting Suite" },
    ],
  },
  {
    titleKey: "footer.company",
    fallback: "Company",
    links: [
      { href: "/about#mission", labelKey: "", fallback: "Mission & Vision" },
      { href: "/about#certifications", labelKey: "", fallback: "Certifications" },
      { href: "/news", labelKey: "", fallback: "Press Room" },
      { href: "/contact", labelKey: "", fallback: "Partnerships" },
    ],
  },
];

const CERTIFICATIONS = [
  { code: "ISO 9001", label: "Quality Management" },
  { code: "ISO 27001", label: "Information Security" },
];

export default function PublicFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 surface-inverse rounded-none">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 pb-12 border-b border-white/10">
          {/* Brand block */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
                <img
                  src="/mazen-logo.jpg?v=20260413"
                  alt="Mazen GovTech Group"
                  className="h-12 w-auto object-contain rounded-md ring-1 ring-white/10"
                />
                <div>
                  <div className="text-white font-bold text-base font-display tracking-tight">
                    Mazen GovTech <span className="text-gold-400">Group</span>
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    Sovereign Strategic Infrastructure Company
                  </div>
                </div>
              </Link>
            <p className="text-sm text-white/65 leading-relaxed max-w-md mb-6">
              Since 1986, Mazen GovTech Group has equipped sovereign states with certified
              fiscal-flow supervision and maritime intelligence platforms — engineered for absolute
              data integrity and legal enforceability.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CERTIFICATIONS.map((c) => (
                <span
                  key={c.code}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/80"
                >
                  <ShieldCheck className="w-3 h-3 text-gold-400" />
                  <strong className="font-mono font-semibold">{c.code}</strong>
                  <span className="text-white/40">·</span>
                  <span className="text-white/55">{c.label}</span>
                </span>
              ))}
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/65">
              <a href="mailto:contact@mazen.group" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                contact@mazen.group
              </a>
              <a href="tel:+33000000000" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                +33 (0)1 00 00 00 00
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                Paris · Dakar · Kinshasa
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-gold-400" />
                4 nations · $15B+ supervised
              </span>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.fallback}>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gold-400 mb-4">
                  {t(col.titleKey) || col.fallback}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href + link.fallback}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors link-underline"
                      >
                          {link.labelKey ? t(link.labelKey) || link.fallback : link.fallback}
                          <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                        </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 text-xs text-white/45">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {year} Mazen GovTech Group. All rights reserved.</span>
            <span className="hidden md:inline text-white/20">·</span>
            <Link href="/legal" className="hover:text-white transition-colors">Legal notice</Link>
            <span className="text-white/20">·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span className="text-white/20">·</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-white/70" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Twitter / X"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors"
            >
              <Twitter className="w-3.5 h-3.5 text-white/70" />
            </a>
            <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] text-white/50">
              <kbd>⌘</kbd>
              <kbd>K</kbd>
              <span className="text-white/30">to navigate</span>
            </span>
          </div>
        </div>
      </div>

      {/* Subtle corner glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-gold-500/10 blur-[120px] rounded-full" />
    </footer>
  );
}
