import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView, type Variants } from "framer-motion";
import { KEY_STATS, SECTORS_DATA } from "@shared/types";
import { Link } from "wouter";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { useTranslation } from "../lib/i18n";
import { MagneticAnchor, SpotlightCard, NumberTicker, TiltCard } from "../design-system";
const SovereignGlobe = lazy(() => import("../design-system/SovereignGlobe"));
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
  Filter,
  Fingerprint,
} from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────── */

const ETL_PILLARS = [
  {
    step: "01",
    letter: "E",
    title: "home.etl.extraction.title",
    accent: "#3b82f6",
    description: "home.etl.extraction.description",
  },
  {
    step: "02",
    letter: "T",
    title: "home.etl.transformation.title",
    accent: "#6366f1",
    description: "home.etl.transformation.description",
  },
  {
    step: "03",
    letter: "L",
    title: "home.etl.loading.title",
    accent: "#8b5cf6",
    description: "home.etl.loading.description",
  },
  {
    step: "04",
    letter: "C",
    title: "home.etl.certification.title",
    accent: "#f59e0b",
    description: "home.etl.certification.description",
  },
];

const CASE_STUDIES = [
  {
    id: 1,
    country: "DRC",
    flag: "🇨🇩",
    fullName: "home.caseStudies.drc.fullName",
    title: "home.caseStudies.drc.title",
    img: "/case-rdc.svg",
    partner: "home.caseStudies.drc.partner",
    result: "+60%",
    resultLabel: "excise & VAT after 1 year",
    accent: "#3b82f6",
    details: "Telecommunications services subject to excise duties, VAT and other levies. Mobile operator revenues represent 5% of GDP.",
  },
  {
    id: 2,
    country: "Mali",
    flag: "🇲🇱",
    fullName: "home.caseStudies.mali.fullName",
    title: "home.caseStudies.mali.title",
    img: "/case-mali.svg",
    partner: "home.caseStudies.mali.partner",
    result: "100%",
    resultLabel: "transaction visibility",
    accent: "#10b981",
    details: "Processing and analysis of mobile money transaction metadata. Production of detailed reports on activities and taxes due.",
  },
  {
    id: 3,
    country: "Burundi",
    flag: "🇧🇮",
    fullName: "home.caseStudies.burundi.fullName",
    title: "home.caseStudies.burundi.title",
    img: "/case-burundi.svg",
    partner: "home.caseStudies.burundi.partner",
    result: "8",
    resultLabel: "certified operators",
    accent: "#ef4444",
    details: "Levies on online gambling and betting. Contract signed January 2024 — Deployment March 2024.",
  },
  {
    id: 4,
    country: "Sierra Leone",
    flag: "🇸🇱",
    fullName: "home.caseStudies.sierraLeone.fullName",
    title: "home.caseStudies.sierraLeone.title",
    img: "/case-sierra-leone.svg",
    partner: "home.caseStudies.sierraLeone.partner",
    result: "552%",
    resultLabel: "maximum revenue increase",
    accent: "#f59e0b",
    details: "BOT agreement signed in April 2023 with the NRA for telecommunications, mobile money and betting.",
  },
];

const WHY_US_PILLARS = [
  {
    icon: Award,
    title: "home.whyUs.certifications.title",
    desc: "home.whyUs.certifications.desc",
  },
  {
    icon: Search,
    title: "home.whyUs.transparency.title",
    desc: "home.whyUs.transparency.desc",
  },
  {
    icon: CalendarDays,
    title: "home.whyUs.founded.title",
    desc: "home.whyUs.founded.desc",
  },
  {
    icon: ShieldCheck,
    title: "home.whyUs.digitalSovereignty.title",
    desc: "home.whyUs.digitalSovereignty.desc",
  },
];

const SOLUTIONS_CARDS = [
  {
    icon: Waves,
    label: "Maritime Surveillance Grid",
    tag: "Defense & Security",
    href: "/solutions/maritime",
    image: "/maritime-surveillance-grid.png",
    accent: "from-blue-600 to-cyan-600",
    border: "border-blue-500/30",
    desc: "Distributed multi-sensor architecture for continuous maritime surveillance with no blind spots and 96 km coverage.",
    metric: "96 km",
    metricLabel: "Radar range",
  },
  {
    icon: BarChart2,
    label: "Revenue Intelligence Platform",
    tag: "Tax & Revenue",
    href: "/solutions/revenues",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop",
    accent: "from-emerald-600 to-teal-600",
    border: "border-emerald-500/30",
    desc: "Digital collection, real-time monitoring and intelligent tax fraud detection for national administrations.",
    metric: "+35%",
    metricLabel: "Recovery rate",
  },
  {
    icon: Filter,
    label: "Deep Packet Inspection",
    tag: "Network & OTT",
    href: "/solutions/dpi",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop",
    accent: "from-indigo-600 to-violet-600",
    border: "border-indigo-500/30",
    desc: "Network traffic intelligence, OTT revenue identification and real-time operator compliance monitoring.",
    metric: "100%",
    metricLabel: "Traffic visibility",
  },
  {
    icon: ShieldCheck,
    label: "Network Cybersecurity",
    tag: "Cyber Defense",
    href: "/solutions/cybersecurity",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&auto=format&fit=crop",
    accent: "from-green-600 to-emerald-600",
    border: "border-green-500/30",
    desc: "SOC operations, SIEM integration and 24/7 incident response for national critical infrastructure protection.",
    metric: "24/7",
    metricLabel: "SOC monitoring",
  },
  {
    icon: Fingerprint,
    label: "Cybercrime Investigation",
    tag: "Forensics & Attribution",
    href: "/solutions/cybercrime",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80&auto=format&fit=crop",
    accent: "from-rose-600 to-pink-600",
    border: "border-rose-500/30",
    desc: "Digital forensics, threat attribution and inter-agency partner network for cybercrime prosecution support.",
    metric: "+80%",
    metricLabel: "Case resolution rate",
  },
];

const TESTIMONIALS = [
  {
    quote: "Mazen transformed our fiscal supervision capability. In 12 months we saw a 60% increase in telecom revenues — figures exceeding all our initial projections.",
    name: "Director General",
    role: "Directorate General of Customs and Excise, DRC",
    stars: 5,
  },
  {
    quote: "The ETL-Certification® approach delivered full visibility on mobile money transactions. The platform is robust, reliable and the integration team was exemplary.",
    name: "Deputy Minister",
    role: "Ministry of Finance, Republic of Mali",
    stars: 5,
  },
  {
    quote: "The technical quality of the solution, combined with rigorous capacity transfer to national teams, makes Mazen a top strategic partner for fiscal sovereignty.",
    name: "IT Director",
    role: "National Revenue Authority, Sierra Leone",
    stars: 5,
  },
];

const ROTATING_WORDS = ["Fiscal", "Maritime", "Digital", "Public"];

// Equirectangular projection: lng[-18..52] -> x[10..570], lat[38..-35] -> y[10..620]
// kx = 8, ky = 8.36, viewBox 0 0 580 620.
const AFRICA_DEPLOYMENTS = [
  // Mali (Bamako 12.65 N, -8.0 W)
  { id: "mali", country: "Mali", flag: "\uD83C\uDDF2\uD83C\uDDF1", x: 90, y: 222, color: "#10b981", caseIdx: 1 },
  // Sierra Leone (Freetown 8.48 N, -13.23 W)
  { id: "sierra", country: "Sierra Leone", flag: "\uD83C\uDDF8\uD83C\uDDF1", x: 48, y: 257, color: "#f59e0b", caseIdx: 3 },
  // DRC (Kinshasa -4.32 S, 15.31 E)
  { id: "rdc", country: "DRC", flag: "\uD83C\uDDE8\uD83C\uDDE9", x: 276, y: 364, color: "#3b82f6", caseIdx: 0 },
  // Burundi (Bujumbura -3.38 S, 29.36 E)
  { id: "burundi", country: "Burundi", flag: "\uD83C\uDDE7\uD83C\uDDEE", x: 389, y: 356, color: "#ef4444", caseIdx: 2 },
];

const RESULT_BARS = [
  { country: "Sierra Leone", label: "+552%", value: 552, color: "#f59e0b" },
  { country: "DRC", label: "+60%", value: 60, color: "#3b82f6" },
  { country: "Mali", label: "100% visibility", value: 100, color: "#10b981" },
  { country: "Burundi", label: "8 certified operators", value: 40, color: "#ef4444" },
];

/* ─── SUB-COMPOSANTS ──────────────────────────────────────────── */

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeUp: Variants = {
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
        <p className="text-[10px] uppercase tracking-[0.2em] text-blue-300/70 font-bold">Revenue trajectory</p>
        <span className="text-[10px] text-emerald-300 font-bold">+18.4% quarterly</span>
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
  const { t } = useTranslation();
  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">
      <svg viewBox="0 0 580 620" className="w-full" fill="none">
        {/* Africa silhouette — traced from real coastline coordinates (equirectangular) */}
        <path
          d="M98,29 L178,21 L237,20 L263,53 L321,59 L403,67 L425,77 L445,81 L470,150 L482,197 L512,232 L555,225 L580,230 L540,290 L531,311 L510,340 L484,361 L480,384 L460,440 L443,493 L425,544 L412,577 L360,605 L320,619 L308,615 L290,580 L280,545 L274,518 L263,460 L263,400 L252,366 L240,340 L232,323 L230,310 L234,292 L200,278 L181,272 L173,273 L152,280 L121,282 L100,278 L66,274 L46,256 L43,246 L30,225 L12,204 L18,190 L24,176 L25,128 L50,90 L75,72 L92,46 Z"
          fill="#0f172a"
          stroke="#1e3a5f"
          strokeWidth="1.8"
        />
        {/* Madagascar */}
        <path
          d="M545,425 L560,440 L555,490 L540,540 L525,545 L520,500 L525,460 L535,430 Z"
          fill="#0f172a"
          stroke="#1e3a5f"
          strokeWidth="1.5"
        />
        {/* Tropic of Cancer / Equator / Tropic of Capricorn */}
        <line x1="10" y1="132" x2="570" y2="132" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="4 8" />
        <line x1="10" y1="327" x2="570" y2="327" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="5 10" />
        <line x1="10" y1="524" x2="570" y2="524" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="4 8" />
        {AFRICA_DEPLOYMENTS.map((dep, i) => (
          <g key={dep.id} onClick={() => onSelect(dep.caseIdx)} style={{ cursor: "pointer" }}>
            <motion.circle
              cx={dep.x} cy={dep.y} r={18}
              fill="none" stroke={dep.color} strokeWidth="1"
              initial={{ opacity: 0.2, r: 18 }}
              animate={{ opacity: [0.2, 0.65, 0.2], r: [18, 28, 18] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            />
            <circle cx={dep.x} cy={dep.y} r={9}
              fill={selected === dep.caseIdx ? dep.color : "#1e293b"}
              stroke={dep.color} strokeWidth="2.5"
            />
            <text
              x={dep.x + (dep.x > 290 ? 16 : -16)} y={dep.y + 4}
              textAnchor={dep.x > 290 ? "start" : "end"}
              fontSize="12" fontWeight="700"
              fill={selected === dep.caseIdx ? dep.color : "#cbd5e1"}
            >
              {dep.country}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-[10px] text-slate-500 text-center mt-1 italic">{t('home.references.clickCountry')}</p>
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
          aria-label="Previous"
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
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setActive((i) => (i + 1) % items.length)}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── ETL+C SECTION (tab-based) ──────────────────────────────── */
function EtlcPinnedSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  // Auto-advance; reset timer on manual click
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % ETL_PILLARS.length), 4000);
    return () => clearInterval(id);
  }, [active]);

  const pillar = ETL_PILLARS[active];

  return (
    <section id="etlc" className="py-24 bg-navy-950 text-white relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-navy-800/60 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gold-900/30 blur-[100px]" />
      </div>
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="text-center mb-12">
          <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-gold-400 mb-2">
            Patented technology
          </span>
          <motion.h2
            className="text-3xl md:text-5xl font-black text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ETL-Certification<span className="text-gold-400">®</span>
          </motion.h2>
        </div>

        {/* Tab buttons */}
        <div className="flex justify-center gap-2 mb-12">
          {ETL_PILLARS.map((p, i) => (
            <button
              key={p.letter}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
                active === i
                  ? ""
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"
              }`}
              style={
                active === i
                  ? { background: `${p.accent}22`, borderColor: `${p.accent}80`, color: p.accent }
                  : {}
              }
            >
              <span className="text-lg font-black" style={{ color: active === i ? p.accent : "inherit" }}>
                {p.letter}
              </span>
              <span className="hidden sm:inline">{t(p.title)}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left: giant letter */}
            <div className="flex flex-col gap-4">
              <div className="relative inline-flex">
                <span
                  className="text-[10rem] font-black leading-none select-none"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: `2px ${pillar.accent}`,
                    textShadow: `0 0 80px ${pillar.accent}55`,
                  }}
                >
                  {pillar.letter}
                </span>
                <span
                  className="absolute inset-0 text-[10rem] font-black leading-none select-none opacity-10"
                  style={{ color: pillar.accent }}
                >
                  {pillar.letter}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-black px-3 py-1 rounded-full text-white"
                  style={{ background: pillar.accent }}
                >
                  {pillar.step}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: pillar.accent }}>
                  {t(pillar.title)}
                </span>
              </div>
              <p className="text-white/60 text-base max-w-sm leading-relaxed">
                {t(pillar.description)}
              </p>
            </div>

            {/* Right: card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${pillar.accent}cc, ${pillar.accent}66)` }}
                >
                  {pillar.letter}
                </div>
                <div>
                  <p className="font-black text-white text-xl mb-1">{t(pillar.title)}</p>
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-full inline-block"
                    style={{ background: `${pillar.accent}22`, color: pillar.accent }}
                  >
                    Step {pillar.step} · ETL-C® Chain
                  </div>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed">{t(pillar.description)}</p>
              {/* Auto-advance progress indicators */}
              <div className="mt-6 flex gap-2">
                {ETL_PILLARS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ background: i === active ? pillar.accent : "rgba(255,255,255,0.1)" }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats bar */}
        <div className="mt-16 pt-10 border-t border-white/10 flex flex-wrap justify-center gap-12">
          <div className="text-center">
            <p className="text-3xl font-black text-gold-400">13 Mrd</p>
            <p className="text-[11px] text-white/40 uppercase tracking-wider mt-1">Tx / day</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-white">$15 Mrd</p>
            <p className="text-[11px] text-white/40 uppercase tracking-wider mt-1">Supervised</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-emerald-400">100%</p>
            <p className="text-[11px] text-white/40 uppercase tracking-wider mt-1">Data integrity</p>
          </div>
        </div>
      </div>
    </section>
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
    { href: "#etlc", label: "Technology" },
    { href: "#references", label: "References" },
    { href: "/news", label: "News" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <ScrollProgressBar />
      <PublicNavbar links={homeLinks} />

        {/* ══════════════════════════════════════════════════════════
          1. HERO — Fullscreen, executive dark background
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
                  {t('home.hero.certBadge')}
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-7xl font-black text-white leading-[1.0] mb-8 max-w-4xl"
              >
                <RotatingWord /> {t('home.hero.sovereigntyLabel')}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-blue-100/80 max-w-2xl leading-relaxed mb-10"
              >
                {t('home.hero.desc')}
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
                <MagneticAnchor href="/contact" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-7 py-4 rounded-xl transition-all shadow-xl shadow-gold-500/30 text-sm glow-ring">
                  {t('cta.requestDemo')}
                  <ArrowRight className="w-4 h-4" />
                </MagneticAnchor>
                <MagneticAnchor
                  href="#references"
                  className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-4 rounded-xl hover:bg-white/10 transition-all text-sm backdrop-blur-sm"
                >
                  {t('home.hero.seeReferences')}
                  <ChevronRight className="w-4 h-4" />
                </MagneticAnchor>
              </motion.div>

              {/* Scroll cue */}
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/40" />
                  <span className="text-[10px] font-bold tracking-[0.4em] text-white/35 uppercase">Scroll</span>
                </div>
                <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-white/20 to-transparent" />
                <span className="text-xs text-white/30">4 countries · $15B supervised</span>
              </motion.div>
            </motion.div>

            {/* Right — Sovereign 3D Globe (signature) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block relative w-[480px] h-[480px]"
            >
              <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl scale-110 pointer-events-none" />
              <Suspense fallback={<div className="w-full h-full rounded-full bg-navy-800/40 animate-pulse" />}>
                <SovereignGlobe height="100%" />
              </Suspense>
              {/* Floating live indicators around the globe */}
              <div className="absolute top-6 -left-4 px-3 py-1.5 rounded-full bg-navy-900/70 backdrop-blur border border-white/10 text-[10px] uppercase tracking-widest text-gold-400 font-bold animate-float">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                Live · 4 deployments
              </div>
              <div className="absolute bottom-10 -right-2 px-3 py-1.5 rounded-full bg-navy-900/70 backdrop-blur border border-white/10 text-[10px] uppercase tracking-widest text-white/70 font-bold animate-float" style={{ animationDelay: '1.2s' }}>
                Africa · Atlantic
              </div>
            </motion.div>

            {/* Hidden legacy panel kept for screen-readers stats — visually hidden */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="sr-only"
            >
              <div className="executive-panel p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0" />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-blue-300/70 mb-1">Executive summary</p>
                    <h2 className="text-base font-bold text-white">Dashboard</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-xs text-amber-300 font-semibold">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { v: "$15B", l: "Supervised flows", sub: "Since 2009" },
                    { v: "13B", l: "Tx / day", sub: "Continuous processing" },
                    { v: "+552%", l: "Record increase", sub: "Sierra Leone" },
                    { v: "2016", l: "Founded", sub: "10 years" },
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
                    "Full traceability of sensitive fiscal flows",
                    "Reduction of sectoral opacity",
                    "Consolidated insights for public decision-making",
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
          2. OUR VISION
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
                <SectionTag>{t('home.vision.tag')}</SectionTag>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-950 leading-tight mb-6">
                {t('home.vision.title')}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 text-lg leading-relaxed mb-6">
                {t('home.vision.p1')}
              </motion.p>
              <motion.p variants={fadeUp} className="text-gray-500 leading-relaxed mb-8">
                {t('home.vision.p2')}
              </motion.p>
              <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4">
                {[
                  { icon: Globe, label: "Global presence", sub: "Europe · Asia · Africa" },
                  { icon: Search, label: "Thriving R&D", sub: "Continuous innovation" },
                  { icon: BookOpen, label: "Expert engineers", sub: "Top-tier universities" },
                  { icon: Award, label: "ISO 9001 & 27001", sub: "Quality & Security" },
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
                <div className="bg-navy-950 rounded-3xl p-8 border border-navy-800/50 shadow-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-400 mb-4">{t('home.vision.approachTag')}</p>
                  <div className="space-y-5">
                    {[
                      { n: "01", titleKey: "home.vision.step1Title", textKey: "home.vision.step1Text", color: "bg-blue-500" },
                      { n: "02", titleKey: "home.vision.step2Title", textKey: "home.vision.step2Text", color: "bg-amber-500" },
                      { n: "03", titleKey: "home.vision.step3Title", textKey: "home.vision.step3Text", color: "bg-emerald-500" },
                    ].map((step, i) => (
                      <div key={step.n} className="flex gap-4 items-start">
                        <div className={`w-8 h-8 rounded-xl ${step.color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                          {step.n}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm mb-1">{t(step.titleKey)}</p>
                          <p className="text-blue-200/70 text-xs leading-relaxed">{t(step.textKey)}</p>
                        </div>
                        {i < 2 && <div className="absolute left-[2.75rem] mt-10 w-px h-6 bg-white/10" />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-amber-400 font-bold text-base">
                      {t('home.vision.supervised')}
                    </p>
                    <p className="text-blue-300/70 text-xs mt-1">{t('home.vision.supervisedSub')}</p>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-5 -right-5 bg-amber-400 text-gray-950 rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-xs font-black uppercase tracking-wider">Certified</p>
                  <p className="text-lg font-black leading-tight">ISO 9001<br/>ISO 27001</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* ══════════════════════════════════════════════════════════
          3. OUR SOLUTIONS
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
              <SectionTag light>{t('home.solutions.tag')}</SectionTag>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {t('home.solutions.title')} <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                {t('home.solutions.titleHighlight')}
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-blue-300/70 max-w-xl mx-auto">
              {t('home.solutions.subtitle')}
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOLUTIONS_CARDS.map((sol, i) => (
              <motion.div
                key={sol.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Link href={sol.href} className={`block rounded-3xl border ${sol.border} bg-white/5 hover:bg-white/8 transition-all duration-300 overflow-hidden group h-full`}>
                  {/* Accent bar */}
                  <div className={`h-1 w-full bg-gradient-to-r ${sol.accent}`} />
                  <div className="relative h-52 overflow-hidden border-b border-white/10">
                    <img src={sol.image} alt={sol.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                    <div className="absolute left-5 bottom-4 text-white/90 text-xs font-semibold uppercase tracking-[0.18em]">{t('home.solutions.prioritySolution')}</div>
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
                        {t('home.solutions.discover')} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. TECHNOLOGIE ETL-C — Pinned Scroll Narrative
      ══════════════════════════════════════════════════════════ */}
      <EtlcPinnedSection />

        {/* ══════════════════════════════════════════════════════════
          5. FIELD REFERENCES
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
            <motion.div variants={fadeUp}><SectionTag>{t('home.references.tag')}</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-4">
              {t('home.references.title')} <br className="hidden md:block" />
              <span className="text-blue-700">{t('home.references.titleHighlight')}</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              {t('home.references.subtitle')}
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
                        <span className="font-extrabold text-gray-950 text-base">{t(c.fullName)}</span>
                      </div>
                      <span
                        className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ background: c.accent }}
                      >
                        {t(c.title)}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-4xl font-black leading-none" style={{ color: c.accent }}>{c.result}</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-[10ch] ml-auto">{c.resultLabel}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 mb-2">▸ {t(c.partner)}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.details}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Animated results + interactive map */}
          <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-gray-100 p-7 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-6">{t('home.references.revenueChart')}</p>
              {RESULT_BARS.map((b) => (
                <AnimatedBar key={b.country} country={b.country} label={b.label} value={b.value} max={600} color={b.color} />
              ))}
              <p className="text-[11px] text-gray-400 mt-5 italic">{t('home.references.chartNote')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 border border-blue-900/40 shadow-xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4 text-center">{t('home.references.deploymentMap')}</p>
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
                      <span className="font-bold text-white text-sm">{t(CASE_STUDIES[selectedCountry].fullName)}</span>
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
          6. SECTORS
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
              <SectionTag>{t('home.sectors.tag')}</SectionTag>
              <h2 className="text-4xl font-extrabold text-gray-950 leading-tight mb-4">
                {t('home.sectors.title')}<br />
                <span className="text-blue-700">{t('home.sectors.titleHighlight')}</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                {t('home.sectors.desc')}
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm">
                {t('home.sectors.cta')}
                <ArrowRight className="w-4 h-4" />
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
              <motion.div variants={fadeUp}><SectionTag light>{t('home.techTransfer.tag')}</SectionTag></motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                {t('home.techTransfer.title')}<br />
                <span className="text-amber-400">{t('home.techTransfer.titleHighlight')}</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-blue-200/80 text-lg leading-relaxed mb-8">
                {t('home.techTransfer.desc')}
              </motion.p>
              <motion.div variants={staggerContainer} className="space-y-4">
                {[
                  { icon: BookOpen, titleKey: "home.techTransfer.trainingTitle", descKey: "home.techTransfer.trainingDesc" },
                  { icon: Wrench, titleKey: "home.techTransfer.supportTitle", descKey: "home.techTransfer.supportDesc" },
                  { icon: Rocket, titleKey: "home.techTransfer.autonomyTitle", descKey: "home.techTransfer.autonomyDesc" },
                  { icon: Lock, titleKey: "home.techTransfer.hostingTitle", descKey: "home.techTransfer.hostingDesc" },
                ].map((item) => (
                  <motion.div key={item.titleKey} variants={fadeUp} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/5 hover:bg-white/8 transition-colors">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm mb-1">{t(item.titleKey)}</div>
                      <div className="text-blue-200/60 text-sm leading-relaxed">{t(item.descKey)}</div>
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
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-400 mb-6">{t('home.techTransfer.certTag')}</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { cert: "ISO 9001", label: "Quality Management", icon: Award },
                    { cert: "ISO 27001", label: "Information Security", icon: ShieldCheck },
                    { cert: "ETL-C®", label: "Proprietary patent", icon: Zap },
                    { cert: "Since 2016", label: "10 years of expertise", icon: CalendarDays },
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
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-950/70 mb-2 relative">{t('home.techTransfer.keyFigure')}</p>
                <p className="text-5xl font-black text-gray-950 relative mb-2">+552%</p>
                <p className="text-amber-950/80 font-semibold relative">{t('home.techTransfer.maxIncrease')}</p>
                <p className="text-xs text-amber-950/60 mt-1 relative">{t('home.techTransfer.sierraRef')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* ══════════════════════════════════════════════════════════
          8. WHY US
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
            <motion.div variants={fadeUp}><SectionTag>{t('home.whyUs.tag')}</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-4">
              {t('home.whyUs.title')}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              {t('home.whyUs.subtitle')}
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
                  <h3 className="text-lg font-extrabold text-gray-950 mb-2">{t(pillar.title)}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{t(pillar.desc)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* ══════════════════════════════════════════════════════════
          9. TESTIMONIALS
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
            <motion.div variants={fadeUp}><SectionTag>{t('home.testimonials.tag')}</SectionTag></motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-4">
              {t('home.testimonials.title')}
            </motion.h2>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm font-bold text-gray-700 ml-2">{t('home.testimonials.rating')}</span>
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
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-amber-950/70">{t('home.newsletter.tag')}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-950">{t('home.newsletter.title')}</h3>
              <p className="text-amber-950/70 text-sm mt-1">{t('home.newsletter.desc')}</p>
            </div>
            {newsletterSent ? (
                <div className="flex items-center gap-3 bg-white/30 rounded-2xl px-6 py-4 border border-white/40">
                <CheckCircle2 className="w-5 h-5 text-gray-950" />
                <span className="font-bold text-gray-950">{t('home.newsletter.confirmed')}</span>
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
                  placeholder={t('home.newsletter.emailPlaceholder')}
                  className="flex-1 md:w-72 px-4 py-3.5 rounded-xl border-0 bg-white/90 text-gray-950 placeholder-gray-400 text-sm font-medium focus:ring-2 focus:ring-gray-950 outline-none"
                />
                <button
                  type="submit"
                  className="bg-gray-950 hover:bg-gray-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm flex items-center gap-2 flex-shrink-0"
                >
                  {t('home.newsletter.subscribe')} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
          <p className="mt-4 text-xs text-amber-950/50 text-center md:text-left">{t('home.newsletter.privacy')}</p>
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
                  {t('home.prefooter.tag')}
                  <span className="w-7 h-px bg-amber-400" />
                </span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6">
                {t('home.prefooter.title')}
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  {t('home.prefooter.titleHighlight')}
                </span>
                {t('home.prefooter.titleEnd')}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-blue-200/70 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                {t('home.prefooter.desc')}
              </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-8 py-[18px] rounded-xl transition-all shadow-xl shadow-amber-500/20 text-base">
                {t('home.prefooter.scheduleDemo')}
                <ArrowRight className="w-5 h-5" />
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
                "ISO 9001 Certified",
                "ISO 27001 Certified",
                "ETL-Certification® Patented",
                "Founded in 2016",
                "4 countries · $15B supervised",
              ].map((tag) => (
                <span key={tag} className="text-xs font-semibold text-white/40 border border-white/10 px-4 py-2 rounded-full">
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ──── SIDE NAVIGATION ──── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3">
        {[
          { id: "vision", label: "Vision" },
          { id: "solutions", label: "Solutions" },
          { id: "etlc", label: "Technology" },
          { id: "references", label: "References" },
          { id: "secteurs", label: "Sectors" },
          { id: "why-us", label: "Why us" },
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
            aria-label="Back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <PublicFooter />
    </div>
  );
}

