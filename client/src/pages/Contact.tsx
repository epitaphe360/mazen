import React, { useState } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import { SECTORS_DATA } from "@shared/types";

const COUNTRIES = [
  "France", "Maroc", "Sénégal", "Côte d'Ivoire", "Tunisie", "Algérie", "Mali", "Cameroun",
  "Congo", "Gabon", "Madagascar", "Burkina Faso", "Niger", "Togo", "Bénin", "Guinée",
  "Mauritanie", "Rwanda", "Éthiopie", "Kenya", "Nigéria", "Ghana", "Afrique du Sud",
  "Autre"
];

export default function Contact() {
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
    if (!form.accept_terms) { setError("Vous devez accepter les conditions"); return; }
    submitMutation.mutate({ ...form, accept_terms: true });
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Message envoyé !</h1>
          <p className="text-gray-600 mb-6">Votre demande a bien été reçue. Notre équipe vous répondra sous 48h.</p>
          <Link href="/"><a className="btn-primary">Retour à l'accueil</a></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><a className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-black">M</div>
            <span className="font-bold text-gray-900">Mazen <span className="text-blue-700">GovTech</span></span>
          </a></Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Côté gauche — Info */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Prêt à transformer vos recettes publiques ?</h1>
            <p className="text-lg text-gray-600 mb-8">
              Contactez-nous. Notre équipe est à votre disposition pour vous accompagner dans votre transformation numérique et l'optimisation de vos recettes publiques.
            </p>
            <div className="space-y-4">
              {[
                { icon: "📧", title: "Envoyez-nous un courriel", desc: "Adressez-nous vos questions ou demandes d'information. Notre équipe s'engage à vous répondre rapidement.", action: "contact@mazen-govtech.com" },
                { icon: "📅", title: "Planifiez une démonstration", desc: "Découvrez nos solutions en action. Réservez une session personnalisée avec nos experts." },
                { icon: "🌐", title: "Explorez nos solutions", desc: "Nos certifications ISO 9001 et ISO 27001 garantissent la plus haute qualité de service." },
              ].map(item => (
                <div key={item.title} className="card flex gap-4">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                    {item.action && <a href={`mailto:${item.action}`} className="text-blue-600 text-sm font-medium hover:underline">{item.action}</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <div className="card shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Formulaire de contact</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Jean Dupont"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="vous@gouvernement.gov"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                <select required value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">Sélectionnez votre pays</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secteur d'intérêt *</label>
                <select required value={form.sector_of_interest} onChange={e => setForm(p => ({ ...p, sector_of_interest: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="">Sélectionnez un secteur</option>
                  {SECTORS_DATA.map(s => <option key={s.id} value={s.name}>{s.icon} {s.name}</option>)}
                  <option value="Tous les secteurs">Tous les secteurs</option>
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
                      {type === "demo" ? "Démo" : type === "information" ? "Information" : "Partenariat"}
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
                  J'accepte que mes données soient traitées pour répondre à ma demande. *
                </label>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full btn-primary justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? "Envoi en cours..." : "Envoyer ma demande"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
