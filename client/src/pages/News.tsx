import React, { useState } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { useTranslation } from "../lib/i18n";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AuroraBackground from "../design-system/AuroraBackground";
import { SpotlightCard } from "../design-system";

const CATEGORIES = [
  { key: "", label: "All" },
  { key: "innovation", label: "Innovation" },
  { key: "deployment", label: "Deployment" },
  { key: "trends", label: "Trends" },
  { key: "events", label: "Events" },
  { key: "testimonials", label: "Testimonials" },
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
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, isLoading } = trpc.news.list.useQuery({
    category: (category as "innovation" | "deployment" | "trends" | "events" | "testimonials") || undefined,
    search: search || undefined,
    limit: 12,
  });

  return (
    <div className="min-h-screen page-atmosphere">
      <PublicNavbar ctaLabel={t('cta.requestDemo')} ctaHref="/contact" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <section className="-mx-6 relative pt-16 pb-14 bg-navy-950 text-white overflow-hidden mb-10">
          <AuroraBackground className="opacity-60" />
          <div className="max-w-7xl mx-auto px-6 pt-8 relative">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-400 mb-4">
              <Sparkles className="w-4 h-4" /> {t('news.kicker')}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{t('news.title')}</h1>
            <p className="text-lg text-navy-300 max-w-3xl">{t('news.subtitle')}</p>
          </div>
        </section>

        {/* Filtres */}
          <div className="glass-panel p-5 mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-blue-700" /> {t('news.filters.kicker')}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder={t('news.filters.searchPlaceholder')}
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
                  category === cat.key ? "bg-navy-700 text-white border-navy-700" : "bg-white/90 text-gray-700 border-gray-300 hover:border-navy-400"
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
          <div className="text-center py-20">
            <p className="text-gray-600">{t('news.empty')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.data ?? []).map((article: {
              id: number; slug: string; title: string; category: string;
              featured_image_url?: string; author: string; published_at: string;
            }) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <a>
                  <SpotlightCard className="h-full flex flex-col group cursor-pointer">
                    <div className="p-5 flex flex-col h-full">
                    {article.featured_image_url && (
                      <div className="h-48 rounded-xl overflow-hidden mb-4">
                        <img src={article.featured_image_url} alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    <span className={`badge ${CATEGORY_BADGE[article.category] ?? "badge-gray"} mb-3 w-fit`}>
                      {CATEGORIES.find(c => c.key === article.category)?.label ?? article.category}
                    </span>
                    <h2 className="font-bold text-gray-900 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <div className="mt-auto flex items-center text-xs text-gray-500 gap-2 pt-3 border-t border-gray-100">
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{new Date(article.published_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    </div>
                  </SpotlightCard>
                </a>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-navy-950 rounded-3xl p-10 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,_rgba(212,175,55,0.1),_transparent)]" />
          <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('news.cta.title')}</h2>
          <p className="text-navy-300 mb-6 max-w-2xl mx-auto">{t('news.cta.subtitle')}</p>
          <Link href="/contact">
            <a className="btn-gold">{t('news.cta.subscribe')}</a>
          </Link>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
