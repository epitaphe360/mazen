import React, { useState } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><a className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-black">M</div>
            <span className="font-bold text-gray-900">Mazen <span className="text-blue-700">GovTech</span></span>
          </a></Link>
          <Link href="/contact"><a className="btn-primary text-sm py-2">Demander une démo</a></Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Actualités Mazen GovTech</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Restez informé des dernières actualités de Mazen GovTech et de l'évolution de la technologie de gouvernance à travers le monde.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="search"
            placeholder="Rechercher un article..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  category === cat.key ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (data?.data ?? []).length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📰</p>
            <p className="text-gray-500">Aucun article trouvé.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.data ?? []).map((article: {
              id: number; slug: string; title: string; category: string;
              featured_image_url?: string; author: string; published_at: string;
            }) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <a className="card flex flex-col group hover:border-blue-200">
                  {article.featured_image_url && (
                    <div className="h-48 rounded-lg overflow-hidden mb-4">
                      <img src={article.featured_image_url} alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <span className={`badge ${CATEGORY_BADGE[article.category] ?? "badge-gray"} mb-3 w-fit`}>
                    {CATEGORIES.find(c => c.key === article.category)?.label ?? article.category}
                  </span>
                  <h2 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <div className="mt-auto flex items-center text-xs text-gray-400 gap-2">
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
        <div className="mt-16 bg-gradient-to-br from-blue-950 to-indigo-900 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Suivez nos actualités</h2>
          <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
            Abonnez-vous à notre newsletter ou suivez nos canaux sur les réseaux sociaux pour ne manquer aucune mise à jour essentielle.
          </p>
          <Link href="/contact">
            <a className="btn-gold">S'abonner à la newsletter</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
