import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { SpotlightCard, TiltCard } from "../design-system";
import AuroraBackground from "../design-system/AuroraBackground";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  FileText,
  Fingerprint,
  Globe,
  HandMetal,
  Lock,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Users,
  Zap,
  Building,
  CreditCard,
  Cpu,
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

/* ─── DATA ─────────────────────────────────────────────────── */

const CRIME_TYPES = [
  "Online financial fraud and digital asset theft",
  "Identity theft and document forgery at scale",
  "Dark web markets for illicit goods and services",
  "Ransomware and extortion campaigns targeting enterprises",
  "Child exploitation material and online grooming",
  "Cross-border organized cybercrime networks",
];

const PARTNER_NOTE =
  "MAZEN GovTech delivers cybercrime investigation capabilities through a strategic network of certified partner organizations, combining deep technical forensics expertise with legal and judicial process integration.";

const SERVICES = [
  {
    icon: Search,
    title: "Digital Forensics",
    desc: "Collection, preservation and analysis of digital evidence in accordance with national and international chain-of-custody standards — admissible in court.",
    partner: true,
  },
  {
    icon: Globe,
    title: "OSINT & Dark Web Intelligence",
    desc: "Open-source intelligence gathering and dark web monitoring — identifying criminal actors, infrastructure and marketplaces targeting national interests.",
    partner: true,
  },
  {
    icon: CreditCard,
    title: "Financial Cybercrime Investigation",
    desc: "Tracing illicit crypto flows, money mule networks and online fraud schemes — producing evidence packages for financial intelligence units (FIU).",
    partner: true,
  },
  {
    icon: Fingerprint,
    title: "Attribution & Threat Actor Profiling",
    desc: "Technical attribution of cyberattacks to specific threat actors using malware analysis, infrastructure pivoting and behavioral fingerprinting.",
    partner: true,
  },
  {
    icon: Scale,
    title: "Judicial Support & Expert Testimony",
    desc: "Certified expert witnesses for cyber-related criminal proceedings — technical translation for prosecutors, judges and legal teams.",
    partner: true,
  },
  {
    icon: Building,
    title: "Capacity Building for Police & Justice",
    desc: "Training programmes for national police cyber units, prosecutors and judges — building durable investigative capacity within state institutions.",
    partner: false,
  },
];

const PARTNER_CAPABILITIES = [
  { label: "Certified digital forensics labs", desc: "ISO/IEC 17025-accredited evidence processing environments" },
  { label: "Law enforcement liaison network", desc: "Established relationships with Interpol, Europol and national cyber police units" },
  { label: "Crypto tracing expertise", desc: "Blockchain analytics and virtual asset tracing certified professionals" },
  { label: "Legal framework integration", desc: "Alignment with Budapest Convention on Cybercrime and regional legal frameworks" },
  { label: "Incident-to-prosecution pipeline", desc: "End-to-end case management from detection through judicial outcome" },
  { label: "Cross-border cooperation", desc: "Experience coordinating multi-jurisdictional investigations across Africa and Europe" },
];

const PROCESS = [
  {
    step: "01",
    title: "Incident intake",
    desc: "Structured intake process for cybercrime reports from government agencies, financial institutions or law enforcement — with triage and priority classification.",
  },
  {
    step: "02",
    title: "Evidence preservation",
    desc: "Immediate forensic imaging and cryptographic hashing of all digital evidence — ensuring chain of custody integrity from the first hour.",
  },
  {
    step: "03",
    title: "Technical investigation",
    desc: "Deep forensic analysis, malware reverse engineering, network traffic reconstruction and OSINT corroboration by certified analysts.",
  },
  {
    step: "04",
    title: "Attribution & intelligence",
    desc: "Threat actor profiling, infrastructure mapping and linkage to known criminal groups — enriched with commercial and open-source threat intelligence.",
  },
  {
    step: "05",
    title: "Judicial package",
    desc: "Production of court-ready evidence packages: forensic reports, chain of custody documentation, expert affidavits and testimony preparation.",
  },
  {
    step: "06",
    title: "Prosecution support",
    desc: "Ongoing support to prosecutors throughout legal proceedings — technical briefings, rebuttal analysis and expert witness services.",
  },
];

const GOV_APPS = [
  { icon: Shield, label: "National Cyber Police", desc: "Technical investigation capability for cybercrime units lacking in-house forensics expertise." },
  { icon: Scale, label: "Prosecutors & Courts", desc: "Expert testimony, certified evidence and technical briefings for cyber-related criminal proceedings." },
  { icon: Building, label: "Central Banks & FIUs", desc: "Financial cybercrime investigation — tracing stolen assets and dismantling money mule networks." },
  { icon: Eye, label: "Intelligence Agencies", desc: "Attribution support, threat actor profiling and dark web monitoring for national security purposes." },
];

/* ─── COMPONENT ─────────────────────────────────────────────── */

export default function Cybercrime() {
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-400/20 mb-6">
              <Fingerprint className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Cybercrime Investigation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Investigate. Attribute.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-gold-400 mt-2">
                Prosecute.
              </span>
            </h1>
            <p className="text-xl text-navy-300 leading-relaxed mb-8 max-w-3xl mx-auto">
              Through its certified partner network, MAZEN delivers end-to-end cybercrime investigation capabilities — from digital forensics and dark web intelligence to judicial evidence packages and expert testimony.
            </p>

            {/* Partner badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <Users className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <p className="text-sm text-navy-200 text-left">{PARTNER_NOTE}</p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <a className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-sm transition-all shadow-lg shadow-gold-500/30">
                  Talk to our team <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Explore</span>
          <ChevronDown className="w-4 h-4 text-white animate-bounce" />
        </div>
      </section>

      {/* ── CRIME TYPES ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Threat categories</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy-950 mb-6 leading-tight">
                Cybercrime evolves faster<br />than traditional law enforcement.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Modern cybercrime is transnational, technically sophisticated and economically devastating. Effective response requires specialized digital forensics, intelligence and judicial support that most national police forces lack.
              </p>
              <ul className="space-y-3">
                {CRIME_TYPES.map((c, i) => (
                  <motion.li key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{c}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
              className="space-y-4">
              <div className="rounded-2xl bg-navy-50 border border-navy-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-navy-700" />
                  <h3 className="font-bold text-navy-900">Partner network capabilities</h3>
                </div>
                <ul className="space-y-3">
                  {PARTNER_CAPABILITIES.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-navy-800 text-sm">{p.label}</p>
                        <p className="text-slate-500 text-xs">{p.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Service offering</span>
            <h2 className="text-3xl font-extrabold text-navy-950">Cybercrime investigation services</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              Delivered through MAZEN's certified partner ecosystem — combining sovereign deployment with world-class forensics expertise.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <TiltCard className="h-full">
                    <SpotlightCard className="p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-rose-700" />
                        </div>
                        {s.partner && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
                            Partner
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-navy-900 mb-2">{s.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
                    </SpotlightCard>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────── */}
      <section className="py-24 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block mb-3">Investigation methodology</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">From incident to prosecution</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROCESS.map((p, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SpotlightCard className="p-6 h-full">
                  <div className="text-5xl font-black text-gold-400/20 mb-3">{p.step}</div>
                  <h3 className="font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-navy-400 text-sm leading-relaxed">{p.desc}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOV APPLICATIONS ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-3">Government applications</span>
            <h2 className="text-3xl font-extrabold text-navy-950">Who we serve</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GOV_APPS.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <SpotlightCard className="p-5 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-navy-100 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-navy-700" />
                    </div>
                    <p className="font-bold text-navy-800 text-sm mb-1">{a.label}</p>
                    <p className="text-slate-500 text-xs">{a.desc}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(244,63,94,0.08), transparent)" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 block mb-4">Cybercrime services</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Fighting cybercrime requires<br />specialist expertise.
            </h2>
            <p className="text-navy-300 mb-8">
              Contact MAZEN to discuss how our partner network can support your national cybercrime investigation capability.
            </p>
            <Link href="/contact">
              <a className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-sm transition-all shadow-xl shadow-gold-500/30">
                Contact our cybercrime team <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
