import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { KEY_STATS, SECTORS_DATA } from "@shared/types";
import { Link } from "wouter";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { useTranslation } from "../lib/i18n";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Globe,
  Search,
  ShieldCheck,
  BookOpen,
  Wrench,
  Rocket,
  ArrowRight,
  Star,
  Waves,
  BarChart2,
  Database,
  ChevronRight,
  ChevronUp,
  Mail,
  TrendingUp,
  Lock,
  Zap,
} from "lucide-react";

/* ─── DONNÉES ─────────────────────────────────────────────────── */

const ETL_PILLARS = [
  {
    step: "01",
    letter: "E",
    title: "EXTRACTION",
    accent: "#3b82f6",
    description:
      "Collecte et décodage XDR de fichiers bruts des opérateurs. Transformation des enregistrements de données d'événements à partir de multiples sources hétérogènes.",
  },
  {
    step: "02",
    letter: "T",
    title: "TRANSFORMATION",
    accent: "#6366f1",
    description:
      "Conversion des enregistrements dans un format unique et compréhensible. Consolidation automatisée avec transmission confidentielle et normalisée.",
  },
  {
    step: "03",
    letter: "L",
    title: "CHARGEMENT",
    accent: "#8b5cf6",
    description:
      "Stockage dans une base de données unique et exploitation via des outils de business intelligence pour extraire les informations fiscales pertinentes.",
  },
  {
    step: "04",
    letter: "C",
    title: "CERTIFICATION",
    accent: "#f59e0b",
    description:
      "Certification des données avec les algorithmes propriétaires ETL-Certification® garantissant l'intégrité absolue et l'opposabilité légale des résultats.",
  },
];

const CASE_STUDIES = [
  {
    id: 1,
    country: "RDC",
    flag: "🇨🇩",
    fullName: "République Démocratique du Congo",
    title: "Taxes Télécommunications",
    img: "/case-rdc.svg",
    partner: "Direction Générale des Douanes et Accises (DGDA)",
    result: "+60%",
    resultLabel: "d'accises & TVA après 1 an",
    accent: "#3b82f6",
    details: "Services de télécommunications soumis aux droits d'accises, à la TVA et à d'autres prélèvements. Les revenus des opérateurs mobile représentent 5% du PIB.",
  },
  {
    id: 2,
    country: "Mali",
    flag: "🇲🇱",
    fullName: "République du Mali",
    title: "Mobile Money",
    img: "/case-mali.svg",
    partner: "Ministère des Finances",
    result: "100%",
    resultLabel: "visibilité des transactions",
    accent: "#10b981",
    details: "Traitement et analyse des métadonnées des transactions d'argent mobile. Production de rapports détaillés sur les activités et les taxes à percevoir.",
  },
  {
    id: 3,
    country: "Burundi",
    flag: "🇧🇮",
    fullName: "République du Burundi",
    title: "Jeux & Paris en ligne",
    img: "/case-burundi.svg",
    partner: "Ministère des Finances & Ministère du Commerce",
    result: "8",
    resultLabel: "opérateurs certifiés",
    accent: "#ef4444",
    details: "Redevances sur les jeux de hasard et de paris en ligne. Signature janvier 2024 — Installation mars 2024.",
  },
  {
    id: 4,
    country: "Sierra Leone",
    flag: "🇸🇱",
    fullName: "Sierra Leone",
    title: "Taxes Télécommunications",
    img: "/case-sierra-leone.svg",
    partner: "NRA — Autorité Nationale des Recettes",
    result: "552%",
    resultLabel: "hausse maximale des recettes",
    accent: "#f59e0b",
    details: "Accord BOT signé en avril 2023 avec la NRA pour les télécommunications, le mobile money et les paris.",
  },
];

const WHY_US_PILLARS = [
  {
    icon: Award,
    title: "Certifications internationales",
    desc: "ISO 9001 & ISO 27001 actives — qualité de service et sécurité des données garanties pour tous nos partenaires gouvernementaux.",
  },
  {
    icon: Search,
    title: "Transparence totale",
    desc: "Visibilité complète sur l'ensemble des transactions numériques — les gouvernements identifient les fuites et réduisent la dette publique.",
  },
  {
    icon: CalendarDays,
    title: "Fondée en 1986",
    desc: "Quatre décennies d'expertise en gouvernance fiscale — réseau mondial Europe, Asie, Afrique avec un département R&D florissant.",
  },
  {
    icon: ShieldCheck,
    title: "Souveraineté numérique",
    desc: "Hébergement souverain, données sous juridiction nationale — les États affirment leur pleine souveraineté sur leurs flux économiques.",
  },
];

const SOLUTIONS_CARDS = [
  {
    icon: Waves,
    label: "Maritime Surveillance Grid",
    tag: "Défense & Sécurité",
    href: "/solutions/maritime",
    image: "/maritime-surveillance-grid.png",
    accent: "from-blue-600 to-cyan-600",
    border: "border-blue-500/30",
    desc: "Architecture multi-capteurs distribuée pour une surveillance maritime permanente, sans angles morts, en couverture 96 km.",
    metric: "96 km",
    metricLabel: "Portée radar",
  },
  {
    icon: BarChart2,
    label: "Revenue Intelligence Platform",
    tag: "Fiscalité & Recettes",
    href: "/solutions/revenues",
    image: "/digital-economy.png",
    accent: "from-emerald-600 to-teal-600",
    border: "border-emerald-500/30",
    desc: "Collecte numérique, supervision temps réel et détection intelligente de la fraude fiscale pour les administrations nationales.",
    metric: "+35%",
    metricLabel: "Taux de recouvrement",
  },
];

const TESTIMONIALS = [
  {
    quote: "Mazen a transformé notre capacité de supervision fiscale. En 12 mois, nous avons observé une hausse de 60% des recettes sur les opérateurs télécoms — des chiffres qui dépassent toutes nos projections initiales.",
    name: "Directeur Général",
    role: "Direction Générale des Douanes et Accises, RDC",
    stars: 5,
  },
  {
    quote: "L'approche ETL-Certification® nous a permis d'atteindre une visibilité totale sur les transactions mobile money. La plateforme est robuste, fiable et l'équipe d'intégration a été exemplaire.",
    name: "Ministre délégué",
    role: "Ministère des Finances, République du Mali",
    stars: 5,
  },
  {
    quote: "La qualité technique de la solution, combinée à la rigueur du transfert de compétences aux équipes nationales, fait de Mazen un partenaire stratégique de premier plan pour la souveraineté fiscale.",
    name: "Directeur des Systèmes d'Information",
    role: "Autorité Nationale des Recettes, Sierra Leone",
    stars: 5,
  },
];

const ROTATING_WORDS = ["Fiscale", "Maritime", "Num\u00e9rique", "Publique"];

const AFRICA_DEPLOYMENTS = [
  { id: "mali", country: "Mali", flag: "\uD83C\uDDF2\uD83C\uDDF1", x: 195, y: 212, color: "#10b981", caseIdx: 1 },
  { id: "sierra", country: "Sierra Leone", flag: "\uD83C\uDDF8\uD83C\uDDF1", x: 118, y: 316, color: "#f59e0b", caseIdx: 3 },
  { id: "rdc", country: "RDC", flag: "\uD83C\uDDE8\uD83C\uDDE9", x: 328, y: 448, color: "#3b82f6", caseIdx: 0 },
  { id: "burundi", country: "Burundi", flag: "\uD83C\uDDE7\uD83C\uDDEE", x: 410, y: 454, color: "#ef4444", caseIdx: 2 },
];

const RESULT_BARS = [
  { country: "Sierra Leone", label: "+552%", value: 552, color: "#f59e0b" },
  { country: "RDC", label: "+60%", value: 60, color: "#3b82f6" },
  { country: "Mali", label: "100% visibilit\u00e9", value: 100, color: "#10b981" },
  { country: "Burundi", label: "8 op\u00e9rateurs", value: 40, color: "#ef4444" },
];

/* ─── SUB-COMPOSANTS ──────────────────────────────────────────── */

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function SectionTag({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] mb-4 ${light ? "text-amber-400" : "text-blue-600"}`}>
      <span className={`w-7 h-px ${light ? "bg-amber-400" : "bg-blue-600"}`} />
      {children}
    </span>
  );
}

/* ─── SCROLL PROGRESS BAR ───────────────────────────────────────── */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[200] origin-left pointer-events-none"
      style={{ scaleX: scrollYProgress, background: "linear-gradient(to right, #f59e0b, #fcd34d)" }}
    />
  );
}

/* ─── ROTATING WORD ─────────────────────────────────────────────── */
function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING_WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-block relative overflow-hidden" style={{ minWidth: "16rem", verticalAlign: "bottom" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent inline-block"
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-transparent" />
    </span>
  );
}

/* ─── ANIMATED COUNTER ──────────────────────────────────────────── */
function AnimatedNumber({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const m = value.match(/^(\+?\$?)(\d+\.?\d*)(.*)/);
  const prefix = m ? m[1] : "";
  const num = m ? parseFloat(m[2]) : 0;
  const suffix = m ? m[3] : value;
  const isYear = num >= 1900 && num <= 2100;
  const [count, setCount] = useState(isYear ? num : 0);
  useEffect(() => {
    if (!inView || !num || isYear) return;
    const t0 = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - t0) / 1800, 1);
      setCount(Math.round(num * (1 - Math.pow(1 - p, 3))));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, num, isYear]);
  return (
    <div ref={ref} className="px-6 py-2 text-center first:pl-0 last:pr-0">
      <p className="text-2xl md:text-3xl font-extrabold text-white">
        {num > 0 ? `${prefix}${count}${suffix}` : value}
      </p>
      <p className="text-xs text-blue-300/80 font-semibold mt-0.5">{label}</p>
    </div>
  );
}

/* ─── ANIMATED HORIZONTAL BAR ───────────────────────────────────── */
function AnimatedBar({ value, max, color, label, country }: {
  value: number; max: number; color: string; label: string; country: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="font-bold text-gray-900 text-sm">{country}</span>
        </div>
        <span className="font-extrabold text-sm" style={{ color }}>{label}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${(value / max) * 100}%` } : { width: 0 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

function MiniTrendChart() {
  const d = "M8,112 C40,95 70,88 100,70 C130,52 170,58 196,42 C222,26 252,22 280,14";
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-blue-300/70 font-bold">Trajectoire Recettes</p>
        <span className="text-[10px] text-emerald-300 font-bold">+18.4% trimestriel</span>
      </div>
      <svg viewBox="0 0 288 120" className="w-full h-[84px]">
        <path d={d} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <motion.path
          d={d}
          fill="none"
          stroke="#fde68a"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/* ─── INTERACTIVE AFRICA MAP ─────────────────────────────────────── */
function AfricaMap({ onSelect, selected }: { onSelect: (idx: number) => void; selected: number }) {
  return (
    <div className="relative w-full max-w-[320px] mx-auto select-none">
      <svg viewBox="0 0 520 720" className="w-full" fill="none">
        <path
          d="M185,68 L225,48 L268,42 L312,52 L355,75 L382,125 L398,175 L418,218 L438,268 L454,316 L460,370 L450,418 L425,462 L402,508 L378,558 L350,605 L328,650 L306,685 L278,715 L252,718 L228,698 L206,660 L182,612 L158,562 L138,510 L118,452 L104,395 L96,335 L100,278 L108,222 L126,174 L146,130 L165,94 Z"
          fill="#0f172a" stroke="#1e3a5f" strokeWidth="2"
        />
        <path d="M460,370 L484,345 L510,328 L524,350 L514,378 L488,385 Z" fill="#0f172a" stroke="#1e3a5f" strokeWidth="2" />
        <path d="M478,428 L492,418 L502,448 L497,488 L476,495 L466,468 Z" fill="#0f172a" stroke="#1e3a5f" strokeWidth="1.5" />
        <line x1="100" y1="278" x2="510" y2="278" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="5 10" />
        <line x1="100" y1="370" x2="520" y2="370" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="5 10" />
        <line x1="300" y1="42" x2="300" y2="718" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="5 10" />
        {AFRICA_DEPLOYMENTS.map((dep, i) => (
          <g key={dep.id} onClick={() => onSelect(dep.caseIdx)} style={{ cursor: "pointer" }}>
            <motion.circle
              cx={dep.x} cy={dep.y} r={18}
              fill="none" stroke={dep.color} strokeWidth="1"
              animate={{ opacity: [0.2, 0.65, 0.2], r: [18, 28, 18] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            />
            <circle cx={dep.x} cy={dep.y} r={10}
              fill={selected === dep.caseIdx ? dep.color : "#1e293b"}
              stroke={dep.color} strokeWidth="2.5"
            />
            <text
              x={dep.x + (dep.x > 280 ? 17 : -17)} y={dep.y + 4}
              textAnchor={dep.x > 280 ? "start" : "end"}
              fontSize="9" fontWeight="700"
              fill={selected === dep.caseIdx ? dep.color : "#94a3b8"}
            >
              {dep.country}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-[10px] text-slate-500 text-center mt-1 italic">Cliquez un pays pour les détails</p>
    </div>
  );
}

/* ─── TESTIMONIALS CAROUSEL ──────────────────────────────────────── */
function TestimonialsCarousel({ items }: { items: Array<{ quote: string; name: string; role: string; stars: number }> }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % items.length), 5500);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <div>
      <div className="relative" style={{ minHeight: 290 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm max-w-3xl mx-auto"
          >
            <div className="flex gap-1 mb-5">
              {Array.from({ length: items[active].stars }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed text-base italic mb-8">"{items[active].quote}"</p>
            <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                {items[active].name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-950 text-sm">{items[active].name}</p>
                <p className="text-gray-400 text-xs">{items[active].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-5 mt-8">
        <button
          onClick={() => setActive((i) => (i - 1 + items.length) % items.length)}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-colors"
          aria-label="Précédent"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "w-7 h-2.5 bg-amber-500" : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Témoignage ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setActive((i) => (i + 1) % items.length)}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-colors"
          aria-label="Suivant"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [activeEtl, setActiveEtl] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState("vision");
  const [selectedCountry, setSelectedCountry] = useState(0);
  const { scrollY } = useScroll();
  const heroMediaY = useTransform(scrollY, [0, 700], [0, 120]);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["vision", "solutions", "etlc", "references", "secteurs", "why-us"];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const homeLinks = [
    { href: "#vision", label: "Vision" },
    { href: "#solutions", label: "Solutions" },
    { href: "#etlc", label: "Technologie" },
    { href: "#references", label: "Références" },
    { href: "/news", label: "Actualités" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <ScrollProgressBar />
      <PublicNavbar links={homeLinks} />

      {/* ══════════════════════════════════════════════════════════
          1. HERO — Plein écran, fond sombre executive
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden executive-shell">
        <motion.img
          src="/hero-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.18] pointer-events-none"
          style={{ y: heroMediaY }}
        />
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
        />
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] rounded-full bg-blue-700/15 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(to right, rgba(148,163,184,1) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Large watermark logo */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[44vw] opacity-[0.04] pointer-events-none">
          <img src="/mazen-logo.jpg?v=20260413" alt="" className="w-full object-contain" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
          <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">

            {/* Left — headline */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold bg-amber-500/15 text-amber-300 rounded-full mb-7 border border-amber-500/25 uppercase tracking-[0.22em]">
                  Plateforme institutionnelle certifiée ISO 9001 · ISO 27001
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-7xl font-black text-white leading-[1.0] mb-8 max-w-4xl"
              >
                Souveraineté{" "}
                <RotatingWord />
                <br />
                <span className="text-white/90">de l'État</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-blue-100/80 max-w-2xl leading-relaxed mb-10"
              >
                Depuis 1986, Mazen GovTech Groupe fournit aux États une infrastructure de gouvernance certifiée —
                lecture consolidée des flux fiscaux, détection des anomalies et pilotage exécutif en temps réel.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
                <Link href="/contact">
                  <a className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-7 py-4 rounded-xl transition-all shadow-xl shadow-amber-500/25 text-sm">
                    {t('cta.requestDemo')}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Link>
                <a
                  href="#references"
                  className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-4 rounded-xl hover:bg-white/10 transition-all text-sm"
                >
                  Voir les références terrain
                  <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Scroll cue */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/40" />
                  <span className="text-[10px] font-bold tracking-[0.4em] text-white/35 uppercase">Scroll</span>
                </div>
                <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-white/20 to-transparent" />
                <span className="text-xs text-white/30">4 pays · 15 Mrd$ supervisés</span>
              </motion.div>
            </motion.div>

            {/* Right — Executive panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block min-w-[320px] max-w-[360px]"
            >
              <div className="executive-panel p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0" />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-blue-300/70 mb-1">Synthèse exécutive</p>
                    <h2 className="text-base font-bold text-white">Tableau de bord</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-xs text-amber-300 font-semibold">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { v: "$15 Mrd", l: "Flux supervisés", sub: "Depuis 2009" },
                    { v: "13 Mrd", l: "Tx / jour", sub: "Traitement continu" },
                    { v: "+552%", l: "Hausse record", sub: "Sierra Leone" },
                    { v: "1986", l: "Fondation", sub: "4 décennies" },
                  ].map((s) => (
                    <div key={s.v} className="executive-metric">
                      <div className="text-2xl font-extrabold text-amber-400 mb-0.5">{s.v}</div>
                      <div className="text-white font-semibold text-xs">{s.l}</div>
                      <div className="text-blue-300/60 text-[11px] mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2.5 border-t border-white/10 pt-5">
                  {[
                    "Traçabilité totale des flux fiscaux sensibles",
                    "Réduction des zones d'opacité sectorielles",
                    "Lecture consolidée pour la décision publique",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-xs text-blue-100/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <MiniTrendChart />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bottom bar */}
        <div className="relative border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
              {KEY_STATS.map((stat, i) => (
                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <AnimatedNumber value={stat.value} label={stat.label} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. NOTRE VISION
      ══════════════════════════════════════════════════════════ */}
      <section id="vision" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp}>
                <SectionTag>Notre vision</SectionTag>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-950 leading-tight mb-6">
                L'Excellence au Service de la{" "}
                <span className="text-blue-700">Gouvernance Fiscale</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 text-lg leading-relaxed mb-6">
                MAZEN est une entreprise leader dans le domaine des technologies gouvernementales. Depuis 1986, nous avons
                constitué un réseau de collaborateurs hautement qualifiés basés en <strong className="text-gray-900">Europe, en Asie et en Afrique</strong>,
                avec un département R&D florissant.
              </motion.p>
              <motion.p variants={fadeUp} className="text-gray-500 leading-relaxed mb-8">
                Notre équipe est composée d'ingénieurs exceptionnels diplômés d'universités de renommée mondiale et
                possédant une solide expertise en traitement de données massives, fiscalité numérique et gouvernance publique.
              </motion.p>
              <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4">
                {[
                  { icon: Globe, label: "Présence mondiale", sub: "Europe · Asie · Afrique" },
                  { icon: Search, label: "R&D florissant", sub: "Innovation continue" },
                  { icon: BookOpen, label: "Ingénieurs experts", sub: "Universités mondiales" },
                  { icon: Award, label: "ISO 9001 & 27001", sub: "Qualité & Sécurité" },
                ].map((item) => (
                  <motion.div key={item.label} variants={fadeUp} className="institution-card p-5 flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex-shrink-0">
                      <item.icon className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{item.label}</div>
                      <div className="text-gray-400 text-xs">{item.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Visual panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-3xl p-8 border border-blue-900/50 shadow-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400 mb-4">Notre approche en 3 étapes</p>
                  <div className="space-y-5">
                    {[
                      {
                        n: "01",
                        title: "Le Big Data devient ingérable",
                        text: "De plus en plus de secteurs se numérisent, générant des quantités massives de données cryptées et hétérogènes.",
                        color: "bg-blue-500",
                      },
                      {
                        n: "02",
                        title: "MAZEN certifie la donnée",
                        text: "Notre technologie ETL-Certification® transforme ce Big Data en données structurées, certifiées et fiscalement opposables.",
                        color: "bg-amber-500",
                      },
                      {
                        n: "03",
                        title: "L'État recouvre ses recettes",
                        text: "Les administrations disposent d'une vision complète et fiable pour maximiser la mobilisation des recettes publiques.",
                        color: "bg-emerald-500",
                      },
                    ].map((step, i) => (
                      <div key={step.n} className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-xl ${step.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                          {step.n}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                          <p className="text-blue-200/70 text-xs leading-relaxed">{step.text}</p>
                        </div>
                        {i < 2 && <div className="absolute left-[2.75rem] mt-10 w-px h-6 bg-white/10" />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-amber-400 font-bold text-base">
                      15 milliards de dollars supervisés depuis 2009
                    </p>
                    <p className="text-blue-300/70 text-xs mt-1">Sur les réseaux des opérateurs de 4 pays africains</p>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-5 -right-5 bg-amber-400 text-gray-950 rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-xs font-black uppercase tracking-wider">Certifié</p>
                  <p className="text-lg font-black leading-tight">ISO 9001<br/>ISO 27001</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. NOS SOLUTIONS
      ══════════════════════════════════════════════════════════ */}
      <section id="solutions" className="py-28 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}>
              <SectionTag light>Nos solutions souveraines</SectionTag>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Deux solutions souveraines, <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                une exécution d'excellence
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-300/70 max-w-xl mx-auto">
              Deux plateformes opérationnelles pour les États. ETL-Certification® agit comme moteur technologique commun.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {SOLUTIONS_CARDS.map((sol, i) => (
              <motion.div
                key={sol.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Link href={sol.href}>
                  <a className={`block rounded-3xl border ${sol.border} bg-white/5 hover:bg-white/8 transition-all duration-300 overflow-hidden group h-full`}>
                    {/* Accent bar */}
                    <div className={`h-1 w-full bg-gradient-to-r ${sol.accent}`} />
                    <div className="relative h-52 overflow-hidden border-b border-white/10">
                      <img src={sol.image} alt={sol.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                      <div className="absolute left-5 bottom-4 text-white/90 text-xs font-semibold uppercase tracking-[0.18em]">Solution prioritaire</div>
                    </div>
                    <div className="p-7">
                      <div className="flex items-start justify-between mb-5">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sol.accent} flex items-center justify-center shadow-lg`}>
                          <sol.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 bg-white/8 px-3 py-1 rounded-full border border-white/10">
                          {sol.tag}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-white text-xl mb-3 group-hover:text-amber-300 transition-colors">
                        {sol.label}
                      </h3>
                      <p className="text-blue-200/60 text-sm leading-relaxed mb-6">{sol.desc}</p>
                      <div className="flex items-end justify-between border-t border-white/8 pt-5">
                        <div>
                          <p className="text-3xl font-extrabold text-amber-400">{sol.metric}</p>
                          <p className="text-xs text-blue-300/60">{sol.metricLabel}</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 group-hover:text-amber-300 transition-colors">
                          Découvrir <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. TECHNOLOGIE ETL-C
      ══════════════════════════════════════════════════════════ */}
      <section id="etlc" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
            {/* Left sticky */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:sticky lg:top-28"
            >
              <motion.div variants={fadeUp}>
                <SectionTag>Notre technologie</SectionTag>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl font-extrabold text-gray-950 leading-tight mb-4">
                ETL-Certification<span className="text-blue-700">®</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 leading-relaxed mb-6">
                Déposée et brevetée — la seule technologie certifiée pour la vérification fiscale des données numériques à l'échelle nationale.
              </motion.p>
              <motion.div variants={fadeUp} className="bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl p-6 border border-blue-900/50">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Performance validée</p>
                <p className="text-4xl font-extrabold text-white mb-1">13 Mrd</p>
                <p className="text-blue-300/70 text-sm">transactions traitées et certifiées quotidiennement</p>
                <div className="h-px bg-white/10 my-4" />
                <p className="text-4xl font-extrabold text-amber-400 mb-1">$15 Mrd</p>
                <p className="text-blue-300/70 text-sm">de flux fiscaux supervisés depuis 2009</p>
              </motion.div>
            </motion.div>

            {/* Right — 4 steps */}
            <div className="space-y-4">
              {ETL_PILLARS.map((pillar, i) => (
                <motion.div
                  key={pillar.letter}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.55 }}
                  onClick={() => setActiveEtl(i)}
                  className={`flex gap-5 items-start p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    activeEtl === i
                      ? "border-blue-300 bg-blue-50 shadow-lg -translate-y-0.5"
                      : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-black text-white shadow-lg transition-transform duration-300"
                    style={{ background: pillar.accent, transform: activeEtl === i ? "scale(1.1)" : "scale(1)" }}
                  >
                    {pillar.letter}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: activeEtl === i ? pillar.accent : "#d1d5db" }}>
                        {pillar.step}
                      </span>
                      <div className="h-px flex-1 bg-gray-100" />
                      {activeEtl === i && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: pillar.accent }}>
                          Actif
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold mb-2 transition-colors" style={{ color: activeEtl === i ? pillar.accent : "#030712" }}>
                      {pillar.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{pillar.description}</p>
                    {activeEtl === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-blue-100 overflow-hidden"
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: pillar.accent }}>
                          <ChevronRight className="w-3.5 h-3.5" />
                          Étape {pillar.step} de la chaîne ETL-Certification® — technologie brevetée Mazen GovTech
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-2 p-6 bg-amber-50 rounded-2xl border border-amber-100"
              >
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "En utilisant l'approche ETL-C propriétaire de Mazen, les autorités fiscales peuvent{" "}
                  <strong className="text-gray-900 not-italic">extraire, transformer, charger et certifier</strong>{" "}
                  automatiquement toutes les données transactionnelles — sans travail manuel, sans risque d'erreur."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. RÉFÉRENCES TERRAIN
      ══════════════════════════════════════════════════════════ */}
      <section id="references" className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}><SectionTag>Références terrain</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-4">
              4 déploiements. <br className="hidden md:block" />
              <span className="text-blue-700">Des résultats mesurables.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              Chaque référence est un engagement contractuel avec une administration nationale — et des chiffres vérifiables.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {CASE_STUDIES.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Top accent */}
                <div className="h-1 w-full" style={{ background: c.accent }} />
                {/* Image */}
                {c.img && (
                  <div className="h-44 overflow-hidden">
                    <img src={c.img} alt={c.country} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-2xl">{c.flag}</span>
                        <span className="font-extrabold text-gray-950 text-base">{c.fullName}</span>
                      </div>
                      <span
                        className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ background: c.accent }}
                      >
                        {c.title}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-4xl font-black leading-none" style={{ color: c.accent }}>{c.result}</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-[10ch] ml-auto">{c.resultLabel}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 mb-2">▸ {c.partner}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.details}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Résultats animés + carte interactive */}
          <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6">Hausse des recettes documentée</p>
              {RESULT_BARS.map((b) => (
                <AnimatedBar key={b.country} country={b.country} label={b.label} value={b.value} max={600} color={b.color} />
              ))}
              <p className="text-[11px] text-gray-400 mt-5 italic">* Résultats validés contractuellement avec les administrations partenaires</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 border border-blue-900/40 shadow-xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4 text-center">Carte des déploiements</p>
              <AfricaMap selected={selectedCountry} onSelect={setSelectedCountry} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCountry}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-4 rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{CASE_STUDIES[selectedCountry].flag}</span>
                      <span className="font-bold text-white text-sm">{CASE_STUDIES[selectedCountry].fullName}</span>
                    </div>
                    <span className="text-2xl font-extrabold" style={{ color: CASE_STUDIES[selectedCountry].accent }}>
                      {CASE_STUDIES[selectedCountry].result}
                    </span>
                  </div>
                  <p className="text-blue-300/70 text-xs mt-2 leading-relaxed line-clamp-2">{CASE_STUDIES[selectedCountry].details}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. SECTEURS
      ══════════════════════════════════════════════════════════ */}
      <section id="secteurs" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start"
          >
            <motion.div variants={fadeUp} className="lg:sticky lg:top-28">
              <SectionTag>Couverture sectorielle</SectionTag>
              <h2 className="text-4xl font-extrabold text-gray-950 leading-tight mb-4">
                9 secteurs,<br />
                <span className="text-blue-700">une vision unifiée</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Nos solutions apportent de la transparence et de la traçabilité fiscale à l'ensemble de l'économie numérique moderne — des télécoms au jeu en ligne.
              </p>
              <Link href="/contact">
                <a className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
                  Discuter de votre secteur
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-4">
              {SECTORS_DATA.map((sector, i) => (
                <motion.div
                  key={sector.id}
                  variants={fadeUp}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    {sector.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-sm mb-1 group-hover:text-blue-700 transition-colors">
                      {sector.name}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{sector.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. TRANSFERT TECHNOLOGIQUE
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeUp}><SectionTag light>Notre engagement</SectionTag></motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                Transfert total de<br />
                <span className="text-amber-400">technologie & compétences</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-blue-200/80 text-lg leading-relaxed mb-8">
                Nous assurons un transfert total de notre technologie aux États clients tout en offrant une formation
                complète pour permettre à leurs équipes de réaliser des opérations pleinement autonomes.
              </motion.p>
              <motion.div variants={staggerContainer} className="space-y-4">
                {[
                  { icon: BookOpen, title: "Formation complète", desc: "Programmes adaptés aux équipes gouvernementales — théorie, pratique et certification interne." },
                  { icon: Wrench, title: "Support continu", desc: "Accompagnement technique dédié et maintenance proactive sur toute la durée du contrat." },
                  { icon: Rocket, title: "Autonomie totale", desc: "Vos équipes maîtrisent pleinement la plateforme, sans dépendance technologique externe." },
                  { icon: Lock, title: "Hébergement souverain", desc: "Infrastructure nationale, données sous juridiction de l'État — zéro transfert vers des serveurs étrangers." },
                ].map((item, i) => (
                  <motion.div key={item.title} variants={fadeUp} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/5 hover:bg-white/8 transition-colors">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm mb-1">{item.title}</div>
                      <div className="text-blue-200/60 text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Certifications visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="rounded-3xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-800/30 p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400 mb-6">Certifications actives</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { cert: "ISO 9001", label: "Management de la Qualité", icon: Award },
                    { cert: "ISO 27001", label: "Sécurité de l'Information", icon: ShieldCheck },
                    { cert: "ETL-C®", label: "Brevet propriétaire", icon: Zap },
                    { cert: "Depuis 1986", label: "38 ans d'expertise", icon: CalendarDays },
                  ].map((c) => (
                    <div key={c.cert} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                      <c.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                      <p className="text-lg font-extrabold text-white">{c.cert}</p>
                      <p className="text-xs text-blue-300/70">{c.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-amber-500 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-amber-400/50 blur-2xl" />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-950/70 mb-2 relative">Chiffre clé</p>
                <p className="text-5xl font-black text-gray-950 relative mb-2">+552%</p>
                <p className="text-amber-950/80 font-semibold relative">Hausse maximale observée des recettes publiques</p>
                <p className="text-xs text-amber-950/60 mt-1 relative">National Revenue Authority, Sierra Leone (2023)</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. POURQUOI NOUS
      ══════════════════════════════════════════════════════════ */}
      <section id="why-us" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}><SectionTag>Notre différence</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-4">
              Pourquoi les États nous choisissent
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              Quatre piliers fondent l'excellence de Mazen et la confiance durable de nos partenaires gouvernementaux.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {WHY_US_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-5"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex-shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  <pillar.icon className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-950 mb-2">{pillar.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          9. TÉMOIGNAGES
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp}><SectionTag>Témoignages</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-4">
              La voix de nos partenaires
            </motion.h2>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm font-bold text-gray-700 ml-2">4.9 · Satisfaction des administrations partenaires</span>
            </motion.div>
          </motion.div>

          <TestimonialsCarousel items={TESTIMONIALS} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          10. NEWSLETTER
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-amber-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-400/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-amber-600/30 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-amber-950/70" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-amber-950/70">Bulletin trimestriel</span>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-950">Restez informé de nos avancées</h3>
              <p className="text-amber-950/70 text-sm mt-1">Nouvelles solutions, références terrain, réformes fiscales — 1 publication par trimestre. Sans spam.</p>
            </div>
            {newsletterSent ? (
              <div className="flex items-center gap-3 bg-white/30 rounded-2xl px-6 py-4 border border-white/40">
                <CheckCircle2 className="w-5 h-5 text-gray-950" />
                <span className="font-bold text-gray-950">Inscription confirmée. Merci !</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setNewsletterSent(true); }}
                className="flex gap-3 w-full md:w-auto"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Votre adresse institutionnelle"
                  className="flex-1 md:w-72 px-4 py-3.5 rounded-xl border-0 bg-white/90 text-gray-950 placeholder-gray-400 text-sm font-medium focus:ring-2 focus:ring-gray-950 outline-none"
                />
                <button
                  type="submit"
                  className="bg-gray-950 hover:bg-gray-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm flex items-center gap-2 flex-shrink-0"
                >
                  S'inscrire <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
          <p className="mt-4 text-xs text-amber-950/50 text-center md:text-left">🔒 Aucun spam. Données strictement confidentielles. Désinscription en 1 clic.</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          11. PRE-FOOTER CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-32 bg-gray-950 relative overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-amber-500/10" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-800/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-400 mb-6">
                <span className="w-7 h-px bg-amber-400" />
                L'avenir vous appartient
                <span className="w-7 h-px bg-amber-400" />
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6">
              L'Avenir Fiscal de votre{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Pays
              </span>{" "}
              commence aujourd'hui.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-200/70 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Nos équipes accompagnent les ministères et administrations dans la modernisation de la chaîne de revenus publics —
              de la stratégie au déploiement opérationnel.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <a className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-8 py-4.5 py-[18px] rounded-xl transition-all shadow-xl shadow-amber-500/20 text-base">
                  Planifier une démonstration
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Link>
              <a
                href="mailto:contact@mazen-govtech.com"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-8 py-[18px] rounded-xl hover:bg-white/8 transition-all text-base"
              >
                <Mail className="w-5 h-5" />
                contact@mazen-govtech.com
              </a>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-14 flex flex-wrap justify-center gap-4">
              {[
                "ISO 9001 Certifié",
                "ISO 27001 Certifié",
                "ETL-Certification® Breveté",
                "Fondé en 1986",
                "4 pays · 15 Mrd$ supervisés",
              ].map((tag) => (
                <span key={tag} className="text-xs font-semibold text-white/40 border border-white/10 px-4 py-2 rounded-full">
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ──── NAVIGATION LATÉRALE ──── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3">
        {[
          { id: "vision", label: "Vision" },
          { id: "solutions", label: "Solutions" },
          { id: "etlc", label: "Technologie" },
          { id: "references", label: "Références" },
          { id: "secteurs", label: "Secteurs" },
          { id: "why-us", label: "Différence" },
        ].map((s) => (
          <a key={s.id} href={`#${s.id}`} title={s.label} className="group flex items-center gap-2 justify-end">
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
              activeSection === s.id ? "text-amber-500 opacity-100" : "text-gray-400 opacity-0 group-hover:opacity-100"
            }`}>
              {s.label}
            </span>
            <div className={`rounded-full transition-all duration-300 ${
              activeSection === s.id
                ? "w-3 h-3 bg-amber-500 ring-2 ring-amber-500/30"
                : "w-1.5 h-1.5 bg-gray-300 group-hover:bg-amber-400/60"
            }`} />
          </a>
        ))}
      </div>

      {/* ──── BACK TO TOP ──── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-gray-950 shadow-xl shadow-amber-500/30 flex items-center justify-center transition-colors"
            aria-label="Retour en haut"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <PublicFooter />
    </div>
  );
}

