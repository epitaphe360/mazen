import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { KEY_STATS, SECTORS_DATA } from "@shared/types";
import { Link } from "wouter";
import { useRef } from "react";

const ETL_PILLARS = [
  {
    step: "01",
    letter: "E",
    title: "EXTRACTION",
    color: "from-blue-600 to-blue-700",
    img: "/etl-extract.png",
    description:
      "Transformation des enregistrements de données d'événements à partir de plusieurs sources différentes. Collecte et décodage XDR de fichiers bruts des opérateurs.",
  },
  {
    step: "02",
    letter: "T",
    title: "TRANSFORMATION",
    color: "from-indigo-600 to-indigo-700",
    img: null,
    description:
      "Conversion des enregistrements dans un format unique et compréhensible. Consolidation automatisée avec transmission confidentielle.",
  },
  {
    step: "03",
    letter: "L",
    title: "CHARGEMENT",
    color: "from-violet-600 to-violet-700",
    img: null,
    description:
      "Stockage dans une base de données unique et utilisation des outils de business intelligence pour extraire les informations pertinentes.",
  },
  {
    step: "04",
    letter: "C",
    title: "CERTIFICATION",
    color: "from-purple-700 to-purple-800",
    img: "/etl-certify.png",
    description:
      "Certification des données avec les algorithmes propriétaires ETL-Certification® pour garantir l'intégrité absolue des informations fiscales.",
  },
];

const CASE_STUDIES = [
  {
    id: 1,
    country: "RDC",
    flag: "🇨🇩",
    fullName: "République Démocratique du Congo",
    title: "Taxes Télécommunications",
    img: "/case-rdc.png",
    partner: "Direction Générale des Douanes et Accises (DGDA)",
    result: "+60%",
    resultLabel: "d'accises & TVA après 1 an",
    details: "Services de télécommunications soumis aux droits d'accises, à la TVA et à d'autres prélèvements. Les revenus des opérateurs mobile représentent 5% du PIB.",
    color: "border-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    country: "Mali",
    flag: "🇲🇱",
    fullName: "République du Mali",
    title: "Mobile Money",
    img: null,
    partner: "Ministère des Finances",
    result: "100%",
    resultLabel: "visibilité des transactions",
    details: "Traitement et analyse des métadonnées des transactions d'argent mobile. Production de rapports détaillés sur les activités et les taxes à percevoir.",
    color: "border-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    country: "Burundi",
    flag: "🇧🇮",
    fullName: "République du Burundi",
    title: "Jeux & Paris en ligne",
    img: "/case-burundi.png",
    partner: "Ministère des Finances & Ministère du Commerce",
    result: "8",
    resultLabel: "opérateurs agréés",
    details: "Redevances sur les jeux de hasard et de paris. Signature : janvier 2024 — Installation : mars 2024. Uniquement les jeux d'argent en ligne autorisés.",
    color: "border-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: 4,
    country: "Sierra Leone",
    flag: "🇸🇱",
    fullName: "Sierra Leone",
    title: "Taxes Télécommunications",
    img: "/case-sierra-leone.jpg",
    partner: "NRA — Autorité Nationale des Recettes (Accord BOT)",
    result: "552%",
    resultLabel: "hausse max des recettes",
    details: "Accord de construction-exploitation-transfert (BOT) signé en avril 2023 avec la NRA pour les télécommunications, le mobile money et les paris.",
    color: "border-amber-500",
    bgColor: "bg-amber-50",
  },
];

const WHY_US_PILLARS = [
  {
    icon: "🏆",
    title: "Certifications internationales",
    description:
      "Mazen GovTech Groupe est certifiée ISO 9001 et ISO 27001, garantissant qualité et sécurité pour nos clients gouvernementaux. Engagement envers l'excellence opérationnelle.",
  },
  {
    icon: "🔍",
    title: "Transparence totale",
    description:
      "Nos solutions offrent une transparence inestimable sur l'ensemble des transactions. Les gouvernements identifient les fuites de revenus et réduisent la dette.",
  },
  {
    icon: "📅",
    title: "Fondée en 1986",
    description:
      "Depuis 1986, Mazen a constitué un réseau de collaborateurs hautement qualifiés basés en Europe, en Asie et en Afrique, avec un département R&D florissant.",
  },
  {
    icon: "🛡️",
    title: "Souveraineté numérique",
    description:
      "Ce niveau de visibilité supplémentaire permet aux gouvernements d'affirmer leur pleine souveraineté numérique, améliorant leur solvabilité et leur attractivité.",
  },
];

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, type: "spring" }}
      className="text-4xl md:text-5xl font-extrabold text-white"
    >
      {target}
      {suffix}
    </motion.span>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-white/90 backdrop-blur-sm"}`}>
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
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#about" className="hover:text-blue-700 transition-colors">À propos</a>
            <a href="#etlc" className="hover:text-blue-700 transition-colors">Technologie</a>
            <a href="#cases" className="hover:text-blue-700 transition-colors">Cas d'usage</a>
            <a href="#sectors" className="hover:text-blue-700 transition-colors">Secteurs</a>
            <Link href="/news"><a className="hover:text-blue-700 transition-colors">Actualités</a></Link>
            <Link href="/contact"><a className="hover:text-blue-700 transition-colors">Contact</a></Link>
            <Link href="/login">
              <a className="bg-blue-700 hover:bg-blue-800 text-white text-sm py-2 px-5 rounded-lg font-semibold transition-colors">Connexion</a>
            </Link>
          </div>
          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>À propos</a>
            <a href="#etlc" onClick={() => setMobileMenuOpen(false)}>Technologie</a>
            <a href="#cases" onClick={() => setMobileMenuOpen(false)}>Cas d'usage</a>
            <a href="#sectors" onClick={() => setMobileMenuOpen(false)}>Secteurs</a>
            <Link href="/news"><a onClick={() => setMobileMenuOpen(false)}>Actualités</a></Link>
            <Link href="/contact"><a onClick={() => setMobileMenuOpen(false)}>Contact</a></Link>
            <Link href="/login"><a className="btn-primary w-fit py-2 px-4" onClick={() => setMobileMenuOpen(false)}>Connexion</a></Link>
          </div>
        )}
      </nav>

      {/* ===================== HERO ===================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Image de fond from presentaion */}
        <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-blue-800/50" />
        </div>
        {/* Éléments décoratifs depuis la présentation */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-5 pointer-events-none">
          <img src="/mazen-logo-icon.png" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold bg-amber-400/20 text-amber-300 rounded-full mb-6 border border-amber-400/40 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              ISO 9001 & ISO 27001 Certifiée
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              LE FOURNISSEUR DE{" "}
              <span className="text-amber-400">MOBILISATION<br />DES REVENUS</span>
            </h1>
            <p className="text-xl text-blue-100 font-light italic mb-6">
              Faites de la transparence votre moteur de croissance fiscale
            </p>
            <p className="text-blue-200 leading-relaxed mb-8">
              Depuis 1986, Mazen GovTech Groupe utilise ses solutions de gouvernance innovantes — basées sur des analyses avancées de données et l'ETL-Certification® — pour suivre avec une précision inégalée des milliards de transactions dans de multiples secteurs clés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <a className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-amber-400/40 hover:-translate-y-0.5">
                  Demander une démonstration
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </Link>
              <a href="#cases" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200">
                Voir nos cas d'usage
              </a>
            </div>
          </motion.div>

          {/* Carte stats flottante */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:grid grid-cols-2 gap-4"
          >
            {[
              { v: "$15Mrd", l: "Supervisés sur les réseaux", sub: "De 2009 à ce jour" },
              { v: "13Mrd", l: "Transactions / jour", sub: "Traitement temps réel" },
              { v: "+60%", l: "Hausse fiscale en RDC", sub: "Après 1 an" },
              { v: "1986", l: "Fondée en", sub: "35+ ans d'expertise" },
            ].map((s, i) => (
              <motion.div
                key={s.v}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors"
              >
                <div className="text-3xl font-extrabold text-amber-400 mb-1">{s.v}</div>
                <div className="text-white font-semibold text-sm">{s.l}</div>
                <div className="text-blue-300 text-xs mt-1">{s.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </motion.div>
      </section>

      {/* ===================== STATS BANNER ===================== */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {KEY_STATS.map((stat, i) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <AnimatedCounter target={stat.value} />
                <p className="text-white font-semibold text-sm">{stat.label}</p>
                <p className="text-blue-300 text-xs">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== À PROPOS ===================== */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block">À Propos de MAZEN</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                Leader mondial des technologies gouvernementales depuis <span className="text-blue-700">1986</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                MAZEN est une entreprise leader dans le domaine des technologies gouvernementales. Depuis 1986, nous avons constitué un réseau de collaborateurs hautement qualifiés basés en <strong>Europe, en Asie et en Afrique</strong>, avec un département R&D florissant.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Notre équipe est composée d'ingénieurs exceptionnels diplômés d'universités de renommée mondiale et possédant une solide expertise en traitement de données, fiscalité numérique et gouvernance.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🌍", label: "Présence mondiale", sub: "Europe, Asie, Afrique" },
                  { icon: "🔬", label: "R&D florissant", sub: "Innovation continue" },
                  { icon: "🎓", label: "Ingénieurs experts", sub: "Universités mondiales" },
                  { icon: "🏅", label: "ISO 9001 & 27001", sub: "Qualité & Sécurité" },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                      <div className="text-gray-500 text-xs">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                <img src="/digital-economy.png" alt="Économie numérique" className="w-full rounded-xl mb-6" />
                <div className="space-y-3">
                  {[
                    "Les données deviennent indéchiffrables en raison du cryptage et des variations entre opérateurs",
                    "De plus en plus de secteurs majeurs se numérisent, générant des quantités massives de Big Data",
                    "MAZEN transforme ce Big Data en recettes fiscales certifiées et auditables",
                  ].map((txt, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</div>
                      <p className="text-gray-700 text-sm leading-relaxed">{txt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-gray-400 font-medium mb-6 uppercase tracking-wider">Sélection de partenaires pour lesquels Mazen Partner est la solution officielle de Gouvernance</p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <img src="/partners.png" alt="Partenaires Mazen" className="max-h-20 mx-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-blue-700 font-bold text-lg mt-6">
              15 milliards de dollars supervisés sur les réseaux des opérateurs de 2009 à ce jour
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================== TECHNOLOGIE ETL-C ===================== */}
      <section id="etlc" className="py-24 bg-gradient-to-b from-gray-950 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src="/digital-economy.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Solutions N-Soft</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Technologie ETL-Certification®
            </h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Certifiez vos données avec la technologie propriétaire développée par Mazen GovTech Groupe — la seule solution certifiée pour la vérification fiscale des données numériques.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {ETL_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.letter}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative group"
              >
                <div className={`bg-gradient-to-b ${pillar.color} rounded-2xl p-6 h-full border border-white/10 hover:scale-105 transition-transform duration-300`}>
                  <div className="text-xs font-bold text-white/50 mb-2">{pillar.step}</div>
                  <div className="w-14 h-14 rounded-xl bg-white/20 text-white text-2xl font-black flex items-center justify-center mb-4 backdrop-blur-sm">
                    {pillar.letter}
                  </div>
                  {pillar.img && (
                    <img src={pillar.img} alt={pillar.title} className="w-16 h-16 object-contain mb-3 opacity-80" />
                  )}
                  <h3 className="text-lg font-extrabold text-white mb-3 tracking-wide">{pillar.title}</h3>
                  <p className="text-blue-100/80 text-sm leading-relaxed">{pillar.description}</p>
                </div>
                {i < ETL_PILLARS.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm"
          >
            <p className="text-blue-100 text-base leading-relaxed max-w-4xl mx-auto">
              En utilisant notre approche ETL-C propriétaire, les autorités fiscales peuvent <strong className="text-amber-400">extraire, transformer, charger et certifier</strong> automatiquement toutes les données transactionnelles pertinentes provenant de différents secteurs.
              Les gouvernements bénéficient d'une <strong className="text-white">visibilité totale sur 13 milliards de transactions quotidiennes</strong>, sans aucun travail manuel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================== CAS D'USAGE ===================== */}
      <section id="cases" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block">Références terrain</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Cas d'utilisation de la technologie de gouvernance Mazen GovTech Groupe
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Quatre déploiements réels démontrant l'impact mesurable de nos solutions sur les recettes publiques africaines.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {CASE_STUDIES.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border-2 ${c.color} overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                {c.img && (
                  <div className="h-48 overflow-hidden">
                    <img src={c.img} alt={c.country} className="w-full h-full object-cover object-top" />
                  </div>
                )}
                <div className={`${c.bgColor} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{c.flag}</span>
                        <span className="font-black text-gray-900 text-lg">{c.fullName}</span>
                      </div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{c.title}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-blue-700">{c.result}</div>
                      <div className="text-xs text-gray-500">{c.resultLabel}</div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 font-semibold mb-2">🤝 {c.partner}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.details}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map overview from presentation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg"
          >
            <img src="/case-studies-map.png" alt="Carte des déploiements Mazen" className="w-full object-contain max-h-96" />
          </motion.div>
        </div>
      </section>

      {/* ===================== SECTEURS ===================== */}
      <section id="sectors" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block">Couverture sectorielle</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Nos solutions apportent de la transparence à de nombreux secteurs
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Nous intervenons dans 9 grands domaines de l'économie numérique et traditionnelle pour maximiser les recettes publiques.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTORS_DATA.map((sector, i) => (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    {sector.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {sector.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{sector.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRANSFERT TECHNOLOGIQUE ===================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block">Notre engagement</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                Transfert de technologie et de compétences aux clients
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Nous assurons un <strong>transfert total de notre technologie</strong> aux clients tout en offrant une formation complète pour permettre à leurs équipes de réaliser des opérations autonomes.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "📚", title: "Formation complète", desc: "Programmes de formation adaptés aux équipes gouvernementales" },
                  { icon: "🔧", title: "Support continu", desc: "Accompagnement technique et maintenance dédiés" },
                  { icon: "🚀", title: "Autonomie totale", desc: "Vos équipes maîtrisent pleinement la plateforme" },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                      <div className="text-gray-600 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src="/tech-transfer.png" alt="Transfert technologique" className="w-full rounded-2xl shadow-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== POURQUOI NOUS ===================== */}
      <section id="why-us" className="py-24 bg-gradient-to-br from-blue-950 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Notre différence</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Pourquoi nous choisir</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Quatre piliers qui fondent notre excellence et la confiance de nos partenaires gouvernementaux.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {WHY_US_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 flex gap-5 hover:bg-white/15 transition-colors"
              >
                <span className="text-4xl flex-shrink-0">{pillar.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                  <p className="text-blue-200 leading-relaxed text-sm">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Certifications */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {[
              { cert: "ISO 9001", label: "Qualité", icon: "🏅" },
              { cert: "ISO 27001", label: "Sécurité de l'information", icon: "🔐" },
            ].map(c => (
              <div key={c.cert} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-8 py-4">
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <div className="font-black text-amber-400 text-lg">{c.cert}</div>
                  <div className="text-blue-200 text-xs">{c.label} — Certifié</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Prêt à transformer vos recettes publiques ?
            </h2>
            <p className="text-xl text-gray-500 mb-4">
              Notre équipe est à votre disposition pour vous accompagner dans votre transformation numérique.
            </p>
            <p className="text-2xl font-bold text-blue-700 mb-12">
              Augmentation des recettes publiques jusqu'à +552%
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@mazen-govtech.com" className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all">
                Envoyez-nous un courriel
              </a>
              <Link href="/contact">
                <a className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/30">
                  Planifiez une démonstration
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-start gap-4 mb-4">
                <img src="/mazen-logo.png" alt="Mazen GovTech Groupe" className="h-16 w-auto object-contain" />
              </div>
              <div className="font-extrabold text-white text-lg mb-1">Mazen GovTech Groupe</div>
              <div className="text-xs text-blue-400 font-medium mb-3">Sovereign Strategic Infrastructure Company</div>
              <p className="text-sm leading-relaxed mb-4">
                Fournisseur mondial de solutions de mobilisation des revenus publics. Certifié ISO 9001 & ISO 27001. Depuis 1986.
              </p>
              <p className="text-xs text-gray-500">
                15 milliards de dollars supervisés · 13 milliards de transactions/jour · 4 pays
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#etlc" className="hover:text-white transition-colors">Technologie ETL-C</a></li>
                <li><a href="#cases" className="hover:text-white transition-colors">Cas d'usage</a></li>
                <li><a href="#sectors" className="hover:text-white transition-colors">Secteurs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Plateforme</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/news"><a className="hover:text-white transition-colors">Actualités</a></Link></li>
                <li><Link href="/contact"><a className="hover:text-white transition-colors">Contact</a></Link></li>
                <li><Link href="/login"><a className="hover:text-white transition-colors">Connexion</a></Link></li>
                <li><a href="mailto:contact@mazen-govtech.com" className="hover:text-white transition-colors">contact@mazen-govtech.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 Mazen GovTech Groupe. Tous droits réservés.</p>
            <div className="flex gap-4 text-xs">
              <span className="bg-gray-800 px-3 py-1 rounded-full">ISO 9001</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">ISO 27001</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Fondée en 1986</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
