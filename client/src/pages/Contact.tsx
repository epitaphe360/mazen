import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import { SECTORS_DATA } from "@shared/types";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { CalendarClock, Globe, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "../lib/i18n";
import AuroraBackground from "../design-system/AuroraBackground";
import { SpotlightCard } from "../design-system";

const COUNTRIES = [
  "France", "Morocco", "Senegal", "Ivory Coast", "Tunisia", "Algeria", "Mali", "Cameroon",
  "Congo", "Gabon", "Madagascar", "Burkina Faso", "Niger", "Togo", "Benin", "Guinea",
  "Mauritania", "Rwanda", "Ethiopia", "Kenya", "Nigeria", "Ghana", "South Africa",
  "Other"
];

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "", email: "", country: "", sector_of_interest: "",
    request_type: "demo" as "demo" | "information" | "partnership",
    message: "", accept_terms: false,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => setSuccess(true),
    onError: (err) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.accept_terms) { setError(t('contact.errors.mustAccept')); return; }
    submitMutation.mutate({ ...form, accept_terms: true });
  }

  if (success) {
    return (
      <div className="min-h-screen page-atmosphere flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6 bg-white rounded-3xl border border-gray-100 shadow-xl py-10">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('contact.success.title')}</h1>
          <p className="text-gray-600 mb-6">{t('contact.success.subtitle')}</p>
          <Link href="/"><a className="btn-primary">{t('contact.success.backToHome')}</a></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-atmosphere">
      <PublicNavbar ctaLabel="Login" ctaHref="/login" />

      {/* ─── Hero ─── */}
      <section className="relative pt-16 pb-16 bg-navy-950 text-white overflow-hidden">
        <AuroraBackground className="opacity-70" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }}
        />
        <div className="max-w-7xl mx-auto px-6 pt-12 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-400 font-bold mb-3">{t('contact.hero.kicker')}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">{t('contact.hero.title')}</h1>
            <p className="text-navy-300 max-w-3xl">{t('contact.hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Côté gauche — Info */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{t('contact.info.title')}</h2>
            <p className="text-lg text-gray-700 mb-8">{t('contact.info.subtitle')}</p>
            <div className="space-y-4">
              {[
                { icon: Mail, title: t('contact.channels.email.title'), desc: t('contact.channels.email.desc'), action: "contact@mazen-govtech.com" },
                { icon: CalendarClock, title: t('contact.channels.demo.title'), desc: t('contact.channels.demo.desc') },
                { icon: Globe, title: t('contact.channels.solutions.title'), desc: t('contact.channels.solutions.desc') },
              ].map(item => (
                <SpotlightCard key={item.title}>
                  <div className="flex gap-4 p-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-navy-100 text-navy-700 flex-shrink-0">
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                    {item.action && <a href={`mailto:${item.action}`} className="text-gold-600 text-sm font-medium hover:underline">{item.action}</a>}
                  </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-navy-900 text-white border border-navy-700 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gold-400 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{t('contact.security.title')}</p>
                  <p className="text-sm text-navy-300 mt-1">{t('contact.security.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <SpotlightCard>
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('contact.form.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.fullName')}</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder={t('contact.form.fullNamePlaceholder')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.email')}</label>
                  <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder={t('contact.form.emailPlaceholder')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.country')}</label>
                <select required value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">{t('contact.form.selectCountry')}</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.sector')}</label>
                <select required value={form.sector_of_interest} onChange={e => setForm(p => ({ ...p, sector_of_interest: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">{t('contact.form.selectSector')}</option>
                  {SECTORS_DATA.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}
                  <option value="All">{t('contact.form.allSectors')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.typeLabel')}</label>
                <div className="flex gap-3">
                  {(["demo", "information", "partnership"] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, request_type: type }))}
                      className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${
                        form.request_type === type ? "bg-navy-700 text-white border-navy-700" : "bg-white text-gray-700 border-gray-300 hover:border-navy-400"
                      }`}
                    >
                      {type === "demo" ? t('contact.form.types.demo') : type === "information" ? t('contact.form.types.information') : t('contact.form.types.partnership')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.form.messageLabel')}</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder={t('contact.form.messagePlaceholder') || "Describe your project or your questions..."}
                  minLength={10}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" checked={form.accept_terms}
                  onChange={e => setForm(p => ({ ...p, accept_terms: e.target.checked }))}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  {t('contact.form.acceptTerms')}
                </label>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full btn-primary justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? t('contact.form.sending') : t('contact.form.submit')} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </form>
          </div>
          </SpotlightCard>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
