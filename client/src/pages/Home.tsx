import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { KEY_STATS, SECTORS_DATA } from "@shared/types";
import { Link } from "wouter";

const ETL_PILLARS = [
  {
    letter: "E",
    title: "Extraire",
    color: "bg-blue-600",
    description:
      "Utiliser des outils de veille stratégique pour extraire et stocker de manière transparente des informations pertinentes dans une base de données unique.",
  },
  {
    letter: "T",
    title: "Transformer",
    color: "bg-indigo-600",
    description:
      "Consolidation automatisée de toutes les données collectées, transmettant l'information dans un format confidentiel et compréhensible.",
  },
  {
    letter: "L",
    title: "Charger",
    color: "bg-violet-600",
    description:
      "Des rapports de données révolutionnés, en temps réel, avec une vue à 360° de toutes les activités au sein d'un secteur.",
  },
  {
    letter: "C",
    title: "Certifier",
    color: "bg-purple-700",
    description:
      "Certifier les données avec les algorithmes propriétaires Mazen GovTech pour garantir l'intégrité des informations fiscales.",
  },
];

const WHY_US_PILLARS = [
  {
    icon: "🏆",
    title: "Certifications internationales",
    description:
      "Mazen GovTech est fièrement certifiée ISO 9001 et ISO 27001, garantissant qualité et confiance pour nos clients gouvernementaux. Ces certifications témoignent de notre engagement envers l'excellence opérationnelle et la sécurité des informations.",
  },
  {
    icon: "🔍",
    title: "Transparence totale",
    description:
      "Nos solutions offrent une transparence inestimable sur l'ensemble des transactions, ce qui permet aux gouvernements d'identifier les fuites de revenus et de réduire la dette grâce à des revenus supplémentaires.",
  },
  {
    icon: "📅",
    title: "Dix ans d'expertise",
    description:
      "En dix ans de collaboration avec des États émergents et établis, Mazen GovTech a acquis une grande expertise dans la création de solutions technologiques innovantes et durables apportant un soutien essentiel aux budgets nationaux.",
  },
  {
    icon: "🛡️",
    title: "Souveraineté numérique",
    description:
      "Ce niveau de visibilité supplémentaire permet aux gouvernements d'affirmer leur pleine souveraineté numérique, ce qui améliore leur solvabilité et les rend beaucoup plus attrayants pour les investissements étrangers.",
  },
];

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring" }}
      className="text-5xl font-extrabold text-white"
    >
      {value}
      {suffix}
    </motion.span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-lg">M</div>
              <span className="text-xl font-bold text-gray-900">Mazen <span className="text-blue-700">GovTech</span></span>
            </a>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#sectors" className="hover:text-blue-700 transition-colors">Secteurs</a>
            <a href="#why-us" className="hover:text-blue-700 transition-colors">Pourquoi nous</a>
            <Link href="/news"><a className="hover:text-blue-700 transition-colors">Actualités</a></Link>
            <Link href="/contact"><a className="hover:text-blue-700 transition-colors">Contact</a></Link>
            <Link href="/login">
              <a className="btn-primary text-sm py-2 px-4">Connexion</a>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
        {/* Background decoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-semibold bg-amber-400/20 text-amber-300 rounded-full mb-6 border border-amber-400/30">
              ISO 9001 & ISO 27001 Certifiée
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Fournisseur de services de{" "}
              <span className="text-amber-400">mobilisation des revenus</span>{" "}
              issues de l'économie numérique
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-4">
              Mazen GovTech utilise ses solutions de gouvernance innovantes, basées sur des analyses avancées de données et l'intelligence artificielle, pour suivre avec une précision inégalée des milliards de transactions dans de multiples secteurs clés.
            </p>
            <p className="text-2xl font-bold text-amber-400 mb-10">
              Augmentation des recettes publiques jusqu'à 552%
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <a className="btn-gold text-base px-8 py-4">Demander une démo</a>
              </Link>
              <a href="#etlc" className="btn-secondary border-white text-white hover:bg-white/10 text-base px-8 py-4">
                En savoir plus
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-blue-700 py-16">
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
                <AnimatedCounter value={stat.value} />
                <p className="text-blue-200 font-semibold text-sm">{stat.label}</p>
                <p className="text-blue-300 text-xs">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROCHE ETL-C */}
      <section id="etlc" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title">L'approche ETL-C : Quatre piliers technologiques</h2>
            <p className="section-subtitle mx-auto text-center">
              Notre méthodologie propriétaire repose sur quatre étapes clés qui garantissent une collecte et une certification des données irréprochables.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {ETL_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.letter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card text-center hover:scale-105 transition-transform duration-200"
              >
                <div className={`w-14 h-14 rounded-xl ${pillar.color} text-white text-2xl font-black flex items-center justify-center mx-auto mb-4`}>
                  {pillar.letter}
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">{pillar.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-blue-800 text-sm leading-relaxed max-w-4xl mx-auto">
              En utilisant notre approche ETL-C propriétaire, les autorités fiscales peuvent extraire, transformer, charger et certifier automatiquement toutes les données transactionnelles pertinentes provenant de différents secteurs. Les gouvernements bénéficient ainsi d'une visibilité totale sur toutes les transactions, sans qu'aucun travail manuel ne soit nécessaire.
            </p>
          </div>
        </div>
      </section>

      {/* SECTEURS */}
      <section id="sectors" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title">Nos solutions apportent de la transparence à de nombreux secteurs</h2>
            <p className="section-subtitle mx-auto text-center">
              Nous intervenons dans 9 grands domaines de l'économie numérique et traditionnelle pour maximiser les recettes publiques.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTORS_DATA.map((sector, i) => (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card group cursor-default"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{sector.icon}</span>
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

      {/* MISSION */}
      <section className="py-24 bg-gradient-to-br from-blue-950 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Comment la technologie de gouvernance peut améliorer la mobilisation des revenus</h2>
              <p className="text-blue-200 leading-relaxed mb-6">
                Découvrez comment GovTech et en particulier Mazen GovTech aident les gouvernements à augmenter leurs recettes publiques jusqu'à 552%, à travers des cas concrets et des analyses intersectorielles.
              </p>
              <p className="text-blue-200 leading-relaxed">
                Nous aidons les gouvernements à exploiter des recettes inexploitées et à mettre en place des environnements commerciaux transparents. Notre technologie révolutionnaire permet d'obtenir une image claire des activités commerciales dans un large éventail de secteurs.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "552%", label: "Hausse max des recettes" },
                { value: "360°", label: "Vue sectorielle" },
                { value: "100%", label: "Visibilité transactions" },
                { value: "10+", label: "Années d'expertise" },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl p-6 text-center border border-white/20">
                  <div className="text-3xl font-extrabold text-amber-400 mb-2">{s.value}</div>
                  <div className="text-blue-200 text-sm">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section id="why-us" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title">Pourquoi nous choisir</h2>
            <p className="section-subtitle mx-auto text-center">
              Quatre piliers qui fondent notre excellence et la confiance de nos partenaires gouvernementaux.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {WHY_US_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card flex gap-5 hover:border-blue-200"
              >
                <span className="text-4xl flex-shrink-0">{pillar.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{pillar.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Badges de certification */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {["ISO 9001 : Qualité", "ISO 27001 : Sécurité"].map(cert => (
              <div key={cert} className="flex items-center gap-3 bg-white border-2 border-blue-200 rounded-xl px-8 py-4 shadow-sm">
                <span className="text-2xl">🏅</span>
                <div>
                  <div className="font-bold text-blue-800">{cert}</div>
                  <div className="text-xs text-gray-500">Certifié</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Prêt à transformer vos recettes publiques ?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Notre équipe est à votre disposition pour vous accompagner dans votre transformation numérique et l'optimisation de vos recettes publiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@mazen-govtech.com" className="btn-primary text-base px-8 py-4">
                Envoyez-nous un courriel
              </a>
              <Link href="/contact">
                <a className="btn-gold text-base px-8 py-4">Planifiez une démonstration</a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black">M</div>
            <span className="text-white font-semibold">Mazen GovTech</span>
          </div>
          <p className="text-sm">© 2026 Mazen GovTech. Tous droits réservés. ISO 9001 & ISO 27001 Certifiée.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/news"><a className="hover:text-white transition-colors">Actualités</a></Link>
            <Link href="/contact"><a className="hover:text-white transition-colors">Contact</a></Link>
            <Link href="/login"><a className="hover:text-white transition-colors">Connexion</a></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
