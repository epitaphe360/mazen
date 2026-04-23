import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useLocation } from "wouter";
import { useTranslation } from "../lib/i18n";
import { FloatingLabelInput } from "../design-system";
import AuroraBackground from "../design-system/AuroraBackground";
import { ShieldCheck, Mail, Lock, User, ArrowRight, Terminal } from "lucide-react";

export default function Login() {
  const { t } = useTranslation();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user, loading } = useAuthContext();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    navigate("/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        const { error: err } = (await signInWithEmail(email, password)) as { error: { message: string } | null };
        if (err) setError(err.message);
        else navigate("/dashboard");
      } else {
        const { error: err } = (await signUpWithEmail(email, password, name)) as { error: { message: string } | null };
        if (err) setError(err.message);
        else setError(t("login.verifyEmail"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-navy-950 flex items-center justify-center px-4 overflow-hidden">
      {/* Aurora background blobs */}
      <AuroraBackground className="opacity-60" />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-3 group">
              <img
                src="/mazen-logo.jpg?v=20260413"
                alt="Mazen GovTech Group"
                className="h-12 w-auto object-contain rounded-xl ring-1 ring-white/10 group-hover:ring-gold-400/50 transition-all"
              />
              <span className="text-xl font-black text-white tracking-tight group-hover:text-gold-300 transition-colors">
                Mazen GovTech
              </span>
            </a>
          </Link>
          <p className="text-white/40 mt-2.5 text-sm">{t("login.subtitle")}</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] p-8">
          {/* Mode toggle */}
          <div className="relative flex rounded-xl bg-white/[0.06] border border-white/10 p-1 mb-7">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className={`absolute top-1 bottom-1 rounded-lg bg-white/10 border border-white/20 ${
                mode === "login" ? "left-1 right-1/2" : "left-1/2 right-1"
              }`}
            />
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative flex-1 py-2.5 text-sm font-bold rounded-md transition-colors z-10 ${
                  mode === m ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                {m === "login" ? t("login.labels.login") : t("login.labels.register")}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/10 py-3 text-sm font-semibold text-white/80 hover:text-white transition-all mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("login.oauth.google")}
          </button>

          {/* Divider */}
          <div className="relative my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">{t("login.orEmail")}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {mode === "register" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <FloatingLabelInput
                    label={t("login.form.fullName")}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    icon={User}
                    autoComplete="name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingLabelInput
              label={t("login.form.email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
              autoComplete="email"
            />

            <FloatingLabelInput
              label={t("login.form.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              icon={Lock}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key={error}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3.5 rounded-xl text-sm font-medium flex items-start gap-2.5 ${
                    /verify|check/i.test(error)
                      ? "bg-emerald-500/15 border border-emerald-400/30 text-emerald-300"
                      : "bg-rose-500/15 border border-rose-400/30 text-rose-300"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={submitting}
              className="relative w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 font-bold text-sm overflow-hidden bg-gold-500 hover:bg-gold-400 text-navy-950 transition-all shadow-lg shadow-gold-500/30 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {/* Shimmer on hover */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                  {t("login.loading")}
                </span>
              ) : (
                <>
                  {mode === "login" ? t("login.submit.login") : t("login.submit.register")}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between mt-5 px-1">
          <Link href="/">
            <a className="text-xs text-white/30 hover:text-white/60 transition-colors">
              ← {t("login.backToSite")}
            </a>
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] text-white/20 font-mono">
            <Terminal className="w-3 h-3" />
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white/40 text-[9px]">
              ⌘K
            </kbd>{" "}
            anywhere
          </div>
        </div>
      </motion.div>
    </div>
  );
}
