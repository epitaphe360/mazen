import React from "react";
import { Link } from "wouter";
import { useTranslation } from "../lib/i18n";
import { ShieldCheck, Globe, Mail, MapPin, ArrowUpRight, Linkedin, Twitter, FileBadge } from "lucide-react";

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
    titleKey: "footer.companySection",
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
                  alt="MAZEN GovTech"
                  className="h-12 w-auto object-contain rounded-md ring-1 ring-white/10"
                />
                <div>
                  <div className="text-white font-bold text-base font-display tracking-tight">
                    MAZEN GovTech
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    Sovereign Strategic Infrastructure Company
                  </div>
                </div>
              </Link>
            <p className="text-sm text-white/65 leading-relaxed max-w-md mb-6">
              {t("footer.description")}
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
            <div className="grid grid-cols-1 gap-3 text-sm text-white/65">
              <a href={`mailto:${t("footer.email")}`} className="flex items-start gap-2 hover:text-gold-400 transition-colors">
                <Mail className="w-3.5 h-3.5 text-gold-400 mt-0.5 flex-shrink-0" />
                {t("footer.email")}
              </a>
              <span className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 mt-0.5 flex-shrink-0" />
                {t("footer.address")}
              </span>
              <span className="flex items-start gap-2">
                <FileBadge className="w-3.5 h-3.5 text-gold-400 mt-0.5 flex-shrink-0" />
                {t("footer.incorporation")}
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-gold-400" />
                {t("footer.reach")}
              </span>
            </div>

            {/* Strategic partners */}
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gold-400 mb-3">
                {t("footer.partnersTitle")}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
                  {t("footer.partners.c4isr")}
                </span>
                <span className="inline-flex flex-col px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80">
                  <strong>{t("footer.partners.ito")}</strong>
                  <span className="text-white/50">{t("footer.partners.itoTagline")}</span>
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
                  {t("footer.partners.mssa")}
                </span>
              </div>
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
            <span>© {year} MAZEN GovTech. {t("footer.rights")}</span>
            <span className="hidden md:inline text-white/20">·</span>
            <Link href="/legal" className="hover:text-white transition-colors">{t("footer.legalNotice")}</Link>
            <span className="text-white/20">·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacy")}</Link>
            <span className="text-white/20">·</span>
            <Link href="/terms" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
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
