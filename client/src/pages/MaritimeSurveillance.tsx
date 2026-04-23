import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { useTranslation } from "../lib/i18n";
import { SpotlightCard, NumberTicker, TiltCard } from "../design-system";
import AuroraBackground from "../design-system/AuroraBackground";
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
  "Illegal or unreported fishing",
  "Illicit maritime trafficking",
  "Threats to offshore infrastructure",
  "Maritime border violations",
];

const NEEDS = [
  { text: "Strengthen", bold: "maritime sovereignty" },
  { text: "Surveillance of", bold: "Exclusive Economic Zones" },
  { text: "Combat", bold: "illegal fishing" },
  { text: "Security of", bold: "offshore infrastructure" },
  { text: "Detection of", bold: "maritime trafficking" },
];

const LAYERS = [
  {
    id: 1,
    icon: Radar,
    title: "Maritime Radars",
    subtitle: "Long Range",
    color: "from-blue-900 to-blue-700",
    border: "border-blue-500/30",
    features: [
      { label: "Operational range", value: "60 to 96 km radial coverage per coastal radar unit" },
      { label: "Vessel detection", value: "Automatic identification of maritime contacts, including low radar-signature targets" },
      { label: "Track tracking", value: "Continuous calculation of speed and heading vectors for each tracked target in real time" },
      { label: "Target classification", value: "Embedded algorithms for automatic discrimination and classification of contacts" },
    ],
  },
  {
    id: 2,
    icon: Waves,
    title: "Smart Buoys",
    subtitle: "AIS + PTZ Camera",
    color: "from-emerald-900 to-emerald-700",
    border: "border-emerald-500/30",
    features: [
      { label: "Onboard equipment", value: "HD maritime PTZ camera · professional AIS receiver · high-precision GPS · encrypted transmission · autonomous solar power" },
      { label: "Visual identification", value: "HD visual recognition of approaching vessels with maritime PTZ cameras" },
      { label: "Continuous monitoring", value: "24/7 operation, fully energy-autonomous via solar panels" },
      { label: "Coverage area", value: "Several tens of square kilometers per buoy, ensuring dense coverage of the area of interest" },
    ],
  },
  {
    id: 3,
    icon: Monitor,
    title: "Command Center",
    subtitle: "Maritime C2",
    color: "from-purple-900 to-purple-700",
    border: "border-purple-500/30",
    features: [
      { label: "Data fusion", value: "Real-time correlation of all sources: radar, AIS, video, GPS into a single dashboard" },
      { label: "Maritime mapping", value: "Dynamic geospatial representation of all tracked targets with track history and automatic classification" },
      { label: "Real-time video", value: "Simultaneous display of camera feeds from all smart buoys with zoom and remote PTZ control" },
      { label: "Automated alerts", value: "Configurable alerts generation on suspicious behavior, zone intrusions or detected navigation anomalies" },
    ],
  },
];

const TECH_SENSORS = [
  { icon: Radar, label: "X/S-band radar", desc: "All-weather long-range detection" },
  { icon: Camera, label: "Maritime PTZ camera", desc: "High-definition visual identification" },
  { icon: Radio, label: "AIS receiver", desc: "Automatic identification of vessels" },
  { icon: Navigation, label: "High-precision GPS", desc: "Geolocation and synchronization" },
];

const TECH_LINKS = [
  { icon: Radio, label: "Long-range radio", desc: "Maritime coverage without infrastructure" },
  { icon: Zap, label: "Maritime LTE", desc: "High-bandwidth video in covered areas" },
  { icon: Satellite, label: "Satellite link", desc: "Universal connectivity outside LTE range" },
  { icon: Lock, label: "Government network", desc: "Encrypted and secure infrastructure" },
];

const CAPABILITIES = [
  { icon: Eye, label: "Detection of unreported vessels", desc: "Identification of contacts without an active AIS transponder through radar-video fusion" },
  { icon: Globe, label: "Maritime border surveillance", desc: "Continuous monitoring of baselines and national EEZ limits" },
  { icon: Anchor, label: "Combat illegal fishing", desc: "Detection and tracking of fishing vessels violating protected zones" },
  { icon: Shield, label: "Offshore infrastructure protection", desc: "Perimeter surveillance around platforms and submarine cables" },
  { icon: TrendingUp, label: "Maritime traffic monitoring", desc: "Analysis of navigation flows and real-time detection of abnormal behavior" },
  { icon: Lock, label: "Port security", desc: "Monitoring port approaches and controlling access to sensitive areas" },
];

const COMPARISON = [
  { criteria: "Visual identification", radar: "Not available", msg: "HD PTZ camera", msgGood: true },
  { criteria: "Coverage of blind spots", radar: "Low, residual gaps", msg: "High, distributed mesh", msgGood: true },
  { criteria: "Continuous monitoring", radar: "Medium, weather dependent", msg: "High, sensor redundancy", msgGood: true },
  { criteria: "AIS identification", radar: "Absent or limited", msg: "Integrated and real-time", msgGood: true },
  { criteria: "Infrastructure cost", radar: "High, fixed stations", msg: "Optimized, distributed architecture", msgGood: true },
  { criteria: "Scalability", radar: "Limited, rigid architecture", msg: "Modular, extensible", msgGood: true },
];

const EVOLUTIONS = [
  { icon: Wind, label: "Autonomous maritime drones", desc: "Autonomous patrol, rapid visual verification of contacts of interest identified by radar or buoys" },
  { icon: Wind, label: "Aerial drones", desc: "Deployment of remotely piloted or autonomous aerial drones for rapid visual verification" },
  { icon: Satellite, label: "AIS & Over-the-Horizon satellites", desc: "Extend coverage beyond the horizon using satellite AIS data and OTH radars" },
  { icon: Cpu, label: "Detection AI", desc: "Machine learning algorithms for automatic threat detection, classification and dynamic optimization" },
];

const GOV_APPS = [
  { icon: Shield, label: "Ministry of Defense", desc: "Strategic maritime intelligence, approach surveillance, support to naval operations and maritime crisis management." },
  { icon: Anchor, label: "Navy", desc: "Real-time maritime operational picture, target designation, patrol support and coordination of interceptions at sea." },
  { icon: Globe, label: "Coast Guard", desc: "Surveillance of maritime borders, search and rescue, combat illegal fishing and control of maritime immigration flows." },
  { icon: Zap, label: "Offshore protection", desc: "Securing perimeters around oil platforms, offshore wind farms and submarine communication cables." },
  { icon: Lock, label: "Port security", desc: "Monitoring port approaches, access control, detection of underwater threats and vessel traffic management." },
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
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <PublicNavbar ctaLabel="Request a presentation" ctaHref="/contact" />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-navy-950">
        {/* Aurora ambient */}
        <AuroraBackground className="opacity-70" />
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
        {/* Grille décorative */}
        <div
          className="absolute inset-0 opacity-[0.03]"
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
              Maritime{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Sovereignty
              </span>
            </h1>
            <p className="text-lg text-blue-100/80 mb-8 leading-relaxed max-w-xl">
              Distributed multi-sensor architecture combining long-range radars, smart buoys and an integrated command center for continuous maritime coverage with no blind spots.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                Request a presentation <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#concept"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all"
              >
                Explore the system
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
              { numVal: 96, suffix: " km", label: "Coastal radar range", icon: Radar },
              { numVal: null, textVal: "24/7", label: "Continuous monitoring", icon: Eye },
              { numVal: 3, suffix: " layers", label: "Hybrid architecture", icon: Shield },
              { numVal: 99.5, suffix: "%", label: "System availability", icon: CheckCircle },
            ].map((m) => (
              <SpotlightCard
                key={m.label}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-2"
              >
                <m.icon className="w-6 h-6 text-cyan-400" />
                <p className="text-3xl font-black text-white">
                  {m.numVal !== null && m.numVal !== undefined ? (
                    <NumberTicker value={m.numVal} suffix={m.suffix} decimals={m.suffix?.includes("%") ? 1 : 0} />
                  ) : (
                    m.textVal
                  )}
                </p>
                <p className="text-xs text-blue-300/80 font-medium">{m.label}</p>
              </SpotlightCard>
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
              tag="01 — Strategic context"
              title="A national sovereignty challenge"
              subtitle="Coastal states face increasing maritime threats that require robust, integrated technological responses. Radar-only solutions present significant structural gaps: geographic blind spots, lack of visual identification, and insufficient distributed sensors to cover vast maritime areas."
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
                <h3 className="font-bold text-white text-lg">Identified threats</h3>
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
                <h3 className="font-bold text-white text-lg">Operational needs</h3>
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
            Hence the strategic interest of a <strong className="text-white">distributed hybrid network</strong> combining
            coastal radars, smart buoys and identification systems — the{" "}
            <strong className="text-cyan-400">Maritime Surveillance Grid</strong>.
          </motion.p>
        </div>
      </section>

      {/* ══ 2. CONCEPT OPÉRATIONNEL ═══════════════════════════════ */}
      <section id="concept" className="py-24 bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="02 — Operational concept"
              title="Three-layer multi-sensor architecture"
              subtitle="The Maritime Surveillance Grid is built on a distributed multi-sensor architecture designed to ensure continuous maritime coverage with no blind spots. This concept fuses data from three complementary technological layers in real time."
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
                <span>Layer {layer.id} — {layer.title}</span>
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
              tag="03 — Technical Architecture"
              title="Designed for defense environments"
              subtitle="Each component was selected for reliability, robustness in harsh maritime environments, and compatibility with existing government infrastructures. Availability above 99.5% under normal operational conditions."
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Capteurs */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">Sensors &amp; Equipment</h3>
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
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">Communication Links</h3>
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
              <p className="font-bold text-white mb-1">Communication security</p>
              <p className="text-amber-200/70 text-sm leading-relaxed">
                All data flows, whether transmitted via long-range radio, maritime LTE or satellite, are end-to-end encrypted according to current cryptographic standards. The network architecture provides link redundancies and automatic failover protocols ensuring an availability rate above <strong className="text-white">99.5%</strong> under normal operational conditions.
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
              tag="04 — Operational capabilities"
              title="6 missions covered in real-time"
              subtitle="The MSG delivers a comprehensive set of operational capabilities covering the broad spectrum of maritime security missions, from continuous monitoring to crisis management."
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
              tag="05 — Strategic benefits"
              title="Radar alone vs Hybrid MSG System"
              subtitle="The difference is not only about detection, but about the quality of operational information made available to decision-makers."
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
              <div className="px-6 py-4 text-blue-300">{t('maritime.comparison.criteria')}</div>
              <div className="px-6 py-4 text-red-300 border-l border-white/10">{t('maritime.comparison.radarOnly')}</div>
              <div className="px-6 py-4 text-cyan-300 border-l border-white/10">{t('maritime.comparison.hybrid')}</div>
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
              tag="06 — Scalability"
              title="An open architecture for the future"
              subtitle="The open and modular architecture of the MSG is designed to easily integrate new capabilities. This flexibility is a major strategic advantage: it protects the initial investment and allows adapting the system to emerging threats without modifying the existing infrastructure."
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
              tag="07 — Government applications"
              title="Adapted to every institution"
              subtitle="The MSG is designed to meet the operational needs of various administrations engaged in the security and surveillance of national maritime spaces. Thanks to its open and modular architecture, it adapts to each institution's doctrines, procedures and priorities."
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
              Conclusion &amp; Proposal
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
              Proof of Concept —{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                A pragmatic first step
              </span>
            </h2>
            <p className="text-blue-100/80 text-base leading-relaxed mb-4 max-w-3xl mx-auto">
              The Maritime Surveillance Grid provides a <strong className="text-white">concrete, modern</strong> and immediately operational response to maritime surveillance challenges. To engage pragmatically and in a controlled manner, we propose implementing a <strong className="text-cyan-400">Proof of Concept (POC)</strong> in a maritime area representative of the country's EEZ.
            </p>
            <p className="text-blue-200/60 text-sm mb-10 max-w-2xl mx-auto">
              This initial step will validate system performance in real conditions, measure operational gains and define the most suitable deployment plan aligned with sovereign priorities.
            </p>

            {/* Technos finales */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { icon: Radar, label: "Coastal radars" },
                { icon: Wind, label: "Autonomous maritime drones" },
                { icon: Wind, label: "Aerial drones" },
                { icon: Satellite, label: "AIS / OTH satellites" },
                { icon: Camera, label: "Marine PTZ cameras" },
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

            <Link href="/contact" className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-cyan-500/20">
              Schedule the POC with our experts
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
