import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { trpc } from "../lib/trpc";
import { SpotlightCard } from "../design-system";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Loader2,
  AlertTriangle,
  Zap,
  Shield,
  Mail,
  Globe,
  Settings,
  Network,
  Key,
} from "lucide-react";

/* ─── TYPES & CONSTANTS ─────────────────────────────────────── */

type Category = "auth" | "email" | "telecom" | "cyber" | "external" | "general";

const CATEGORY_META: Record<Category, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  auth:     { label: "Authentication",       icon: Key,     color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
  email:    { label: "Email / Messaging",    icon: Mail,    color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  telecom:  { label: "Telecom / DPI",        icon: Network, color: "text-gold-600",   bg: "bg-gold-50 border-gold-200" },
  cyber:    { label: "Cybersecurity",        icon: Shield,  color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200" },
  external: { label: "External APIs",        icon: Globe,   color: "text-rose-600",   bg: "bg-rose-50 border-rose-200" },
  general:  { label: "General",             icon: Settings, color: "text-slate-600",  bg: "bg-slate-50 border-slate-200" },
};

const DEFAULT_CONFIGS = [
  { key: "SUPABASE_URL",               label: "Supabase URL",               category: "auth",     is_secret: false, description: "URL of your Supabase project (https://xxx.supabase.co)" },
  { key: "SUPABASE_ANON_KEY",          label: "Supabase Anon Key",          category: "auth",     is_secret: true,  description: "Public anon key for client-side Supabase SDK" },
  { key: "SUPABASE_SERVICE_ROLE_KEY",  label: "Supabase Service Role Key",  category: "auth",     is_secret: true,  description: "Service role key — server-side only, full DB access" },
  { key: "JWT_SECRET",                 label: "JWT Secret",                 category: "auth",     is_secret: true,  description: "Secret used to sign and verify JWT tokens" },
  { key: "RESEND_API_KEY",             label: "Resend API Key",             category: "email",    is_secret: true,  description: "API key for Resend transactional email service" },
  { key: "OWNER_EMAIL",                label: "Owner / Notification Email", category: "email",    is_secret: false, description: "Email address receiving contact form submissions" },
  { key: "DPI_API_URL",               label: "DPI Platform API URL",       category: "telecom",  is_secret: false, description: "Base URL of the Deep Packet Inspection platform API" },
  { key: "DPI_API_KEY",               label: "DPI Platform API Key",       category: "telecom",  is_secret: true,  description: "Authentication key for DPI platform integration" },
  { key: "SOC_SIEM_URL",              label: "SIEM / SOC API URL",         category: "cyber",    is_secret: false, description: "Base URL of the Security Operations Center SIEM API" },
  { key: "SOC_API_KEY",               label: "SOC API Key",                category: "cyber",    is_secret: true,  description: "Authentication key for SOC/SIEM integration" },
  { key: "INTERPOL_GATEWAY_URL",      label: "Interpol Gateway URL",       category: "cyber",    is_secret: false, description: "URL for Interpol I-24/7 secure communication gateway" },
  { key: "MARITIME_RADAR_API",        label: "Maritime Radar API URL",     category: "external", is_secret: false, description: "API endpoint for maritime surveillance radar network" },
  { key: "MARITIME_RADAR_KEY",        label: "Maritime Radar API Key",     category: "external", is_secret: true,  description: "Authentication key for maritime radar data feed" },
  { key: "MAP_TILES_API_KEY",         label: "Map Tiles API Key",          category: "external", is_secret: true,  description: "API key for map tile service (Mapbox / MapTiler)" },
];

type FormData = {
  key: string;
  label: string;
  value: string;
  description: string;
  category: Category;
  is_secret: boolean;
};

const EMPTY_FORM: FormData = {
  key: "", label: "", value: "", description: "", category: "general", is_secret: false,
};

/* ─── COMPONENT ─────────────────────────────────────────────── */

export default function AdminApiConfig() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState<FormData | null>(null);
  const [revealKeys, setRevealKeys] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<string | null>(null);

  const { data: settings = [], refetch, isLoading } = trpc.settings.list.useQuery();

  const upsertMut = trpc.settings.upsert.useMutation({
    onSuccess: (_, vars) => {
      refetch();
      setShowForm(false);
      setEditRow(null);
      setSaved(vars.key);
      setTimeout(() => setSaved(null), 2500);
    },
  });

  const removeMut = trpc.settings.remove.useMutation({ onSuccess: () => refetch() });
  const testMut = trpc.settings.test.useMutation({
    onSuccess: (res) => {
      setTestResults((prev) => ({ ...prev, [res.key]: res.configured }));
    },
  });

  // Merge default configs with saved settings
  const allRows = DEFAULT_CONFIGS.map((def) => {
    const saved = settings.find((s) => s.key === def.key);
    return saved ?? { ...def, value: "", updated_at: "" };
  });

  // Add any extra rows saved to DB that aren't in defaults
  const extraRows = settings.filter((s) => !DEFAULT_CONFIGS.find((d) => d.key === s.key));
  const rows = [...allRows, ...extraRows];

  const filtered = activeCategory === "all" ? rows : rows.filter((r) => r.category === activeCategory);

  function openEdit(row: typeof rows[0]) {
    setEditRow({
      key: row.key,
      label: row.label,
      value: row.value,
      description: row.description,
      category: row.category as Category,
      is_secret: row.is_secret,
    });
    setShowForm(true);
  }

  function openNew() {
    setEditRow(EMPTY_FORM);
    setShowForm(true);
  }

  function toggleReveal(key: string) {
    setRevealKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editRow) return;
    upsertMut.mutate(editRow);
  }

  const categories = Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Key className="w-6 h-6 text-gold-500" /> API Configuration
            </h1>
            <p className="text-gray-500 dark:text-navy-400 mt-1">
              Manage all external service integrations and API credentials. Secret values are masked in the UI.
            </p>
          </div>
          <button onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" /> Add config
          </button>
        </div>

        {/* Save toast */}
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Configuration <code className="font-bold">{saved}</code> saved successfully.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              activeCategory === "all" ? "bg-navy-800 text-white border-navy-700" : "bg-white text-slate-600 border-slate-200 hover:border-navy-300"
            }`}>
            All ({rows.length})
          </button>
          {categories.map(([key, meta]) => {
            const Icon = meta.icon;
            const count = rows.filter((r) => r.category === key).length;
            return (
              <button key={key} onClick={() => setActiveCategory(key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  activeCategory === key
                    ? "bg-navy-800 text-white border-navy-700"
                    : "bg-white text-slate-600 border-slate-200 hover:border-navy-300"
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Config table */}
        <SpotlightCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-navy-700 bg-gray-50 dark:bg-navy-800/50">
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-navy-300">Key</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-navy-300">Label</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-navy-300">Category</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-navy-300">Value</th>
                  <th className="px-5 py-3.5 text-left font-semibold text-gray-600 dark:text-navy-300">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold text-gray-600 dark:text-navy-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400">No configurations in this category.</td>
                  </tr>
                ) : filtered.map((row, i) => {
                  const catMeta = CATEGORY_META[row.category as Category] ?? CATEGORY_META.general;
                  const CatIcon = catMeta.icon;
                  const isConfigured = row.value && row.value.trim().length > 0;
                  const revealed = revealKeys.has(row.key);
                  const testResult = testResults[row.key];
                  const isDefault = DEFAULT_CONFIGS.find((d) => d.key === row.key);

                  return (
                    <tr key={row.key} className={`border-b border-gray-50 dark:border-navy-800 ${i % 2 === 0 ? "" : "bg-gray-50/40 dark:bg-navy-900/20"} hover:bg-navy-50/50 dark:hover:bg-navy-800/30 transition-colors`}>
                      {/* Key */}
                      <td className="px-5 py-3.5">
                        <code className="text-xs font-mono font-bold text-navy-700 dark:text-gold-400 bg-navy-50 dark:bg-navy-800 px-2 py-0.5 rounded">
                          {row.key}
                        </code>
                      </td>

                      {/* Label */}
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white text-xs">{row.label}</p>
                          {row.description && (
                            <p className="text-gray-400 dark:text-navy-500 text-[11px] mt-0.5 max-w-xs truncate">{row.description}</p>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold border ${catMeta.bg} ${catMeta.color}`}>
                          <CatIcon className="w-3 h-3" />
                          {catMeta.label}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="px-5 py-3.5">
                        {isConfigured ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-600 dark:text-navy-300 max-w-[180px] truncate">
                              {row.is_secret && !revealed ? "•".repeat(Math.min(row.value.length, 20)) : row.value}
                            </span>
                            {row.is_secret && (
                              <button onClick={() => toggleReveal(row.key)} className="text-gray-400 hover:text-navy-600 transition-colors">
                                {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300 dark:text-navy-600 text-xs italic">Not set</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {testResult !== undefined ? (
                          testResult ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                              <CheckCircle className="w-3.5 h-3.5" /> Configured
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-500 text-xs font-semibold">
                              <XCircle className="w-3.5 h-3.5" /> Not configured
                            </span>
                          )
                        ) : isConfigured ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" /> Set
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" /> Missing
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => testMut.mutate({ key: row.key })}
                            title="Check configuration status"
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors">
                            <Zap className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openEdit(row as FormData)}
                            title="Edit"
                            className="p-1.5 rounded-lg hover:bg-navy-50 text-navy-500 hover:text-navy-700 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {!isDefault && (
                            <button onClick={() => { if (confirm(`Delete "${row.key}"?`)) removeMut.mutate({ key: row.key }); }}
                              title="Delete"
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400 hover:text-rose-600 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SpotlightCard>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total configs", value: rows.length, color: "text-navy-600 dark:text-gold-400" },
            { label: "Configured", value: rows.filter((r) => r.value?.trim().length > 0).length, color: "text-emerald-600" },
            { label: "Missing", value: rows.filter((r) => !r.value?.trim().length).length, color: "text-amber-600" },
            { label: "Secret keys", value: rows.filter((r) => r.is_secret).length, color: "text-blue-600" },
          ].map((s, i) => (
            <SpotlightCard key={i}>
              <div className="p-4 text-center">
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-navy-400 mt-1">{s.label}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* ── MODAL FORM ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && editRow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowForm(false); setEditRow(null); } }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-navy-700 w-full max-w-lg">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-navy-700">
                <h2 className="font-bold text-gray-900 dark:text-white text-base">
                  {editRow.key ? `Edit — ${editRow.key}` : "New API configuration"}
                </h2>
                <button onClick={() => { setShowForm(false); setEditRow(null); }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Key */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-navy-300 mb-1.5">
                    Key <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={editRow.key}
                    onChange={(e) => setEditRow({ ...editRow, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_") })}
                    placeholder="EXAMPLE_API_KEY"
                    required
                    className="w-full font-mono text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Uppercase, digits and underscores only</p>
                </div>

                {/* Label */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-navy-300 mb-1.5">
                    Label <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={editRow.label}
                    onChange={(e) => setEditRow({ ...editRow, label: e.target.value })}
                    placeholder="Human-readable name"
                    required
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
                  />
                </div>

                {/* Value */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-navy-300 mb-1.5">Value</label>
                  <input
                    type={editRow.is_secret ? "password" : "text"}
                    value={editRow.value}
                    onChange={(e) => setEditRow({ ...editRow, value: e.target.value })}
                    placeholder={editRow.is_secret ? "••••••••••••••••" : "https://api.example.com or key value"}
                    className="w-full font-mono text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-navy-300 mb-1.5">Description</label>
                  <input
                    value={editRow.description}
                    onChange={(e) => setEditRow({ ...editRow, description: e.target.value })}
                    placeholder="Purpose of this configuration"
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400"
                  />
                </div>

                {/* Category + Secret */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-navy-300 mb-1.5">Category</label>
                    <select
                      value={editRow.category}
                      onChange={(e) => setEditRow({ ...editRow, category: e.target.value as Category })}
                      className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-400">
                      {Object.entries(CATEGORY_META).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <div className={`relative w-10 h-5 rounded-full transition-colors ${editRow.is_secret ? "bg-navy-700" : "bg-gray-200"}`}
                        onClick={() => setEditRow({ ...editRow, is_secret: !editRow.is_secret })}>
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${editRow.is_secret ? "translate-x-5" : ""}`} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 dark:text-navy-300">Secret / masked</span>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setShowForm(false); setEditRow(null); }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-navy-600 text-sm font-semibold text-gray-600 dark:text-navy-300 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={upsertMut.isPending}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-sm font-bold transition-colors disabled:opacity-60">
                    {upsertMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
