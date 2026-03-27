import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const TEAM_VALUES = [
  { icon: "🌍", title: "Présence mondiale", desc: "Collaborateurs hautement qualifiés basés en Europe, en Asie et en Afrique" },
  { icon: "🔬", title: "R&D florissant", desc: "Département recherche & développement innovant en constante évolution" },
  { icon: "🎓", title: "Ingénieurs d'exception", desc: "Diplômés d'universités de renommée mondiale avec expertise en Big Data" },
  { icon: "🛡️", title: "Sécurité maximale", desc: "Architecture VPN tunnel, pare-feux, DMZ, serveurs XDR redondants" },
];

const ARCHITECTURE_ITEMS = [
  "Collecte de fichiers & décodage XDR",
  "Transformation de données",
  "Chargement de données",
  "Serveurs de bases de données",
  "Stockage de fichiers et de données",
  "Analyse des données",
  "Centre d'exploitation du réseau",
  "Tunnel VPN Inspec sécurisé",
  "Sauvegarde & archives XDR",
];

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src="/mazen-logo.png" alt="Mazen GovTech Groupe" className="h-12 w-auto object-contain" />
              <div className="hidden md:block">
                <div className="text-base font-extrabold text-gray-900 leading-tight">Mazen GovTech <span className="text-blue-700">Groupe</span></div>
                <div className="text-xs text-gray-400 font-medium">Sovereign Strategic Infrastructure Company</div>
              </div>
            </a>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/"><a className="hover:text-blue-700">Accueil</a></Link>
            <Link href="/case-studies"><a className="hover:text-blue-700">Cas d'usage</a></Link>
            <Link href="/news"><a className="hover:text-blue-700">Actualités</a></Link>
            <Link href="/contact"><a className="hover:text-blue-700">Contact</a></Link>
            <Link href="/login"><a className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-5 rounded-lg font-semibold transition-colors">Connexion</a></Link>
          </div>
        </div>
      </nav>

      {/* Hero About */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-950 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 block">Notre histoire</span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">À propos de MAZEN</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Leader mondial des technologies gouvernementales depuis 1986, MAZEN transforme les économies numériques en recettes publiques certifiées et auditables.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block">Depuis 1986</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Une entreprise leader dans le domaine des technologies gouvernementales
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-base">
                MAZEN est une entreprise leader dans le domaine des technologies gouvernementales. Depuis <strong>1986</strong>, nous avons constitué un réseau de collaborateurs hautement qualifiés basés en <strong>Europe, en Asie et en Afrique</strong>, avec un département R&D florissant.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4 text-base">
                Notre équipe est composée d'ingénieurs exceptionnels diplômés d'universités de renommée mondiale et possédant une solide expertise en <strong>traitement de données, fiscalité numérique et gouvernance</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed text-base">
                Nos systèmes analysent et traitent quotidiennement <strong className="text-blue-700">13 milliards de transactions</strong>, supervisant plus de <strong className="text-blue-700">15 milliards de dollars</strong> sur les réseaux des opérateurs depuis 2009.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="grid grid-cols-2 gap-4">
                {TEAM_VALUES.map((v, i) => (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-blue-50 rounded-2xl p-6 border border-blue-100 hover:border-blue-300 transition-colors"
                  >
                    <span className="text-3xl mb-3 block">{v.icon}</span>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{v.title}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block">Références</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Nos partenaires gouvernementaux</h2>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
              À titre indicatif, voici une sélection de partenaires pour lesquels Mazen Partner est la solution officielle de Gouvernance
            </p>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm inline-block">
              <img src="/partners.png" alt="Partenaires Mazen" className="max-h-28 mx-auto object-contain" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { v: "$15Mrd", l: "Supervisés", sub: "2009 — aujourd'hui" },
                { v: "13Mrd", l: "Transactions/jour", sub: "En temps réel" },
                { v: "4", l: "Pays déployés", sub: "RDC, Mali, Burundi, Sierra Leone" },
                { v: "1986", l: "Fondée en", sub: "35+ ans d'expertise" },
              ].map(s => (
                <div key={s.v} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="text-3xl font-extrabold text-blue-700 mb-1">{s.v}</div>
                  <div className="font-semibold text-gray-800 text-sm">{s.l}</div>
                  <div className="text-gray-400 text-xs mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture technique */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block">Infrastructure</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Architecture Plateforme Mazen Gov</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Notre infrastructure repose sur une architecture redondante et sécurisée utilisant des tunnels VPN, des pare-feux de niveau enterprise, des serveurs XDR de traitement distribué et des bases de données répliquées.
              </p>
              <div className="space-y-3">
                {ARCHITECTURE_ITEMS.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</div>
                    <span className="text-gray-700 text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6">
                <img src="/mazen-logo-icon.png" alt="Plateforme Mazen Gov" className="w-32 h-32 object-contain mx-auto mb-4" />
                <h3 className="text-center font-bold text-gray-900 mb-2">Plateforme Mazen Gov</h3>
                <p className="text-center text-gray-500 text-sm">Solution de gouvernance certifiée ETL-Certification®</p>
              </div>
              <img src="/tech-transfer.png" alt="Transfert technologique" className="w-full rounded-2xl shadow-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-950 to-indigo-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold mb-4">Travaillons ensemble</h2>
            <p className="text-blue-200 mb-8 text-lg">
              Découvrez comment Mazen GovTech peut transformer les recettes publiques de votre pays.
            </p>
            <Link href="/contact">
              <a className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg">
                Contactez-nous
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/mazen-logo.png" alt="Mazen GovTech Groupe" className="h-10 w-auto object-contain" />
            <div>
              <div className="text-white font-bold text-sm">Mazen GovTech Groupe</div>
              <div className="text-gray-500 text-xs">© 2026 — Sovereign Strategic Infrastructure Company</div>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/"><a className="hover:text-white">Accueil</a></Link>
            <Link href="/news"><a className="hover:text-white">Actualités</a></Link>
            <Link href="/contact"><a className="hover:text-white">Contact</a></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
