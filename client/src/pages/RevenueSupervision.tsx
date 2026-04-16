import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import {
  BarChart2,
  Database,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Landmark,
  FileText,
  Search,
  Zap,
  Lock,
  Globe,
  Cpu,
  RefreshCw,
  Users,
  DollarSign,
  PieChart,
  Activity,
  Link2,
  Eye,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" },
  }),
};

/* ─── DONNÉES ─────────────────────────────────────────────────── */

const CHALLENGES = [
  "Évasion fiscale et fraude organisée transfrontalière",
  "Économie informelle non capturée dans les assiettes fiscales",
  "Sous-déclaration systématique des revenus et des flux customs",
  "Fragmentation des bases de données fiscales entre administrations",
  "Absence de visibilité en temps réel sur les flux de recettes",
  "Faible taux de conformité volontaire des contribuables",
];

const IMPERATIVES = [
  { text: "Augmentation durable du", bold: "taux de pression fiscale" },
  { text: "Lutte contre la", bold: "fraude et l'évasion fiscale" },
  { text: "Supervision en temps réel des", bold: "recettes publiques" },
  { text: "Modernisation de la", bold: "collecte et du contrôle fiscal" },
  { text: "Intégration des données", bold: "douanes, impôts, trésor" },
  { text: "Renforcement de la", bold: "souveraineté financière de l'État" },
];

const PILLARS = [
  {
    id: 1,
    icon: Database,
    title: "Infrastructure de Collecte",
    subtitle: "Numérique & Intégrée",
    color: "from-emerald-900 to-emerald-700",
    border: "border-emerald-500/30",
    features: [
      {
        label: "Déclaration électronique unifiée",
        value:
          "Portail contribuable centralisé pour les déclarations IS, TVA, IRPP, patente et droits de douane avec pré-remplissage automatique depuis les sources tierces.",
      },
      {
        label: "Paiement numérique souverain",
        value:
          "Intégration multi-canal : virement bancaire, mobile money, paiement carte, mandats électroniques — avec réconciliation automatique et tracabilité complète.",
      },
      {
        label: "Identification contribuable unique",
        value:
          "Identifiant fiscal unique (IFU) lié aux registres de commerce, d'état civil et des opérateurs économiques pour éliminer les doublons et les fantômes.",
      },
      {
        label: "Onboarding fiscal automatisé",
        value:
          "Enregistrement et immatriculation des nouveaux contribuables en ligne avec vérification d'identité et activation immédiate du compte fiscal.",
      },
    ],
  },
  {
    id: 2,
    icon: Activity,
    title: "Supervision & Analytique",
    subtitle: "Tableau de bord temps réel",
    color: "from-blue-900 to-blue-700",
    border: "border-blue-500/30",
    features: [
      {
        label: "Tableau de bord exécutif",
        value:
          "Vue consolidée en temps réel des recettes collectées, des écarts versus objectifs, des retards de paiement et des tendances par secteur, région et type d'impôt.",
      },
      {
        label: "Suivi des flux inter-administrations",
        value:
          "Agrégation automatique des flux Impôts–Douanes–Trésor avec rapprochement comptable et traçabilité complète depuis le fait générateur jusqu'au compte d'État.",
      },
      {
        label: "Scorecards de conformité",
        value:
          "Indice de compliance par contribuable, secteur et région mis à jour en continu — permettant la priorisation intelligente des actions de contrôle et d'audit.",
      },
      {
        label: "Prévisions et simulation budgétaire",
        value:
          "Moteurs prédictifs pour l'anticipation des recettes mensuelles, la simulation d'impact de mesures fiscales et la détection précoce des dérives par rapport aux objectifs.",
      },
    ],
  },
  {
    id: 3,
    icon: Search,
    title: "Détection de Fraude",
    subtitle: "Intelligence & Audit",
    color: "from-red-900 to-red-700",
    border: "border-red-500/30",
    features: [
      {
        label: "Moteur de détection des anomalies",
        value:
          "Algorithmes d'analyse comportementale et de scoring de risque sur l'ensemble des déclarations — ciblant les schémas de fraude TVA carousel, la facturation fictive et le blanchiment.",
      },
      {
        label: "Croisement multi-sources",
        value:
          "Recoupement automatique entre les déclarations fiscales, les relevés bancaires, les manifestes douaniers, les bilans comptables et les données de registre de commerce.",
      },
      {
        label: "Gestion intelligente du contrôle fiscal",
        value:
          "Sélection algorithmique des dossiers à contrôler, planification des missions de vérification, suivi des procédures et calcul automatique des redressements et pénalités.",
      },
      {
        label: "Traçabilité et piste d'audit",
        value:
          "Journal d'audit inaltérable de toutes les opérations fiscales, modifications de données et actions des agents avec horodatage cryptographique garantissant l'intégrité.",
      },
    ],
  },
];

const INTEGRATIONS = [
  { icon: Landmark, label: "Système bancaire national", desc: "Réconciliation temps réel des flux de paiement" },
  { icon: Globe, label: "Douanes & Commerce", desc: "Croisement manifestes, valeurs déclarées, droits perçus" },
  { icon: FileText, label: "Registre du Commerce", desc: "Vérification existence légale des entreprises contribuables" },
  { icon: Users, label: "État civil & Biométrie", desc: "Vérification d'identité des contribuables personnes physiques" },
];

const SECURITY = [
  { icon: Lock, label: "Chiffrement souverain", desc: "PKI nationale, chiffrement bout-en-bout des données fiscales" },
  { icon: ShieldCheck, label: "Cloisonnement des rôles", desc: "RBAC granulaire — agents, superviseurs, auditeurs internes" },
  { icon: Eye, label: "Supervision des accès", desc: "SIEM dédié, détection des comportements internes malveillants" },
  { icon: RefreshCw, label: "Continuité & résilience", desc: "Architecture redondante, RPO < 1h, RTO < 4h" },
];

const CAPABILITIES = [
  { icon: DollarSign, label: "Mobilisation des recettes fiscales", desc: "Maximisation de l'assiette fiscale effective par l'identification de tous les contribuables actifs et la collecte automatisée multi-canal." },
  { icon: Search, label: "Contrôle et audit intelligent", desc: "Ciblage algorithmique des dossiers à risque pour concentrer les ressources de vérification là où le potentiel de redressement est maximal." },
  { icon: BarChart2, label: "Reporting budgétaire en temps réel", desc: "Tableau de bord exécutif avec consolidation instantanée des recettes par nature, direction, région et période pour le pilotage stratégique." },
  { icon: Link2, label: "Interopérabilité inter-administrations", desc: "Échanges automatisés sécurisés entre DGI, DGD, Trésor Public et Banque Centrale via API souveraines chiffrées." },
  { icon: TrendingUp, label: "Prévision et simulation fiscale", desc: "Modèles prédictifs pour anticiper les recettes, simuler l'impact de réformes fiscales et détecter les dérives en temps utile." },
  { icon: Cpu, label: "Intelligence artificielle anti-fraude", desc: "Modèles de machine learning entraînés sur les historiques fiscaux nationaux pour automatiser la détection des schémas frauduleux complexes." },
];

const COMPARISON = [
  { criteria: "Visibility en temps réel", before: "Reporting mensuel décalé", after: "Dashboard live toutes recettes", good: true },
  { criteria: "Détection de la fraude", before: "Contrôles aléatoires manuels", after: "Scoring risque automatique 100% des dossiers", good: true },
  { criteria: "Taux de couverture fiscal", before: "Partiel — économie informelle exclue", after: "Élargi — identification systématique", good: true },
  { criteria: "Interopérabilité DGI/DGD/Trésor", before: "Échanges manuels, délais > 30 jours", after: "API temps réel, réconciliation auto", good: true },
  { criteria: "Expérience contribuable", before: "Démarches physiques, files d'attente", after: "Portail numérique 24h/24", good: true },
  { criteria: "Pilotage budgétaire", before: "Données T-1, lacunaires", after: "Prévisions dynamiques temps réel", good: true },
];

const EVOLUTIONS = [
  { icon: Cpu, label: "IA de Détection Avancée", desc: "Modèles deep learning pour identifier les montages fiscaux complexes, les prix de transfert abusifs et les schémas d'optimisation agressive transfrontalière." },
  { icon: Globe, label: "Échange International de Données", desc: "Conformité OCDE BEPS, Norme Commune de Déclaration (NCD/CRS) et échanges automatiques de renseignements fiscaux avec les administrations partenaires." },
  { icon: Link2, label: "Registre des Bénéficiaires Effectifs", desc: "Identification automatique des bénéficiaires économiques réels des structures juridiques pour lutter contre l'optimisation et le blanchiment." },
  { icon: BarChart2, label: "Jumeaux Numériques Fiscaux", desc: "Simulation macroéconomique des impacts de réformes fiscales avant promulgation — modélisation de l'élasticité des recettes à la politique fiscale." },
];

const GOV_APPS = [
  { icon: Landmark, label: "Direction Générale des Impôts", desc: "Gestion complète du cycle fiscal : immatriculation, déclaration, paiement, contrôle et contentieux — avec pilotage des objectifs de recettes par bureau." },
  { icon: Globe, label: "Direction Générale des Douanes", desc: "Surveillance des valeurs en douane, détection des sous-facturations, suivi des régimes suspensifs et optimisation de la collecte des droits à l'importation." },
  { icon: DollarSign, label: "Ministère des Finances", desc: "Tableau de bord consolidé des recettes publiques, publication des statistiques fiscales officielles, reporting FMI/Banque Mondiale et pilotage stratégique." },
  { icon: TrendingUp, label: "Trésor Public", desc: "Suivi des flux de trésorerie de l'État en temps réel, gestion de la dette fiscale, recouvrement forcé et réconciliation des comptes avec le système bancaire." },
  { icon: ShieldCheck, label: "Inspection Générale des Finances", desc: "Outils d'audit interne et de contrôle de l'action des agents fiscaux — détection des comportements déviants et traçabilité complète pour la lutte anti-corruption." },
];

/* ─── COMPOSANTS INTERNES ─────────────────────────────────────── */

function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] text-emerald-400 mb-3">{tag}</span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">{title}</h2>
      {subtitle && <p className="text-emerald-100/75 max-w-2xl mx-auto text-base leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────── */

export default function RevenueSupervision() {
  const [activePillar, setActivePillar] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <PublicNavbar ctaLabel="Demander une présentation" ctaHref="/contact" />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-emerald-950/70 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-1/4 w-[600px] h-[600px] rounded-full bg-emerald-600/8 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/6 blur-3xl" />
          <div className="absolute top-1/2 right-0 w-[300px] h-[300px] rounded-full bg-green-600/6 blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #10b981 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-400 mb-5">
              <span className="w-8 h-px bg-emerald-400" />
              Revenue Intelligence Platform · RIP
            </span>
            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-6">
              Souveraineté{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Fiscale
              </span>
            </h1>
            <p className="text-lg text-emerald-100/80 mb-8 leading-relaxed max-w-xl">
              Plateforme intégrée de supervision et de mobilisation des recettes publiques — collecte numérique, tableau de bord exécutif en temps réel et détection intelligente de la fraude fiscale.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <a className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                  Demander une présentation <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
              <a
                href="#contexte"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all"
              >
                Découvrir le système
              </a>
            </div>
          </motion.div>

          {/* Métriques hero */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "+35 %", label: "Hausse moyenne du taux de recouvrement", icon: TrendingUp },
              { value: "100 %", label: "Couverture dossiers par scoring risque", icon: Search },
              { value: "Temps réel", label: "Supervision des recettes publiques", icon: Activity },
              { value: "3 piliers", label: "Collecte · Supervision · Audit", icon: ShieldCheck },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-2"
              >
                <m.icon className="w-6 h-6 text-emerald-400" />
                <p className="text-2xl font-black text-white">{m.value}</p>
                <p className="text-xs text-emerald-300/80 font-medium">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-emerald-400/60 text-xs animate-bounce">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ══ 1. CONTEXTE STRATÉGIQUE ═══════════════════════════════ */}
      <section id="contexte" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="01 — Contexte stratégique"
              title="Un impératif de souveraineté financière"
              subtitle="Pour de nombreux États, l'augmentation des recettes fiscales intérieures représente le levier le plus puissant pour financer le développement sans dépendance extérieure. Or les administrations fiscales font face à des défis structurels qui limitent leur capacité de mobilisation."
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="rounded-2xl border border-red-500/20 bg-red-950/20 p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </span>
                <h3 className="font-bold text-white text-lg">Défis structurels</h3>
              </div>
              <ul className="space-y-3">
                {CHALLENGES.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-red-200/80 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </span>
                <h3 className="font-bold text-white text-lg">Impératifs stratégiques</h3>
              </div>
              <ul className="space-y-3">
                {IMPERATIVES.map((n) => (
                  <li key={n.bold} className="flex items-start gap-3 text-emerald-200/80 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    {n.text} <strong className="text-white ml-1">{n.bold}</strong>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="mt-10 text-center text-emerald-200/70 max-w-3xl mx-auto text-sm leading-relaxed border border-white/10 rounded-2xl bg-white/5 p-6"
          >
            La réponse est une <strong className="text-white">plateforme souveraine intégrée</strong> couvrant l'intégralité du cycle fiscal — de l'identification du contribuable au recouvrement effectif — avec une intelligence analytique en temps réel :{" "}
            <strong className="text-emerald-400">la Revenue Intelligence Platform</strong>.
          </motion.p>
        </div>
      </section>

      {/* ══ 2. CONCEPT — 3 PILIERS ════════════════════════════════ */}
      <section id="concept" className="py-24 bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="02 — Concept opérationnel"
              title="Architecture en 3 piliers souverains"
              subtitle="La Revenue Intelligence Platform repose sur trois piliers complémentaires qui couvrent l'intégralité du cycle fiscal — de la collecte initiale au contrôle final — avec une vision consolidée en temps réel pour les décideurs."
            />
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            {PILLARS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePillar(i)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border font-semibold text-sm transition-all ${
                  activePillar === i
                    ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                    : "border-white/10 bg-white/5 text-emerald-300 hover:bg-white/10"
                }`}
              >
                <p.icon className="w-4 h-4" />
                <span>Pilier {p.id} — {p.title}</span>
              </button>
            ))}
          </div>

          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 10 }}
              animate={activePillar === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className={activePillar === i ? "block" : "hidden"}
            >
              <div className={`rounded-3xl border ${pillar.border} bg-gradient-to-br ${pillar.color} p-8`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <pillar.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                    <p className="text-white/60 text-sm">{pillar.subtitle}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {pillar.features.map((f) => (
                    <div key={f.label} className="rounded-xl bg-black/20 p-4 border border-white/10">
                      <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">{f.label}</p>
                      <p className="text-sm text-white/90 leading-relaxed">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ 3. ARCHITECTURE — INTÉGRATIONS + SÉCURITÉ ════════════ */}
      <section id="architecture" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="03 — Architecture technique"
              title="Interopérable, sécurisée, souveraine"
              subtitle="La plateforme a été conçue pour s'intégrer aux systèmes existants des administrations nationales tout en garantissant la protection maximale des données fiscales des contribuables et la confidentialité des informations stratégiques de l'État."
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Intégrations systèmes</h3>
              <div className="space-y-3">
                {INTEGRATIONS.map((s) => (
                  <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{s.label}</p>
                      <p className="text-emerald-300/70 text-xs">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Sécurité &amp; Gouvernance des données</h3>
              <div className="space-y-3">
                {SECURITY.map((s) => (
                  <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{s.label}</p>
                      <p className="text-emerald-300/70 text-xs">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6 flex gap-4 items-start"
          >
            <Lock className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-1">Hébergement souverain</p>
              <p className="text-emerald-200/70 text-sm leading-relaxed">
                L'ensemble des données fiscales est hébergé sur infrastructure gouvernementale nationale ou dans un cloud souverain homologué. Aucune donnée contribuable ne transite par des serveurs étrangers. L'architecture est conçue pour opérer en mode air-gap en cas de coupure de connectivité internationale, garantissant la <strong className="text-white">continuité du service fiscal même en situation de crise</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ 4. CAPACITÉS OPÉRATIONNELLES ══════════════════════════ */}
      <section id="capacites" className="py-24 bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="04 — Capacités opérationnelles"
              title="6 capacités clés pour l'État"
              subtitle="La Revenue Intelligence Platform délivre un ensemble intégré de capacités couvrant toutes les dimensions de la mobilisation fiscale — de la collecte initiale au contrôle fiscal en passant par le reporting stratégique."
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/8 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-4 group-hover:bg-emerald-500/25 transition-colors">
                  <c.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{c.label}</h3>
                <p className="text-emerald-200/60 text-xs leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. TABLEAU COMPARATIF ═════════════════════════════════ */}
      <section id="avantages" className="py-24 bg-gray-950">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="05 — Avantages stratégiques"
              title="Avant vs Après déploiement RIP"
              subtitle="La transformation digitale de l'administration fiscale génère des gains mesurables sur l'ensemble des indicateurs de performance — recettes, conformité, efficience et gouvernance."
            />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="grid grid-cols-3 bg-gray-800/80 text-xs font-bold uppercase tracking-wider">
              <div className="px-6 py-4 text-emerald-300">Critère</div>
              <div className="px-6 py-4 text-red-300 border-l border-white/10">Avant (Administration traditionnelle)</div>
              <div className="px-6 py-4 text-emerald-300 border-l border-white/10">Après (Avec RIP)</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.criteria}
                className={`grid grid-cols-3 border-t border-white/10 ${i % 2 === 0 ? "bg-white/3" : "bg-transparent"}`}
              >
                <div className="px-6 py-4 text-sm font-semibold text-white">{row.criteria}</div>
                <div className="px-6 py-4 text-sm text-red-300/80 border-l border-white/10">{row.before}</div>
                <div className="px-6 py-4 text-sm text-emerald-300 border-l border-white/10 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  {row.after}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 6. ÉVOLUTIVITÉ ════════════════════════════════════════ */}
      <section id="evolution" className="py-24 bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="06 — Évolutivité"
              title="La plateforme grandit avec vos ambitions"
              subtitle="L'architecture modulaire de la Revenue Intelligence Platform permet d'intégrer progressivement de nouvelles fonctionnalités avancées en fonction des priorités et du niveau de maturité digitale de chaque administration."
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {EVOLUTIONS.map((e, i) => (
              <motion.div
                key={e.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/40 to-gray-900/60 p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
                  <e.icon className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{e.label}</h3>
                <p className="text-emerald-200/60 text-sm leading-relaxed">{e.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. APPLICATIONS GOUVERNEMENTALES ══════════════════════ */}
      <section id="applications" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="07 — Applications gouvernementales"
              title="Une solution pour chaque institution"
              subtitle="La Revenue Intelligence Platform s'adapte aux besoins spécifiques de chaque administration impliquée dans la mobilisation, la gestion et le contrôle des recettes publiques."
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GOV_APPS.map((app, i) => (
              <motion.div
                key={app.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <app.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{app.label}</h3>
                <p className="text-emerald-200/60 text-xs leading-relaxed">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 8. CONCLUSION + CTA ═══════════════════════════════════ */}
      <section
        id="poc"
        className="py-24 bg-gradient-to-br from-emerald-950 via-teal-950 to-gray-950 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-teal-600/8 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] text-emerald-400 mb-4">
              Conclusion &amp; Proposition
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
              Un premier déploiement{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                opérationnel en 90 jours
              </span>
            </h2>
            <p className="text-emerald-100/80 text-base leading-relaxed mb-4 max-w-3xl mx-auto">
              La Revenue Intelligence Platform peut être déployée de manière progressive, en démarrant par un pilote opérationnel couvrant un périmètre ciblé — un type d'impôt, une direction régionale ou un secteur économique prioritaire — afin de démontrer les gains concrets avant l'extension nationale.
            </p>
            <p className="text-emerald-200/60 text-sm mb-10 max-w-2xl mx-auto">
              Cette approche pragmatique permet de sécuriser l'implémentation, de mesurer le ROI fiscal dès les premières semaines et de former les équipes en conditions réelles avant le déploiement à l'échelle nationale.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { icon: Database, label: "Collecte numérique" },
                { icon: Activity, label: "Supervision temps réel" },
                { icon: Search, label: "Détection de fraude" },
                { icon: PieChart, label: "Reporting exécutif" },
                { icon: Cpu, label: "IA fiscale" },
              ].map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full"
                >
                  <t.icon className="w-3.5 h-3.5 text-emerald-400" />
                  {t.label}
                </span>
              ))}
            </div>

            <Link href="/contact">
              <a className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-emerald-500/20">
                Planifier un pilote avec nos experts
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
