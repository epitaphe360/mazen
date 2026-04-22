import React, { useState } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import { SECTORS_DATA } from "@shared/types";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { CalendarClock, Globe, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "../lib/i18n";

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
        <div className="text-center max-w-md mx-auto px-6 glass-panel py-10">
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
      <PublicNavbar ctaLabel="Connexion" ctaHref="/login" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <section className="glass-panel p-8 md:p-10 mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-56 h-56 rounded-full bg-blue-200/30 blur-3xl" aria-hidden="true" />
          <div className="absolute left-0 bottom-0 w-48 h-48 rounded-full bg-amber-200/35 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-bold mb-3">{t('contact.hero.kicker')}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">{t('contact.hero.title')}</h1>
            <p className="text-gray-700 max-w-3xl">{t('contact.hero.subtitle')}</p>
          </div>
        </section>

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
                <div key={item.title} className="editorial-card flex gap-4">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex-shrink-0">
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                    {item.action && <a href={`mailto:${item.action}`} className="text-blue-600 text-sm font-medium hover:underline">{item.action}</a>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 editorial-card bg-blue-950 text-white border-blue-900">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-300 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{t('contact.security.title')}</p>
                  <p className="text-sm text-blue-100 mt-1">{t('contact.security.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="glass-panel p-6 md:p-8">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de demande *</label>
                <div className="flex gap-3">
                  {(["demo", "information", "partnership"] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, request_type: type }))}
                      className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${
                        form.request_type === type ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {type === "demo" ? t('contact.form.types.demo') : type === "information" ? t('contact.form.types.information') : t('contact.form.types.partnership')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Décrivez votre projet ou vos questions..."
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
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
