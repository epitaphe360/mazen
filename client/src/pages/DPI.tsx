import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { SpotlightCard, NumberTicker, TiltCard } from "../design-system";
import AuroraBackground from "../design-system/AuroraBackground";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Cpu,
  Database,
  Eye,
  Filter,
  Globe,
  Lock,
  Network,
  Radio,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Sliders,
  Wifi,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" },
  }),
};

/* ─── DATA ─────────────────────────────────────────────────── */

const CHALLENGES = [
  "Encrypted traffic masking illegal or taxable digital flows",
  "OTT service providers bypassing national telecom regulations",
  "Inability to audit operator-declared revenue against actual traffic",
  "Unmonitored data roaming and cross-border bandwidth usage",
  "Zero visibility on VoIP, streaming and messaging revenue streams",
  "Missing tax base from unregistered digital service operators",
];

const USE_CASES = [
  { text: "Identify and tax", bold: "OTT & streaming revenue" },
  { text: "Audit and verify", bold: "operator declared traffic" },
  { text: "Detect and block", bold: "illegal VoIP bypass" },
  { text: "Enforce digital", bold: "service taxation" },
  { text: "Monitor cross-border", bold: "bandwidth flows" },
  { text: "Ensure compliance of", bold: "licensed operators" },
];

const PILLARS = [
  {
    id: 1,
    icon: Filter,
    title: "Traffic Inspection Engine",
    subtitle: "Layer 2–7 Analysis",
    color: "from-blue-900 to-blue-700",
    border: "border-blue-500/30",
    features: [
      {
        label: "Full packet inspection",
        value: "Analysis of all network flows at L2 to L7 — HTTP/S, DNS, VoIP (SIP/RTP), QUIC, encrypted OTT traffic — with protocol fingerprinting.",
      },
      {
        label: "Encrypted traffic analysis",
        value: "Passive TLS fingerprinting and behavioral traffic analysis to classify encrypted flows without decryption — preserving user privacy.",
      },
      {
        label: "Application identification",
        value: "Real-time classification of 4,000+ applications and services: WhatsApp, YouTube, Netflix, Zoom, TikTok, banking apps, OTT providers.",
      },
      {
        label: "Subscriber attribution",
        value: "Correlation of traffic flows to operators, subscribers, and service types — enabling granular revenue attribution per entity.",
      },
    ],
  },
  {
    id: 2,
    icon: Database,
    title: "Revenue Intelligence",
    subtitle: "Fiscal Metering",
    color: "from-gold-900 to-gold-700",
    border: "border-gold-500/30",
    features: [
      {
        label: "Operator audit engine",
        value: "Automatic comparison of DPI-measured traffic volumes against operator fiscal declarations — detecting under-reporting and revenue leakage.",
      },
      {
        label: "OTT tax metering",
        value: "Measurement of OTT service traffic (streaming, messaging, cloud) to calculate the taxable revenue base for digital services levies.",
      },
      {
        label: "Cross-operator reconciliation",
        value: "Reconciliation across all licensed operators on the same infrastructure to detect bypass, grey routes and unauthorized interconnects.",
      },
      {
        label: "Revenue assurance reporting",
        value: "Automated monthly reports to the telecom regulator and tax authority — detailing measured vs. declared revenues with variance analysis.",
      },
    ],
  },
  {
    id: 3,
    icon: Shield,
    title: "Compliance Enforcement",
    subtitle: "Policy & Control",
    color: "from-emerald-900 to-emerald-700",
    border: "border-emerald-500/30",
    features: [
      {
        label: "Regulatory policy engine",
        value: "Configurable rule sets aligned with national telecom regulatory frameworks — QoS enforcement, bandwidth caps, fair-use policies.",
      },
      {
        label: "Illegal traffic detection",
        value: "Real-time detection of unauthorized VoIP bypass, SIM box fraud, grey route interconnects and unlicensed OTT services.",
      },
      {
        label: "Operator compliance scoring",
        value: "Continuous compliance index per operator based on traffic data, declaration accuracy, interconnect compliance and QoS metrics.",
      },
      {
        label: "Enforcement alerting",
        value: "Automatic alerts to regulatory authority with evidence package when non-compliance thresholds are exceeded.",
      },
    ],
  },
];

const STATS = [
  { raw: 98, suffix: "%", label: "Application identification rate", sub: "4,000+ protocols" },
  { raw: 13, suffix: "B+", label: "Daily transactions analyzed", sub: "Real-time processing" },
  { raw: 40, prefix: "+", suffix: "%", label: "Revenue uplift detected", sub: "vs. operator declarations" },
  { raw: 100, suffix: "Gbps", label: "Inspection throughput", sub: "Per DPI cluster node" },
];

const INTEGRATIONS = [
  { icon: Radio, label: "Telecom operators", desc: "MPLS/GRE mirror feed from core network nodes" },
  { icon: Globe, label: "Internet exchanges", desc: "IXP tap for cross-border traffic metering" },
  { icon: Database, label: "Revenue authority", desc: "Automated fiscal reporting via secure API" },
  { icon: ShieldCheck, label: "Telecom regulator", desc: "Real-time compliance dashboards and evidence packages" },
];

const SECURITY = [
  { icon: Lock, label: "Passive capture only", desc: "Read-only network tap — no impact on live traffic" },
  { icon: Eye, label: "Privacy-by-design", desc: "No content decryption — metadata and behavioral analysis only" },
  { icon: RefreshCw, label: "High availability", desc: "Redundant capture clusters, no single point of failure" },
  { icon: ShieldCheck, label: "Sovereign deployment", desc: "On-premise in national data center under state supervision" },
];

const CAPABILITIES = [
  { icon: Search, label: "Traffic auditing", desc: "Independent verification of operator-declared traffic and revenue — closing the gap between fiscal filings and actual network flows." },
  { icon: Zap, label: "Real-time classification", desc: "Protocol and application identification in under 1ms — enabling immediate enforcement actions on non-compliant traffic." },
  { icon: Activity, label: "Revenue metering", desc: "Precise measurement of taxable digital service flows for OTT levies, data taxes and digital economy contributions." },
  { icon: AlertTriangle, label: "Fraud detection", desc: "Identification of SIM box fraud, grey routes and VoIP bypass costing regulators hundreds of millions annually." },
  { icon: Network, label: "Network sovereignty", desc: "Full visibility of all traffic transiting the national network — enabling effective enforcement of digital service regulations." },
  { icon: Cpu, label: "AI traffic analytics", desc: "Machine learning models for encrypted traffic classification, behavioral profiling and anomaly detection without decryption." },
];

const COMPARISON = [
  { criteria: "OTT revenue visibility", before: "None — undetected traffic", after: "Full metering per service type", good: true },
  { criteria: "Operator audit capacity", before: "Based on self-declarations only", after: "Independent DPI-based verification", good: true },
  { criteria: "VoIP bypass detection", before: "Reactive — reported incidents only", after: "Real-time automatic detection", good: true },
  { criteria: "Regulatory compliance", before: "Manual spot checks", after: "Continuous automated scoring", good: true },
  { criteria: "Digital tax base coverage", before: "Partial — informal OTT excluded", after: "Comprehensive — all flows measured", good: true },
  { criteria: "Evidence for enforcement", before: "Weak — operator-provided data", after: "Independent cryptographic audit trail", good: true },
];

/* ─── COMPONENT ─────────────────────────────────────────────── */

export default function DPI() {
  const [activeLayer, setActiveLayer] = useState(1);
  const active = PILLARS.find((p) => p.id === activeLayer)!;

  return (
    <div className="min-h-screen page-atmosphere font-sans">
      <PublicNavbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 bg-navy-950 text-white overflow-hidden">
        <AuroraBackground className="opacity-60" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: "200px" }} />

        <div className="max-w-7xl mx-auto px-6 pt-12 relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 mb-6">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Deep Packet Inspection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Network Traffic Intelligence
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-gold-400 mt-2">
                for Sovereign Revenue
              </span>
            </h1>
            <p className="text-xl text-navy-300 leading-relaxed mb-8 max-w-3xl mx-auto">
              MAZEN's DPI platform gives governments and telecom regulators independent, real-time visibility into all network flows — closing the gap between operator declarations and actual taxable digital revenues.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm transition-all shadow-lg shadow-gold-500/30">
                Request a demo <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/case-studies" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold text-sm transition-all">
                Field deployments
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Discover</span>
          <ChevronDown className="w-4 h-4 text-white animate-bounce" />
        </div>
      </section>

      {/* ── CHALLENGES ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">The regulatory gap</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950 mb-6 leading-tight">
                Operators self-declare.<br />Governments cannot verify.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Without independent traffic monitoring, tax and regulatory authorities have no way to validate operator revenue declarations. DPI closes this blind spot — permanently.
              </p>
              <ul className="space-y-3">
                {CHALLENGES.map((c, i) => (
                  <motion.li key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{c}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
              className="grid grid-cols-2 gap-4">
              {USE_CASES.map((u, i) => (
                <SpotlightCard key={i} className="p-4">
                  <p className="text-sm text-slate-600 leading-snug">
                    {u.text}{" "}
                    <span className="font-bold text-navy-800">{u.bold}</span>
                  </p>
                </SpotlightCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="py-16 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SpotlightCard className="p-6 text-center">
                  <p className="text-4xl font-extrabold text-gold-400 mb-1">
                    {s.prefix}
                    <NumberTicker value={s.raw} />
                    {s.suffix}
                  </p>
                  <p className="font-bold text-white text-sm mb-0.5">{s.label}</p>
                  <p className="text-navy-400 text-xs">{s.sub}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS ───────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Platform architecture</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950">Three inspection layers</h2>
          </motion.div>

          {/* Layer selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <button key={p.id} onClick={() => setActiveLayer(p.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all border ${
                    activeLayer === p.id
                      ? "bg-navy-800 text-white border-navy-600 shadow-lg"
                      : "bg-white text-slate-600 border-slate-200 hover:border-navy-300"
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active panel */}
          <motion.div key={active.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className={`rounded-3xl bg-gradient-to-br ${active.color} p-8 border ${active.border}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <active.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{active.title}</h3>
                  <p className="text-white/60 text-sm">{active.subtitle}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {active.features.map((f, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-bold text-white text-sm">{f.label}</span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CAPABILITIES ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Core capabilities</span>
            <h2 className="text-3xl font-extrabold text-navy-950">What DPI enables</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <TiltCard className="h-full">
                    <SpotlightCard className="p-6 h-full">
                      <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-navy-700" />
                      </div>
                      <h3 className="font-bold text-navy-900 mb-2">{c.label}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{c.desc}</p>
                    </SpotlightCard>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Before / After</span>
            <h2 className="text-3xl font-extrabold text-navy-950">The DPI difference</h2>
          </motion.div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-950 text-white">
                  <th className="px-5 py-4 text-left font-bold w-1/3">Criteria</th>
                  <th className="px-5 py-4 text-left font-bold text-rose-300">Without DPI</th>
                  <th className="px-5 py-4 text-left font-bold text-emerald-300">With MAZEN DPI</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-5 py-3.5 font-semibold text-navy-800">{row.criteria}</td>
                    <td className="px-5 py-3.5 text-slate-500">{row.before}</td>
                    <td className="px-5 py-3.5 text-emerald-700 font-medium">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Ecosystem</span>
            <h2 className="text-3xl font-extrabold text-navy-950">Integrations & data partners</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INTEGRATIONS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <SpotlightCard className="p-5 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-navy-100 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-navy-700" />
                    </div>
                    <p className="font-bold text-navy-800 text-sm mb-1">{item.label}</p>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECURITY ──────────────────────────────────────── */}
      <section className="py-16 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-3">Security & privacy</span>
            <h2 className="text-3xl font-extrabold">Sovereign, private, non-intrusive</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SECURITY.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <SpotlightCard className="p-5">
                    <Icon className="w-6 h-6 text-gold-400 mb-3" />
                    <p className="font-bold text-white text-sm mb-1">{item.label}</p>
                    <p className="text-navy-400 text-xs">{item.desc}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(189,134,50,0.12), transparent)" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block mb-4">DPI deployment</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to measure your real<br />digital tax base?
            </h2>
            <p className="text-navy-300 mb-8">
              Talk to our network intelligence team to assess a DPI deployment adapted to your national telecom infrastructure.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-sm transition-all shadow-xl shadow-gold-500/30">
              Request a deployment assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
