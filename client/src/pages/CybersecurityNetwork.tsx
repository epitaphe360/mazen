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
  Eye,
  Globe,
  Lock,
  Network,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Siren,
  Wifi,
  Zap,
  BarChart2,
  FileText,
  Bell,
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

const THREATS = [
  "Advanced Persistent Threats (APT) targeting government infrastructure",
  "Ransomware attacks on critical national systems",
  "Unauthorized intrusions into state data networks",
  "Lateral movement across inter-agency networks",
  "Data exfiltration from sensitive government databases",
  "Denial of service attacks on public digital services",
];

const IMPERATIVES = [
  { text: "Protect", bold: "sovereign digital infrastructure" },
  { text: "Detect & respond to", bold: "network intrusions in real time" },
  { text: "Ensure continuity of", bold: "critical public services" },
  { text: "Enforce", bold: "zero-trust network policies" },
  { text: "Monitor all", bold: "inter-agency traffic flows" },
  { text: "Maintain", bold: "national cyber situational awareness" },
];

const PILLARS = [
  {
    id: 1,
    icon: Eye,
    title: "Network Monitoring & Detection",
    subtitle: "SOC / SIEM",
    color: "from-blue-900 to-blue-700",
    border: "border-blue-500/30",
    features: [
      {
        label: "24/7 Security Operations Center",
        value: "Dedicated national SOC staffed round the clock — continuous monitoring of all government network segments with tiered analyst escalation.",
      },
      {
        label: "SIEM platform",
        value: "Centralized log aggregation from firewalls, proxies, endpoints, DNS, VPN and cloud services — enabling correlated threat detection across the full kill chain.",
      },
      {
        label: "Network traffic analysis",
        value: "Behavioral baselining of all east-west and north-south traffic — detecting anomalies, scanning, C2 callbacks and data exfiltration patterns.",
      },
      {
        label: "Threat intelligence integration",
        value: "Real-time ingestion of threat intelligence feeds (MISP, STIX/TAXII) correlated with internal observables — IOC matching at line rate.",
      },
    ],
  },
  {
    id: 2,
    icon: Shield,
    title: "Perimeter Defense",
    subtitle: "Firewall · IPS · Proxy",
    color: "from-emerald-900 to-emerald-700",
    border: "border-emerald-500/30",
    features: [
      {
        label: "Next-generation firewall",
        value: "Application-aware NGFW with deep inspection, geo-blocking, botnet filtering and dynamic policy enforcement across all government network perimeters.",
      },
      {
        label: "Intrusion Prevention System",
        value: "Inline IPS with signature + behavioral detection — blocking exploits, protocol anomalies and attack patterns before they reach target systems.",
      },
      {
        label: "Secure web gateway",
        value: "SSL inspection, web filtering, sandbox detonation of suspicious content — protecting all government users browsing from state-managed endpoints.",
      },
      {
        label: "DDoS mitigation",
        value: "Volumetric and application-layer DDoS protection — scrubbing centers and BGP blackhole routing to preserve availability of critical public services.",
      },
    ],
  },
  {
    id: 3,
    icon: RefreshCw,
    title: "Incident Response",
    subtitle: "SOAR · Forensics",
    color: "from-rose-900 to-rose-700",
    border: "border-rose-500/30",
    features: [
      {
        label: "Automated response playbooks",
        value: "SOAR-orchestrated incident response — automatic containment, isolation and remediation actions triggered on confirmed detections to minimize dwell time.",
      },
      {
        label: "Digital forensics capability",
        value: "Memory forensics, disk imaging, network packet capture replay — providing court-admissible evidence for investigation and attribution.",
      },
      {
        label: "Threat hunting",
        value: "Proactive hypothesis-driven hunting by expert analysts using EDR telemetry, network flows and SIEM data to detect dormant threats before activation.",
      },
      {
        label: "Post-incident reporting",
        value: "Structured incident reports (MITRE ATT&CK mapped) delivered to government CISO and relevant authorities within defined SLA windows.",
      },
    ],
  },
];

const STATS = [
  { raw: 99, suffix: ".9%", label: "Infrastructure uptime", sub: "SOC-maintained SLA" },
  { raw: 3, suffix: "min", label: "Mean detection time", sub: "MTTD for critical threats" },
  { raw: 15, suffix: "min", label: "Mean response time", sub: "MTTR for P1 incidents" },
  { raw: 100, suffix: "%", label: "Traffic monitored", sub: "All government segments" },
];

const INTEGRATIONS = [
  { icon: Server, label: "Government data centers", desc: "Full-span monitoring of on-premise infrastructure" },
  { icon: Globe, label: "Internet gateways", desc: "Ingress/egress traffic inspection and filtering" },
  { icon: Wifi, label: "Endpoint agents", desc: "EDR telemetry from all government workstations" },
  { icon: Lock, label: "PKI & identity systems", desc: "Integration with national certificate authorities" },
];

const SECURITY_PROPS = [
  { icon: Lock, label: "Sovereign data custody", desc: "All telemetry stays within national borders — no foreign cloud dependencies" },
  { icon: ShieldCheck, label: "Zero-trust architecture", desc: "Micro-segmentation and identity-based access control across all segments" },
  { icon: Eye, label: "Insider threat detection", desc: "User behavior analytics (UEBA) to detect privileged user abuse" },
  { icon: RefreshCw, label: "Business continuity", desc: "Redundant SOC infrastructure with defined RTO/RPO for all critical services" },
];

const CAPABILITIES = [
  { icon: Eye, label: "Full network visibility", desc: "100% coverage of government network segments — no blind spots in east-west or north-south traffic." },
  { icon: Zap, label: "Real-time threat detection", desc: "Sub-second alert generation on confirmed IOCs, behavioral anomalies and known attack signatures." },
  { icon: Shield, label: "Multi-layer defense", desc: "Integrated perimeter, network, endpoint and identity security forming a unified defensive posture." },
  { icon: Activity, label: "Continuous compliance", desc: "Automated mapping to national and international cybersecurity frameworks (ISO 27001, NIST CSF, NIS2)." },
  { icon: Cpu, label: "AI-powered analytics", desc: "Machine learning models for anomaly detection, insider threat identification and attack prediction." },
  { icon: Bell, label: "Executive reporting", desc: "Structured cybersecurity dashboards and KPI reporting for national CISO, CTO and ministry leadership." },
];

const COMPARISON = [
  { criteria: "Threat detection speed", before: "Hours to days (if detected)", after: "Under 3 minutes (automated)", good: true },
  { criteria: "Coverage", before: "Perimeter only", after: "Full kill-chain — all segments", good: true },
  { criteria: "Incident response", before: "Manual, uncoordinated", after: "Automated SOAR playbooks", good: true },
  { criteria: "Threat intelligence", before: "None or static feeds", after: "Real-time correlated IOCs", good: true },
  { criteria: "Evidence & forensics", before: "Logs often unavailable", after: "Full packet capture + DFIR", good: true },
  { criteria: "Compliance reporting", before: "Manual annual audits", after: "Continuous automated mapping", good: true },
];

/* ─── COMPONENT ─────────────────────────────────────────────── */

export default function CybersecurityNetwork() {
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Network Cybersecurity</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Sovereign Cyber Defense
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-gold-400 mt-2">
                for Government Networks
              </span>
            </h1>
            <p className="text-xl text-navy-300 leading-relaxed mb-8 max-w-3xl mx-auto">
              MAZEN's network cybersecurity practice delivers continuous monitoring, threat detection and incident response for critical government infrastructure — ensuring operational resilience against state-level and criminal cyber threats.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm transition-all shadow-lg shadow-gold-500/30">
                Request a security assessment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/case-studies" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold text-sm transition-all">
                Deployments
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Explore</span>
          <ChevronDown className="w-4 h-4 text-white animate-bounce" />
        </div>
      </section>

      {/* ── THREATS ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Threat landscape</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950 mb-6 leading-tight">
                Government networks face<br />sophisticated, persistent threats.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Nation-state actors, organized cybercriminals and insider threats target government networks continuously. Without a dedicated sovereign cyber defense capability, critical infrastructure remains exposed.
              </p>
              <ul className="space-y-3">
                {THREATS.map((t, i) => (
                  <motion.li key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{t}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
              className="grid grid-cols-2 gap-4">
              {IMPERATIVES.map((u, i) => (
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
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Service pillars</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950">Three security layers</h2>
          </motion.div>

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
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Platform capabilities</span>
            <h2 className="text-3xl font-extrabold text-navy-950">What our SOC delivers</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <TiltCard className="h-full">
                    <SpotlightCard className="p-6 h-full">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-emerald-700" />
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
            <h2 className="text-3xl font-extrabold text-navy-950">Managed SOC vs. status quo</h2>
          </motion.div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-950 text-white">
                  <th className="px-5 py-4 text-left font-bold w-1/3">Criteria</th>
                  <th className="px-5 py-4 text-left font-bold text-rose-300">Without managed SOC</th>
                  <th className="px-5 py-4 text-left font-bold text-emerald-300">With MAZEN Cyber</th>
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
      <section className="py-20 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-3">Integration points</span>
            <h2 className="text-3xl font-extrabold">Connected to your infrastructure</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INTEGRATIONS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <SpotlightCard className="p-5 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
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
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(16,185,129,0.08), transparent)" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block mb-4">Cyber defense</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Protect your sovereign<br />digital infrastructure
            </h2>
            <p className="text-navy-300 mb-8">
              Contact our cybersecurity practice to schedule a network security assessment and SOC readiness evaluation.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-sm transition-all shadow-xl shadow-gold-500/30">
              Schedule a security assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
