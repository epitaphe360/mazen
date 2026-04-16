import React, { useState } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

const CATEGORIES = [
  { key: "", label: "Toutes" },
  { key: "innovation", label: "Innovation" },
  { key: "deployment", label: "Déploiement" },
  { key: "trends", label: "Tendances" },
  { key: "events", label: "Événements" },
  { key: "testimonials", label: "Témoignages" },
];

const CATEGORY_BADGE: Record<string, string> = {
  innovation: "badge-blue",
  deployment: "badge-green",
  trends: "badge-yellow",
  events: "badge-blue",
  testimonials: "badge-gray",
};

// Page actualités (sans tRPC ici pour pouvoir être utilisé sans auth)
export default function News() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading } = trpc.news.list.useQuery({
    category: (category as "innovation" | "deployment" | "trends" | "events" | "testimonials") || undefined,
    search: search || undefined,
    limit: 12,
  });

  return (
    <div className="min-h-screen page-atmosphere">
      <PublicNavbar ctaLabel="Demander une présentation" ctaHref="/contact" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="glass-panel p-8 md:p-10 mb-10 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-blue-200/40 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-amber-200/40 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 mb-4">
              <Sparkles className="w-4 h-4" /> Veille institutionnelle
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">Actualités Mazen GovTech Groupe</h1>
            <p className="text-lg text-gray-700 max-w-3xl">
              Restez informé des dernières actualités de Mazen GovTech Groupe et de l'évolution de la technologie de gouvernance à travers le monde.
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="glass-panel p-5 mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-blue-700" /> Filtres éditoriaux
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder="Rechercher un article..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white/90"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  category === cat.key ? "bg-blue-700 text-white border-blue-700" : "bg-white/90 text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
            </div>
          </div>
        </div>

        {/* Articles */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (data?.data ?? []).length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <p className="text-gray-600">Aucun article trouvé.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.data ?? []).map((article: {
              id: number; slug: string; title: string; category: string;
              featured_image_url?: string; author: string; published_at: string;
            }) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <a className="editorial-card flex flex-col group">
                  {article.featured_image_url && (
                    <div className="h-48 rounded-xl overflow-hidden mb-4">
                      <img src={article.featured_image_url} alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  <span className={`badge ${CATEGORY_BADGE[article.category] ?? "badge-gray"} mb-3 w-fit`}>
                    {CATEGORIES.find(c => c.key === article.category)?.label ?? article.category}
                  </span>
                  <h2 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <div className="mt-auto flex items-center text-xs text-gray-500 gap-2 pt-3 border-t border-gray-100">
                    <span>{article.author}</span>
                    <span>·</span>
                    <span>{new Date(article.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 rounded-3xl p-10 md:p-12 text-center text-white shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Suivez nos actualités</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Abonnez-vous à notre newsletter ou suivez nos canaux sur les réseaux sociaux pour ne manquer aucune mise à jour essentielle.
          </p>
          <Link href="/contact">
            <a className="btn-gold">S'abonner à la newsletter</a>
          </Link>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
