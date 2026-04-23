import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { useTranslation } from "../lib/i18n";
import { SpotlightCard, NumberTicker, TiltCard } from "../design-system";
import AuroraBackground from "../design-system/AuroraBackground";
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
  "Cross-border organized tax evasion and fraud",
  "Informal economy not captured in tax bases",
  "Systematic under-declaration of revenues and customs flows",
  "Fragmented tax databases across administrations",
  "Lack of real-time visibility on revenue flows",
  "Low voluntary tax compliance rates",
];

const IMPERATIVES = [
  { text: "Sustainably increase the", bold: "tax burden rate" },
  { text: "Fight against", bold: "fraud and tax evasion" },
  { text: "Real-time supervision of", bold: "public revenues" },
  { text: "Modernization of", bold: "tax collection and control" },
  { text: "Integration of", bold: "customs, tax and treasury data" },
  { text: "Strengthen", bold: "the state's financial sovereignty" },
];

const PILLARS = [
  {
    id: 1,
    icon: Database,
    title: "Collection Infrastructure",
    subtitle: "Digital & Integrated",
    color: "from-emerald-900 to-emerald-700",
    border: "border-emerald-500/30",
    features: [
      {
        label: "Unified e-filing",
        value:
          "Centralized taxpayer portal for corporate tax, VAT, personal income, business licenses and customs duties with automatic pre-filling from third-party sources.",
      },
      {
        label: "Sovereign digital payments",
        value:
          "Multi-channel integration: bank transfer, mobile money, card payments, electronic mandates — with automatic reconciliation and full traceability.",
      },
      {
        label: "Unique taxpayer identifier",
        value:
          "Single fiscal identifier linked to commercial, civil and operator registries to eliminate duplicates and ghost entities.",
      },
      {
        label: "Automated fiscal onboarding",
        value:
          "Online registration of new taxpayers with identity verification and immediate activation of the fiscal account.",
      },
    ],
  },
  {
    id: 2,
    icon: Activity,
    title: "Supervision & Analytics",
    subtitle: "Real-time dashboard",
    color: "from-blue-900 to-blue-700",
    border: "border-blue-500/30",
    features: [
      {
        label: "Executive dashboard",
        value:
          "Consolidated real-time view of collected revenues, variances vs targets, payment delays and trends by sector, region and tax type.",
      },
      {
        label: "Inter-administration flow tracking",
        value:
          "Automatic aggregation of Tax–Customs–Treasury flows with accounting reconciliation and complete traceability from the triggering event to the state's account.",
      },
      {
        label: "Compliance scorecards",
        value:
          "Continuous compliance index per taxpayer, sector and region — enabling smart prioritization of audit and enforcement actions.",
      },
      {
        label: "Forecasting and budget simulation",
        value:
          "Predictive engines for monthly revenue forecasting, simulation of fiscal measures and early detection of deviations from targets.",
      },
    ],
  },
  {
    id: 3,
    icon: Search,
    title: "Fraud Detection",
    subtitle: "Intelligence & Audit",
    color: "from-red-900 to-red-700",
    border: "border-red-500/30",
    features: [
      {
        label: "Anomaly detection engine",
        value:
          "Behavioral analysis algorithms and risk scoring across filings — targeting VAT carousel schemes, fictitious invoicing and money laundering.",
      },
      {
        label: "Multi-source cross-checks",
        value:
          "Automatic reconciliation between tax filings, bank statements, customs manifests, financial statements and commercial registry data.",
      },
      {
        label: "Intelligent audit management",
        value:
          "Algorithmic selection of cases for audit, verification mission planning, procedure tracking and automatic computation of adjustments and penalties.",
      },
      {
        label: "Traceability and audit trail",
        value:
          "Immutable audit log of all fiscal operations, data changes and agent actions with cryptographic timestamps ensuring integrity.",
      },
    ],
  },
];

const INTEGRATIONS = [
  { icon: Landmark, label: "National banking system", desc: "Real-time reconciliation of payment flows" },
  { icon: Globe, label: "Customs & Trade", desc: "Cross-check manifests, declared values and duties collected" },
  { icon: FileText, label: "Commercial registry", desc: "Verify legal existence of taxpayer entities" },
  { icon: Users, label: "Civil registry & biometrics", desc: "Identity verification for individual taxpayers" },
];

const SECURITY = [
  { icon: Lock, label: "Sovereign encryption", desc: "National PKI, end-to-end encryption of fiscal data" },
  { icon: ShieldCheck, label: "Role-based isolation", desc: "Granular RBAC — agents, supervisors, internal auditors" },
  { icon: Eye, label: "Access monitoring", desc: "Dedicated SIEM, detection of insider malicious behavior" },
  { icon: RefreshCw, label: "Continuity & resilience", desc: "Redundant architecture, RPO < 1h, RTO < 4h" },
];

const CAPABILITIES = [
  { icon: DollarSign, label: "Revenue mobilization", desc: "Maximize the effective tax base by identifying all active taxpayers and enabling automated multi-channel collection." },
  { icon: Search, label: "Intelligent audit & control", desc: "Algorithmic targeting of high-risk cases to concentrate audit resources where recovery potential is highest." },
  { icon: BarChart2, label: "Real-time budget reporting", desc: "Executive dashboard with instant consolidation of revenues by type, department, region and period for strategic steering." },
  { icon: Link2, label: "Inter-agency interoperability", desc: "Secure automated exchanges between tax, customs, treasury and central bank via sovereign encrypted APIs." },
  { icon: TrendingUp, label: "Fiscal forecasting & simulation", desc: "Predictive models to anticipate revenues, simulate reforms impact and detect drifts early." },
  { icon: Cpu, label: "AI anti-fraud", desc: "Machine learning models trained on national fiscal histories to automate detection of complex fraud schemes." },
];

const COMPARISON = [
  { criteria: "Real-time visibility", before: "Lagging monthly reports", after: "Live dashboard of all revenues", good: true },
  { criteria: "Fraud detection", before: "Random manual checks", after: "Automatic risk scoring across 100% of cases", good: true },
  { criteria: "Fiscal coverage", before: "Partial — informal economy excluded", after: "Expanded — systematic identification", good: true },
  { criteria: "Interoperability (Tax/Customs/Treasury)", before: "Manual exchanges, >30 days delays", after: "Real-time APIs, auto reconciliation", good: true },
  { criteria: "Taxpayer experience", before: "Physical procedures, long queues", after: "24/7 digital portal", good: true },
  { criteria: "Budget steering", before: "T-1, incomplete data", after: "Dynamic real-time forecasts", good: true },
];

const EVOLUTIONS = [
  { icon: Cpu, label: "Advanced detection AI", desc: "Deep learning models to identify complex tax schemes, abusive transfer pricing and aggressive cross-border optimization." },
  { icon: Globe, label: "International data exchange", desc: "OECD BEPS compliance, Common Reporting Standard and automated tax information exchange with partner administrations." },
  { icon: Link2, label: "Beneficial ownership registry", desc: "Automatic identification of true economic beneficiaries of legal structures to combat evasion and money laundering." },
  { icon: BarChart2, label: "Fiscal digital twins", desc: "Macroeconomic simulation of reform impacts before enactment — modeling revenue elasticity to fiscal policy." },
];

const GOV_APPS = [
  { icon: Landmark, label: "Directorate General of Taxes", desc: "Full tax cycle management: registration, filing, payment, enforcement and litigation — with revenue target management per office." },
  { icon: Globe, label: "Directorate General of Customs", desc: "Monitoring declared values, detecting under-declaration, supervision of suspended regimes and optimizing import duty collection." },
  { icon: DollarSign, label: "Ministry of Finance", desc: "Consolidated public revenue dashboard, official fiscal statistics publication, IMF/World Bank reporting and strategic steering." },
  { icon: TrendingUp, label: "Treasury", desc: "Real-time monitoring of state cash flows, fiscal debt management, forced collection and reconciliation with the banking system." },
  { icon: ShieldCheck, label: "General Inspectorate of Finance", desc: "Internal audit and oversight tools — detection of deviant behavior and full traceability to fight corruption." },
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
        <div
          className="absolute inset-0 opacity-[0.03]"
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
              Fiscal{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Sovereignty
              </span>
            </h1>
            <p className="text-lg text-emerald-100/80 mb-8 leading-relaxed max-w-xl">
              Integrated platform for supervision and mobilization of public revenues — digital collection, executive real-time dashboard and intelligent tax fraud detection.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                Request a presentation <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#contexte"
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
              { numVal: 35, prefix: "+", suffix: " %", label: "Average recovery rate increase", icon: TrendingUp },
              { numVal: 100, suffix: " %", label: "Case coverage by risk scoring", icon: Search },
              { textVal: "Real-time", label: "Public revenue supervision", icon: Activity },
              { numVal: 3, suffix: " pillars", label: "Collection · Supervision · Audit", icon: ShieldCheck },
            ].map((m: any) => (
              <SpotlightCard
                key={m.label}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-2"
              >
                <m.icon className="w-6 h-6 text-emerald-400" />
                <p className="text-2xl font-black text-white">
                  {m.numVal !== undefined ? (
                    <NumberTicker value={m.numVal} prefix={m.prefix} suffix={m.suffix} />
                  ) : (
                    m.textVal
                  )}
                </p>
                <p className="text-xs text-emerald-300/80 font-medium">{m.label}</p>
              </SpotlightCard>
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
              tag="01 — Strategic context"
              title="An imperative for financial sovereignty"
              subtitle="For many countries, increasing domestic tax revenues is the most powerful lever to finance development without external dependence. Tax administrations face structural challenges that limit their mobilization capacity."
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
                <h3 className="font-bold text-white text-lg">Structural challenges</h3>
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
                <h3 className="font-bold text-white text-lg">Strategic imperatives</h3>
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
            The answer is an <strong className="text-white">integrated sovereign platform</strong> covering the full tax cycle — from taxpayer identification to effective collection — with real-time analytical intelligence:{" "}
            <strong className="text-emerald-400">the Revenue Intelligence Platform</strong>.
          </motion.p>
        </div>
      </section>

      {/* ══ 2. CONCEPT — 3 PILIERS ════════════════════════════════ */}
      <section id="concept" className="py-24 bg-gray-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeader
              tag="02 — Operational concept"
              title="Three-pillar sovereign architecture"
              subtitle="The Revenue Intelligence Platform rests on three complementary pillars covering the full tax cycle — from initial collection to final control — with a consolidated real-time view for decision-makers."
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
                <span>Pillar {p.id} — {p.title}</span>
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
              tag="03 — Technical architecture"
              title="Interoperable, secure, sovereign"
              subtitle="The platform is designed to integrate with existing national administration systems while ensuring maximal protection of taxpayers' fiscal data and confidentiality of the state's strategic information."
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">System integrations</h3>
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
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Security &amp; Data Governance</h3>
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
              <p className="font-bold text-white mb-1">Sovereign hosting</p>
              <p className="text-emerald-200/70 text-sm leading-relaxed">
                All fiscal data is hosted on national government infrastructure or an approved sovereign cloud. No taxpayer data transits through foreign servers. The architecture can operate in air-gap mode in case of international connectivity loss, ensuring <strong className="text-white">continuity of fiscal services even during crises</strong>.
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
              title="6 key capabilities for the State"
              subtitle="The Revenue Intelligence Platform delivers an integrated set of capabilities covering all dimensions of fiscal mobilization — from initial collection to audit and strategic reporting."
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
              tag="05 — Strategic benefits"
              title="Before vs After RIP deployment"
              subtitle="Digital transformation of the tax administration delivers measurable gains across performance indicators — revenues, compliance, efficiency and governance."
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
              <div className="px-6 py-4 text-emerald-300">{t('revenue.comparison.criteria')}</div>
              <div className="px-6 py-4 text-red-300 border-l border-white/10">{t('revenue.comparison.before')}</div>
              <div className="px-6 py-4 text-emerald-300 border-l border-white/10">{t('revenue.comparison.after')}</div>
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
              tag="06 — Scalability"
              title="The platform grows with your ambitions"
              subtitle="The modular architecture of the Revenue Intelligence Platform allows progressive integration of advanced features according to priorities and the digital maturity of each administration."
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
              tag="07 — Government applications"
              title="A solution for every institution"
              subtitle="The Revenue Intelligence Platform adapts to the specific needs of each administration involved in revenue mobilization, management and control."
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
              Conclusion &amp; Proposal
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
              A first operational deployment{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                in 90 days
              </span>
            </h2>
            <p className="text-emerald-100/80 text-base leading-relaxed mb-4 max-w-3xl mx-auto">
              The Revenue Intelligence Platform can be rolled out progressively, starting with an operational pilot covering a targeted scope — a tax type, a regional office or a priority economic sector — to demonstrate concrete gains before national scale-up.
            </p>
            <p className="text-emerald-200/60 text-sm mb-10 max-w-2xl mx-auto">
              This pragmatic approach secures implementation, measures fiscal ROI within weeks and trains teams in real conditions ahead of nationwide deployment.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { icon: Database, label: "Digital collection" },
                { icon: Activity, label: "Real-time supervision" },
                { icon: Search, label: "Fraud detection" },
                { icon: PieChart, label: "Executive reporting" },
                { icon: Cpu, label: "AI for tax" },
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

            <Link href="/contact" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-emerald-500/20">
              Schedule a pilot with our experts
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
