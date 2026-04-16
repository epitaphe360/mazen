import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import {
  Radar,
  Radio,
  Monitor,
  Shield,
  Zap,
  Globe,
  Eye,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Satellite,
  Waves,
  Camera,
  Cpu,
  Lock,
  TrendingUp,
  Navigation,
  Anchor,
  Wind,
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

const THREATS = [
  "Pêche illégale non déclarée",
  "Trafics maritimes illicites",
  "Menaces sur infrastructures offshore",
  "Violations de frontières maritimes",
];

const NEEDS = [
  { text: "Renforcement de la", bold: "souveraineté maritime" },
  { text: "Surveillance des", bold: "Zones Économiques Exclusives" },
  { text: "Lutte contre la", bold: "pêche illégale" },
  { text: "Sécurité des", bold: "infrastructures offshore" },
  { text: "Détection des", bold: "trafics maritimes" },
];

const LAYERS = [
  {
    id: 1,
    icon: Radar,
    title: "Radars Maritimes",
    subtitle: "Longue Portée",
    color: "from-blue-900 to-blue-700",
    border: "border-blue-500/30",
    features: [
      { label: "Portée opérationnelle", value: "60 à 96 km de couverture radiale par unité radar déployée sur le littoral" },
      { label: "Détection des navires", value: "Identification automatique des contacts maritimes, y compris les cibles à faible signature radar" },
      { label: "Suivi de trajectoire", value: "Calcul continu des vecteurs vitesse et cap pour chaque cible suivie en temps réel" },
      { label: "Classification cible", value: "Algorithmes embarqués de discrimination et de classification automatique des contacts" },
    ],
  },
  {
    id: 2,
    icon: Waves,
    title: "Bouées Intelligentes",
    subtitle: "AIS + Caméra PTZ",
    color: "from-emerald-900 to-emerald-700",
    border: "border-emerald-500/30",
    features: [
      { label: "Équipements embarqués", value: "Caméra maritime HD PTZ · Récepteur AIS professionnel · GPS haute précision · Transmission chiffrée · Alimentation solaire autonome" },
      { label: "Identification visuelle", value: "Reconnaissance visuelle HD des navires en approche avec caméras PTZ maritimes embarquées" },
      { label: "Surveillance permanente", value: "Opération 24h/24, 7j/7 en totale autonomie énergétique par panneaux solaires" },
      { label: "Zone de couverture", value: "Plusieurs dizaines de kilomètres carrés par bouée, garantissant un maillage serré de la zone d'intérêt" },
    ],
  },
  {
    id: 3,
    icon: Monitor,
    title: "Centre de Commandement",
    subtitle: "Maritime C2",
    color: "from-purple-900 to-purple-700",
    border: "border-purple-500/30",
    features: [
      { label: "Fusion des données", value: "Corrélation automatique en temps réel de toutes les sources : radar, AIS, vidéo, GPS en un tableau de bord unique" },
      { label: "Cartographie maritime", value: "Représentation géospatiale dynamique de toutes les cibles suivies avec historique de trajectoire et classification automatique" },
      { label: "Vidéo temps réel", value: "Affichage simultané des flux caméra de l'ensemble des bouées intelligentes avec zoom et contrôle PTZ à distance" },
      { label: "Alertes automatiques", value: "Génération d'alertes paramétrables sur comportements suspects, intrusions de zone ou anomalies de navigation détectées" },
    ],
  },
];

const TECH_SENSORS = [
  { icon: Radar, label: "Radar Bande X / S", desc: "Détection tous temps longue portée" },
  { icon: Camera, label: "Caméra PTZ Maritime", desc: "Identification visuelle haute définition" },
  { icon: Radio, label: "Récepteur AIS", desc: "Identification automatique des navires" },
  { icon: Navigation, label: "GPS Haute Précision", desc: "Géolocalisation et synchronisation" },
];

const TECH_LINKS = [
  { icon: Radio, label: "Radio Longue Portée", desc: "Couverture maritime sans infrastructure" },
  { icon: Zap, label: "LTE Maritime", desc: "Haut débit vidéo dans les zones couvertes" },
  { icon: Satellite, label: "Liaison Satellite", desc: "Connectivité universelle hors zone LTE" },
  { icon: Lock, label: "Réseau Gouvernemental", desc: "Infrastructure chiffrée et sécurisée" },
];

const CAPABILITIES = [
  { icon: Eye, label: "Détection Navires Non Déclarés", desc: "Identification des contacts sans transpondeur AIS actif grâce à la fusion radar-vidéo" },
  { icon: Globe, label: "Surveillance des Frontières Maritimes", desc: "Contrôle continu des lignes de base et des limites de la ZEE nationale" },
  { icon: Anchor, label: "Lutte contre la Pêche Illégale", desc: "Détection et suivi des navires de pêche en infraction dans les zones protégées" },
  { icon: Shield, label: "Protection Infrastructures Offshore", desc: "Surveillance des périmètres de sécurité autour des plateformes et câbles sous-marins" },
  { icon: TrendingUp, label: "Suivi Trafic Maritime", desc: "Analyse des flux de navigation et détection des comportements anormaux en temps réel" },
  { icon: Lock, label: "Sécurité Portuaire", desc: "Surveillance des approches portuaires et contrôle des accès aux zones sensibles" },
];

const COMPARISON = [
  { criteria: "Identification visuelle", radar: "Non disponible", msg: "Caméra HD PTZ", msgGood: true },
  { criteria: "Couverture zones mortes", radar: "Faible, lacunes résiduelles", msg: "Élevée, maillage distribué", msgGood: true },
  { criteria: "Surveillance permanente", radar: "Moyenne, dépendante météo", msg: "Élevée, redondance capteurs", msgGood: true },
  { criteria: "Identification AIS", radar: "Absente ou limitée", msg: "Intégrée et temps réel", msgGood: true },
  { criteria: "Coût d'infrastructure", radar: "Élevé, stations fixes", msg: "Optimisé, architecture distribuée", msgGood: true },
  { criteria: "Évolutivité", radar: "Limitée, architecture rigide", msg: "Modulaire, extensions", msgGood: true },
];

const EVOLUTIONS = [
  { icon: Wind, label: "Drones Maritimes Autonomes", desc: "Patrouille autonome, levée de doute rapide sur contacts d'intérêt identifiés par le radar ou les bouées" },
  { icon: Wind, label: "Drones Aériens", desc: "Déploiement de drones aériens télécommandés ou autonomes pour la levée de doute visuelle rapide" },
  { icon: Satellite, label: "Satellites AIS & Over-the-Horizon", desc: "Extension de la couverture au-delà de la ligne d'horizon grâce aux données AIS satellitaires et radars OTH" },
  { icon: Cpu, label: "Intelligence Artificielle de Détection", desc: "Algorithmes de machine learning pour la détection automatique des menaces, classification et optimisation dynamique" },
];

const GOV_APPS = [
  { icon: Shield, label: "Ministère de la Défense", desc: "Renseignement maritime stratégique, surveillance des approches, appui aux opérations navales et gestion des crises maritimes." },
  { icon: Anchor, label: "Marine Nationale", desc: "Image opérationnelle maritime en temps réel, désignation d'objectifs, appui aux patrouilles et coordination des interceptions en mer." },
  { icon: Globe, label: "Garde-Côtes", desc: "Surveillance des frontières maritimes, sauvetage en mer, lutte contre la pêche illégale et contrôle des flux d'immigration maritime." },
  { icon: Zap, label: "Protection Offshore", desc: "Sécurisation des périmètres autour des plateformes pétrolières, parcs éoliens offshore et câbles de communication sous-marins." },
  { icon: Lock, label: "Sécurité Portuaire", desc: "Surveillance des approches portuaires, contrôle des accès, détection des menaces sous-marines et gestion du trafic des navires." },
];

/* ─── COMPOSANTS INTERNES ─────────────────────────────────────── */

function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] text-blue-400 mb-3">{tag}</span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">{title}</h2>
      {subtitle && <p className="text-blue-200/80 max-w-2xl mx-auto text-base leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────── */

export default function MaritimeSurveillance() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <PublicNavbar ctaLabel="Demander une présentation" ctaHref="/contact" />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Fond animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/80 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/6 blur-3xl" />
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-indigo-600/6 blur-3xl" />
        </div>
        {/* Grille décorative */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(to right, #3b82f6 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-400 mb-5">
              <span className="w-8 h-px bg-cyan-400" />
              Maritime Surveillance Grid · MSG
            </span>
            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-6">
              Souveraineté{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Maritime
              </span>
            </h1>
            <p className="text-lg text-blue-100/80 mb-8 leading-relaxed max-w-xl">
              Architecture multi-capteurs distribuée combinant radars longue portée, bouées intelligentes et centre de commandement intégré pour une couverture maritime permanente et sans angles morts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <a className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                  Demander une présentation <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
              <a
                href="#concept"
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
              { value: "96 km", label: "Portée radar côtier", icon: Radar },
              { value: "24h/24", label: "Surveillance continue", icon: Eye },
              { value: "3 couches", label: "Architecture hybride", icon: Shield },
              { value: "99,5%", label: "Disponibilité système", icon: CheckCircle },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-2"
              >
                <m.icon className="w-6 h-6 text-cyan-400" />
                <p className="text-3xl font-black text-white">{m.value}</p>
                <p className="text-xs text-blue-300/80 font-medium">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-blue-400/60 text-xs animate-bounce">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ══ 1. CONTEXTE STRATÉGIQUE ═══════════════════════════════ */}
      <section id="contexte" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="01 — Contexte stratégique"
              title="Un enjeu de souveraineté nationale"
              subtitle="Les États côtiers font face à des menaces maritimes croissantes qui exigent des réponses technologiques robustes et intégrées. Les solutions radar seules présentent des lacunes structurelles importantes : zones d'ombre géographiques, absence d'identification visuelle des cibles, et manque de capteurs distribués capables de couvrir de vastes étendues maritimes."
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Menaces */}
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
                <h3 className="font-bold text-white text-lg">Menaces identifiées</h3>
              </div>
              <ul className="space-y-3">
                {THREATS.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-red-200/80 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Besoins */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </span>
                <h3 className="font-bold text-white text-lg">Besoins opérationnels</h3>
              </div>
              <ul className="space-y-3">
                {NEEDS.map((n) => (
                  <li key={n.bold} className="flex items-start gap-3 text-blue-200/80 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
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
            className="mt-10 text-center text-blue-200/70 max-w-3xl mx-auto text-sm leading-relaxed border border-white/10 rounded-2xl bg-white/5 p-6"
          >
            D'où l'intérêt stratégique d'un <strong className="text-white">réseau hybride distribué</strong> combinant
            radars côtiers, bouées intelligentes et systèmes d'identification — le{" "}
            <strong className="text-cyan-400">Maritime Surveillance Grid</strong>.
          </motion.p>
        </div>
      </section>

      {/* ══ 2. CONCEPT OPÉRATIONNEL ═══════════════════════════════ */}
      <section id="concept" className="py-24 bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="02 — Concept opérationnel"
              title="Architecture multi-capteurs en 3 couches"
              subtitle="Le Maritime Surveillance Grid repose sur le déploiement d'une architecture multi-capteurs distribuée conçue pour assurer une couverture maritime permanente, sans angles morts. Ce concept fusionne en temps réel les données issues de trois couches technologiques complémentaires."
            />
          </motion.div>

          {/* Tabs couches */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            {LAYERS.map((layer, i) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(i)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border font-semibold text-sm transition-all ${
                  activeLayer === i
                    ? "border-cyan-500/50 bg-cyan-500/10 text-white"
                    : "border-white/10 bg-white/5 text-blue-300 hover:bg-white/10"
                }`}
              >
                <layer.icon className="w-4 h-4" />
                <span>Couche {layer.id} — {layer.title}</span>
              </button>
            ))}
          </div>

          {/* Détail couche active */}
          {LAYERS.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={activeLayer === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className={activeLayer === i ? "block" : "hidden"}
            >
              <div className={`rounded-3xl border ${layer.border} bg-gradient-to-br ${layer.color} p-8`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <layer.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{layer.title}</h3>
                    <p className="text-white/60 text-sm">{layer.subtitle}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {layer.features.map((f) => (
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

      {/* ══ 3. ARCHITECTURE TECHNIQUE ═════════════════════════════ */}
      <section id="architecture" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="03 — Architecture technique"
              title="Conçue pour les environnements défense"
              subtitle="Chaque composant a été sélectionné sur la base de critères de fiabilité, de robustesse en milieu maritime hostile et de compatibilité avec les infrastructures gouvernementales existantes. Disponibilité supérieure à 99,5% en conditions opérationnelles normales."
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Capteurs */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">Capteurs &amp; Équipements</h3>
              <div className="space-y-3">
                {TECH_SENSORS.map((s) => (
                  <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{s.label}</p>
                      <p className="text-blue-300/70 text-xs">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Liaisons */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">Liaisons de Communication</h3>
              <div className="space-y-3">
                {TECH_LINKS.map((l) => (
                  <div key={l.label} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <l.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{l.label}</p>
                      <p className="text-blue-300/70 text-xs">{l.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bloc sécurité */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-6 flex gap-4 items-start"
          >
            <Lock className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-1">Sécurisation des communications</p>
              <p className="text-amber-200/70 text-sm leading-relaxed">
                L'ensemble des flux de données, qu'ils soient transmis par radio longue portée, LTE maritime ou satellite, est
                chiffré de bout en bout selon les standards cryptographiques en vigueur. L'architecture réseau prévoit des
                redondances de liaisons et des protocoles de bascule automatique garantissant un taux de disponibilité
                supérieur à <strong className="text-white">99,5%</strong> en conditions opérationnelles normales.
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
              title="6 missions couvertes en temps réel"
              subtitle="Le MSG délivre un ensemble complet de capacités opérationnelles couvrant le spectre élargi des missions de sécurité maritime, de la surveillance permanente à la conduite des situations de crise."
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
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/8 hover:border-cyan-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4 group-hover:bg-cyan-500/25 transition-colors">
                  <c.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{c.label}</h3>
                <p className="text-blue-200/60 text-xs leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. AVANTAGES — TABLEAU COMPARATIF ════════════════════ */}
      <section id="avantages" className="py-24 bg-gray-950">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="05 — Avantages stratégiques"
              title="Radar seul vs Système Hybride MSG"
              subtitle="La différence ne repose pas uniquement sur la détection, mais sur la qualité de l'information opérationnelle mise à disposition des décideurs."
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
              <div className="px-6 py-4 text-blue-300">Critère</div>
              <div className="px-6 py-4 text-red-300 border-l border-white/10">Radar Seul</div>
              <div className="px-6 py-4 text-cyan-300 border-l border-white/10">Système Hybride MSG</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.criteria}
                className={`grid grid-cols-3 border-t border-white/10 ${i % 2 === 0 ? "bg-white/3" : "bg-transparent"}`}
              >
                <div className="px-6 py-4 text-sm font-semibold text-white">{row.criteria}</div>
                <div className="px-6 py-4 text-sm text-red-300/80 border-l border-white/10">{row.radar}</div>
                <div className="px-6 py-4 text-sm text-cyan-300 border-l border-white/10 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  {row.msg}
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
              title="Une architecture ouverte vers le futur"
              subtitle="L'architecture ouverte et modulaire du MSG a été pensée pour intégrer facilement de nouvelles capacités. Cette flexibilité représente un avantage stratégique majeur : elle protège l'investissement initial et permet d'adapter le système aux menaces émergentes sans modifier l'infrastructure existante."
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
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-950/40 to-gray-900/60 p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                  <e.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{e.label}</h3>
                <p className="text-blue-200/60 text-sm leading-relaxed">{e.desc}</p>
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
              title="Adapté à chaque institution"
              subtitle="Le MSG est conçu pour répondre aux besoins opérationnels des différentes administrations engagées dans la sécurité et la surveillance des espaces maritimes nationaux. Grâce à son architecture ouverte et modulaire, il s'adapte aux doctrines, procédures et priorités de chaque institution."
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
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <app.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{app.label}</h3>
                <p className="text-blue-200/60 text-xs leading-relaxed">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 8. CONCLUSION + POC CTA ═══════════════════════════════ */}
      <section id="poc" className="py-24 bg-gradient-to-br from-blue-950 via-indigo-950 to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.22em] text-cyan-400 mb-4">
              Conclusion &amp; Proposition
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
              Proof of Concept —{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Première étape pragmatique
              </span>
            </h2>
            <p className="text-blue-100/80 text-base leading-relaxed mb-4 max-w-3xl mx-auto">
              Le Maritime Surveillance Grid apporte une <strong className="text-white">réponse concrète, moderne</strong> et immédiatement
              opérationnelle aux enjeux de surveillance maritime. Afin d'engager cette dynamique de manière pragmatique et
              maîtrisée, nous proposons la mise en œuvre d'un{" "}
              <strong className="text-cyan-400">Proof of Concept (POC)</strong> sur une zone maritime représentative
              de la ZEE du pays.
            </p>
            <p className="text-blue-200/60 text-sm mb-10 max-w-2xl mx-auto">
              Cette première étape permettra de valider les performances du système en conditions réelles, de mesurer les
              gains opérationnels et de définir le schéma de déploiement le plus adapté aux priorités souveraines.
            </p>

            {/* Technos finales */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { icon: Radar, label: "Radars côtiers" },
                { icon: Wind, label: "Drones maritimes autonomes" },
                { icon: Wind, label: "Drones aériens" },
                { icon: Satellite, label: "Satellites AIS / OTH" },
                { icon: Camera, label: "Caméras PTZ marines" },
              ].map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full"
                >
                  <t.icon className="w-3.5 h-3.5 text-cyan-400" />
                  {t.label}
                </span>
              ))}
            </div>

            <Link href="/contact">
              <a className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-cyan-500/20">
                Planifier le POC avec nos experts
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
