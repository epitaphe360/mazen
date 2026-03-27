import React from "react";
import { useParams, Link } from "wouter";
import { trpc } from "../lib/trpc";

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  innovation: { label: "Innovation", color: "bg-purple-100 text-purple-800" },
  deployment: { label: "Déploiement", color: "bg-blue-100 text-blue-800" },
  trends: { label: "Tendances", color: "bg-orange-100 text-orange-800" },
  events: { label: "Événements", color: "bg-green-100 text-green-800" },
  testimonials: { label: "Témoignages", color: "bg-yellow-100 text-yellow-800" },
};

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, isError } = trpc.news.getBySlug.useQuery({ slug: slug ?? "" }, { enabled: !!slug });

  const { data: relatedData } = trpc.news.list.useQuery({ limit: 3, page: 1 });
  const related = (relatedData?.data ?? []).filter(a => a.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">📭</p>
        <h1 className="text-2xl font-bold text-gray-900">Article introuvable</h1>
        <p className="text-gray-500">Cet article n'existe pas ou a été supprimé.</p>
        <Link href="/news" className="btn-primary">← Retour aux actualités</Link>
      </div>
    );
  }

  const catCfg = CATEGORY_CONFIG[article.category] ?? { label: article.category, color: "bg-gray-100 text-gray-700" };
  const publishedDate = new Date(article.published_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar simple */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/mazen-logo.svg" alt="Mazen GovTech Groupe" className="h-9 w-auto object-contain" />
            <span className="font-bold text-govblue hidden sm:block">Mazen GovTech Groupe</span>
          </Link>
          <Link href="/news" className="text-sm text-govblue hover:underline font-medium flex items-center gap-1">
            ← Toutes les actualités
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Catégorie */}
        <div className="mb-5">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${catCfg.color}`}>
            {catCfg.label}
          </span>
        </div>

        {/* Titre */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>

        {/* Méta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          <span className="flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-full bg-govblue flex items-center justify-center text-white text-xs font-bold">
              {article.author?.charAt(0).toUpperCase() ?? "M"}
            </span>
            {article.author ?? "Mazen GovTech Groupe"}
          </span>
          <span>·</span>
          <time dateTime={article.published_at}>{publishedDate}</time>
          {article.read_time != null && (
            <>
              <span>·</span>
              <span>⏱ {article.read_time} min de lecture</span>
            </>
          )}
        </div>

        {/* Image principale */}
        {article.featured_image_url && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-md aspect-video bg-gray-200">
            <img
              src={article.featured_image_url as string}
              alt={article.title as string}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Contenu */}
        <article className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          {((article.content ?? "") as string).split("\n").map((paragraph: string, i: number) =>
            paragraph.trim() ? (
              <p key={i} className="mb-4 text-gray-700 text-base sm:text-lg leading-7">
                {paragraph}
              </p>
            ) : (
              <div key={i} className="my-2" />
            )
          )}
        </article>

        {/* CTA Newsletter */}
        <div className="mt-12 p-8 bg-gradient-to-br from-govblue to-blue-800 rounded-2xl text-white text-center">
          <h3 className="text-xl font-bold mb-2">Ne manquez plus aucune actualité</h3>
          <p className="text-blue-200 mb-5 text-sm">
            Recevez chaque semaine les dernières analyses et rapports de Mazen GovTech Groupe directement dans votre boîte mail.
          </p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-govgold"
            />
            <button type="submit" className="px-5 py-2 bg-govgold text-white font-semibold rounded-lg text-sm hover:bg-yellow-500 transition-colors whitespace-nowrap">
              S'abonner
            </button>
          </form>
        </div>

        {/* Articles connexes */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Articles connexes</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map(rel => {
                const relCfg = CATEGORY_CONFIG[rel.category] ?? { label: rel.category, color: "bg-gray-100 text-gray-700" };
                return (
                  <Link key={rel.id} href={`/news/${rel.slug}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {rel.featured_image_url && (
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img src={rel.featured_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${relCfg.color}`}>{relCfg.label}</span>
                      <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-govblue transition-colors">
                        {rel.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(rel.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer simple */}
      <footer className="mt-16 border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Mazen GovTech Groupe — Tous droits réservés
      </footer>
    </div>
  );
}
