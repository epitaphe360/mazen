import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { useTranslation } from "../lib/i18n";

const CASES = [
  {
    id: 1,
    num: "01",
    country: "DEMOCRATIC REPUBLIC OF CONGO",
    shortName: "DRC",
    flag: "🇨🇩",
    title: "Telecommunications Taxes",
    img: "/case-rdc.svg",
    partner: "General Directorate of Customs and Excise (DGDA)",
    ministry: "DGDA",
    result: "+60%",
    resultLabel: "in excise & VAT after 1 year of operation",
    color: "blue",
    tags: ["Telecommunications", "Excise", "VAT"],
    details: [
      "Contract signed with the General Directorate of Customs and Excise (DGDA)",
      "Telecommunications services subject to excise duties, VAT and other levies",
      "Mobile operators' revenues represent 5% of the country's GDP",
      "60% increase in excise and VAT after 1 year of operation",
    ],
  },
  {
    id: 2,
    num: "02",
    country: "MALI",
    shortName: "Mali",
    flag: "🇲🇱",
    title: "Mobile Money",
    img: "/case-mali.svg",
    partner: "Ministry of Finance",
    ministry: "Ministry of Finance",
    result: "100%",
    resultLabel: "visibility on mobile money transactions",
    color: "green",
    tags: ["Mobile Money", "Digital Transactions"],
    details: [
      "Processing and analysis of mobile money transaction metadata",
      "Production of detailed reports on activities and tax liabilities",
      "Supervision of billions of daily transactions",
      "Full transparency over the national mobile money ecosystem",
    ],
  },
  {
    id: 3,
    num: "03",
    country: "BURUNDI",
    shortName: "Burundi",
    flag: "🇧🇮",
    title: "Royalties on Gambling and Betting",
    img: "/case-burundi.svg",
    partner: "Ministry of Finance & Ministry of Commerce, Transport, Industry and Tourism",
    ministry: "Min. Finance + Min. Commerce",
    result: "8",
    resultLabel: "licensed operators under Mazen supervision",
    color: "red",
    tags: ["Gambling", "Online Betting", "Royalties"],
    details: [
      "Contract signed with the Ministry of Finance and the Ministry of Commerce, Transport, Industry and Tourism",
      "Gambling and betting services subject to royalties",
      "Only online gambling is authorized in the country",
      "Number of licensed operators: 8",
      "Contract signed: January 2024 — Installation end: March 2024",
    ],
  },
  {
    id: 4,
    num: "04",
    country: "SIERRA LEONE",
    shortName: "Sierra Leone",
    flag: "🇸🇱",
    title: "Telecommunications Taxes",
    img: "/case-sierra-leone.svg",
    partner: "NRA — National Revenue Authority (BOT Agreement)",
    ministry: "NRA & Ministry of Finance",
    result: "552%",
    resultLabel: "maximum increase in national revenues",
    color: "amber",
    tags: ["Telecommunications", "Mobile Money", "Betting", "BOT Agreement"],
    details: [
      "In April 2023, the Ministry of Finance and the National Revenue Authority (NRA) of Sierra Leone signed a build-operate-transfer (BOT) agreement with N-SOFT",
      "This partnership aims to increase national revenues in the telecommunications, mobile money and betting sectors",
      "After one year of operation, telecommunications revenues saw a historic increase",
      "First government BOT agreement for a GovTech solution in West Africa",
    ],
  },
];

const colorMap: Record<string, { border: string; bg: string; badge: string; stat: string; tag: string }> = {
  blue: { border: "border-blue-500", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-800", stat: "text-blue-700", tag: "bg-blue-100 text-blue-700" },
  green: { border: "border-green-500", bg: "bg-green-50", badge: "bg-green-100 text-green-800", stat: "text-green-700", tag: "bg-green-100 text-green-700" },
  red: { border: "border-red-500", bg: "bg-red-50", badge: "bg-red-100 text-red-800", stat: "text-red-700", tag: "bg-red-100 text-red-700" },
  amber: { border: "border-amber-500", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-800", stat: "text-amber-700", tag: "bg-amber-100 text-amber-700" },
};

export default function CaseStudies() {
  const { t } = useTranslation();
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="min-h-screen page-atmosphere font-sans">
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-16 pb-16 bg-gradient-to-br from-blue-950 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 block">{t('case.kicker')}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('case.title')}</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">{t('case.subtitle')}</p>
          </motion.div>

          {/* Overview cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CASES.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => document.getElementById(`case-${c.id}`)?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="text-3xl block mb-2">{c.flag}</span>
                <div className="text-2xl font-extrabold text-amber-400">{c.result}</div>
                <div className="text-white text-xs font-semibold mt-1">{c.shortName}</div>
                <div className="text-blue-300 text-xs">{c.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <img src="/case-studies-map.png" alt="Mazen GovTech Group deployments map" className="w-full rounded-2xl shadow-lg max-h-80 object-contain" />
          </motion.div>
        </div>
      </section>

      {/* Detailed case studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {CASES.map((c, i) => {
            const col = colorMap[c.color];
            return (
              <motion.div
                key={c.id}
                id={`case-${c.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`rounded-3xl border-2 ${col.border} overflow-hidden shadow-xl`}
              >
                <div className={`${col.bg} p-8 md:p-12`}>
                  <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-5xl">{c.flag}</span>
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('case.itemLabel')} {c.num}</div>
                          <h2 className="text-2xl font-extrabold text-gray-900">{c.country}</h2>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-700 mb-4">{c.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {c.tags.map(tag => (
                          <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full ${col.tag}`}>{tag}</span>
                        ))}
                      </div>

                      <div className={`inline-block rounded-2xl p-6 mb-6 bg-white shadow-sm border ${col.border}`}>
                        <div className={`text-5xl font-extrabold ${col.stat} mb-1`}>{c.result}</div>
                        <div className="text-gray-600 text-sm font-medium">{c.resultLabel}</div>
                      </div>

                      <p className="text-sm font-semibold text-gray-500 mb-1">{t('case.partnerLabel')}</p>
                      <p className="text-gray-800 font-medium mb-6">{c.partner}</p>

                      <ul className="space-y-3">
                        {c.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${col.stat}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            <span className="text-gray-700 text-sm leading-relaxed">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {c.img ? (
                      <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img src={c.img} alt={c.country} className="w-full h-72 object-cover object-top" />
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center h-72">
                        <span className="text-8xl mb-4">{c.flag}</span>
                        <h3 className="text-xl font-bold text-gray-900 text-center">{c.country}</h3>
                        <p className="text-gray-500 text-sm text-center mt-2">{c.title}</p>
                        <div className={`text-4xl font-extrabold ${col.stat} mt-4`}>{c.result}</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-950 to-indigo-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold mb-4">{t('case.cta.title')}</h2>
            <p className="text-blue-200 mb-8 text-lg">{t('case.cta.subtitle')}</p>
            <Link href="/contact">
              <a className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg">
                {t('cta.requestDemo')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
