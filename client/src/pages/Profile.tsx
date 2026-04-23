import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import { useAuthContext } from "../hooks/useAuthContext";
import { trpc } from "../lib/trpc";
import { useTranslation } from "../lib/i18n";
import { SpotlightCard } from "../design-system";
import { User, Mail, ShieldCheck, Calendar, Key, CheckCircle } from "lucide-react";

export default function Profile() {
  const { t } = useTranslation();
  const { user, resetPasswordForEmail } = useAuthContext();

  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateProfile.mutateAsync({ name: name.trim() });
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    if (!user?.email) return;
    await resetPasswordForEmail(user.email);
    setResetSent(true);
    setTimeout(() => setResetSent(false), 5000);
  }

  const joinedDate = user
    ? new Date((user as { created_at?: string }).created_at ?? Date.now()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">{t("profile.title")}</h1>
          <p className="text-slate-500 dark:text-navy-400 mt-1">{t("profile.subtitle")}</p>
        </div>

        {/* Identity card */}
        <SpotlightCard className="p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-navy-700 flex items-center justify-center text-2xl font-black text-gold-300 border border-gold-500/30 flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-slate-500 dark:text-navy-400 text-sm">{user?.email}</p>
              <span
                className={`inline-block mt-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  user?.role === "admin"
                    ? "bg-gold-500/15 text-gold-600 dark:text-gold-300 border border-gold-500/30"
                    : "bg-navy-100 text-navy-700 dark:bg-navy-700/40 dark:text-navy-300"
                }`}
              >
                {user?.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: Mail, label: t("profile.email"), value: user?.email ?? "—" },
              { icon: ShieldCheck, label: t("profile.role"), value: user?.role ?? "—" },
              { icon: Calendar, label: t("profile.member"), value: joinedDate },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-navy-800/50 border border-slate-100 dark:border-navy-700/40">
                <Icon className="w-4 h-4 mt-0.5 text-navy-600 dark:text-gold-400 flex-shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-navy-500">{label}</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Edit name form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-navy-300 mb-1.5">
                <User className="inline w-4 h-4 mr-1.5 mb-0.5" />{t("profile.name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-600/50 bg-white dark:bg-navy-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/40 focus:border-navy-500 transition-all"
                autoComplete="name"
                required
                minLength={2}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving || name.trim() === user?.name}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-600 text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("profile.saving")}</>
                ) : (
                  t("profile.saveChanges")
                )}
              </button>

              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold"
                >
                  <CheckCircle className="w-4 h-4" />{t("profile.saved")}
                </motion.span>
              )}
            </div>
          </form>
        </SpotlightCard>

        {/* Security card */}
        <SpotlightCard className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-navy-600 dark:text-gold-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">{t("profile.resetPassword")}</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-navy-400">{t("profile.resetPasswordDesc")}</p>
            </div>
            <div className="flex-shrink-0">
              {resetSent ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold whitespace-nowrap"
                >
                  <CheckCircle className="w-4 h-4" />{t("profile.resetSent")}
                </motion.span>
              ) : (
                <button
                  onClick={handleResetPassword}
                  className="px-4 py-2 rounded-xl border border-navy-600/30 text-navy-600 dark:text-navy-300 text-sm font-semibold hover:bg-navy-50 dark:hover:bg-navy-700/40 transition-all"
                >
                  {t("profile.resetPassword")}
                </button>
              )}
            </div>
          </div>
        </SpotlightCard>
      </div>
    </DashboardLayout>
  );
}
