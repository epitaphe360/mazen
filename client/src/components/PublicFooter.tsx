import React from "react";
import { Link } from "wouter";
import { useTranslation } from "../lib/i18n";

export default function PublicFooter() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gradient-to-r from-[#0a1c3d] via-[#0f2a5f] to-[#123a7b] text-blue-100/80 py-8 mt-auto border-t border-blue-300/20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/mazen-logo.jpg?v=20260413" alt="Mazen GovTech Groupe" className="h-10 w-auto object-contain" />
          <div>
            <div className="text-white font-bold text-sm">{t('footer.company')}</div>
            <div className="text-blue-100/70 text-xs">
              {t('footer.copy', { year: new Date().getFullYear() })}
            </div>
          </div>
        </div>
        <nav aria-label="Liens du pied de page">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/"><a className="hover:text-white transition-colors">Accueil</a></Link>
            <Link href="/about"><a className="hover:text-white transition-colors">À propos</a></Link>
            <Link href="/case-studies"><a className="hover:text-white transition-colors">Cas d'usage</a></Link>
            <Link href="/news"><a className="hover:text-white transition-colors">Actualités</a></Link>
            <Link href="/contact"><a className="hover:text-white transition-colors">Contact</a></Link>
            <Link href="/login"><a className="hover:text-white transition-colors">Connexion</a></Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
