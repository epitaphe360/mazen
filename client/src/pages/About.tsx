import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { useTranslation } from "../lib/i18n";
import { Globe, Search, GraduationCap, ShieldCheck } from "lucide-react";
import AuroraBackground from "../design-system/AuroraBackground";
import { SpotlightCard, NumberTicker, TiltCard } from "../design-system";

const TEAM_VALUES = [
  { icon: Globe, title: "Global presence", desc: "Highly skilled teams based in Europe, Asia and Africa" },
  { icon: Search, title: "Research & development", desc: "Continuous innovation capacity serving our partner administrations" },
  { icon: GraduationCap, title: "Top-tier expertise", desc: "Engineers and specialists from leading academic institutions" },
  { icon: ShieldCheck, title: "Operational security", desc: "Secure, redundant architecture fit for critical environments" },
];

const ARCHITECTURE_ITEMS = [
  "File collection & XDR decoding", "Data transformation", "Data loading",
  "Database servers", "File & object storage", "Data analytics",
  "Network operations center", "Secure Inspec VPN tunnel", "Backup & XDR archives",
];

const STATS = [
  { raw: 15, prefix: "$", suffix: "B", label: "Supervised flows", sub: "2009 — present" },
  { raw: 13, suffix: "B", label: "Transactions/day", sub: "Real-time processing" },
  { raw: 4, label: "Countries deployed", sub: "DRC, Mali, Burundi, Sierra Leone" },
  { raw: 1986, label: "Founded", sub: "35+ years of expertise" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen page-atmosphere font-sans">
      <PublicNavbar />
      <section className="relative pt-16 pb-20 bg-navy-950 text-white overflow-hidden">
        <AuroraBackground className="opacity-70" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: "200px" }} />
        <div className="max-w-7xl mx-auto px-6 text-center pt-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-4 block">{t('about.hero.kicker')}</span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">{t('about.hero.title')}</h1>
            <p className="text-xl text-navy-300 max-w-3xl mx-auto leading-relaxed">{t('about.hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-3 block">{t('about.history.kicker')}</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{t('about.history.title')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-base">{t('about.history.p1')}</p>
              <p className="text-gray-700 leading-relaxed mb-4 text-base">{t('about.history.p2')}</p>
              <p className="text-gray-700 leading-relaxed text-base">{t('about.history.p3')}</p>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {TEAM_VALUES.map((v, i) => (
                <motion.div key={v.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <TiltCard className="h-full">
                    <div className="p-6 h-full">
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-navy-100 text-navy-700 mb-3"><v.icon className="w-5 h-5" aria-hidden="true" /></span>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{v.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{v.desc}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-3 block">{t('about.partners.kicker')}</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{t('about.partners.title')}</h2>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto">{t('about.partners.description')}</p>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm inline-block mb-12">
              <img src="/partners.png" alt="Mazen partners" className="max-h-28 mx-auto object-contain" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s, i) => (
                <motion.div key={s.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <SpotlightCard>
                    <div className="p-6 text-center">
                      <div className="text-3xl font-extrabold text-gold-500 mb-1 tabular-nums">{s.prefix ?? ""}<NumberTicker value={s.raw} />{s.suffix ?? ""}</div>
                      <div className="font-semibold text-gray-800 text-sm">{s.label}</div>
                      <div className="text-gray-400 text-xs mt-1">{s.sub}</div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-3 block">Infrastructure</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Mazen Gov Platform Architecture</h2>
              <p className="text-gray-600 leading-relaxed mb-8">Our infrastructure is built on a secure, redundant architecture using VPN tunnels, enterprise-grade firewalls, distributed XDR processing servers and replicated databases.</p>
              <div className="space-y-3">
                {ARCHITECTURE_ITEMS.map((item, i) => (
                  <motion.div key={item} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-navy-200 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-navy-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</div>
                    <span className="text-gray-700 text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6">
                <img src="/mazen-logo.jpg?v=20260413" alt="Mazen Gov Platform" className="w-32 h-32 object-contain mx-auto mb-4" />
                <h3 className="text-center font-bold text-gray-900 mb-2">{t('about.platform.title')}</h3>
                <p className="text-center text-gray-500 text-sm">{t('about.platform.subtitle')}</p>
              </div>
              <img src="/tech-transfer.png" alt="Technology transfer" className="w-full rounded-2xl shadow-lg" />
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-navy-950 relative overflow-hidden text-white text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,_rgba(212,175,55,0.12),_transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
        <div className="max-w-3xl mx-auto px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-4 block">Partnership</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Let's work together</h2>
            <p className="text-navy-300 mb-8 text-lg">Discover how Mazen GovTech Group can transform your country's public revenues.</p>
            <Link href="/contact">
              <a className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-gold-500/20">
                {t('cta.contact')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </Link>
          </motion.div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}