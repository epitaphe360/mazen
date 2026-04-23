import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  BarChart3,
  Bell,
  CreditCard,
  Factory,
  FileText,
  LogOut,
  Mail,
  Menu,
  Moon,
  Newspaper,
  Phone,
  Sun,
  Terminal,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── THEME CONTEXT ─────────────────────────────────────────── */
type Theme = "light" | "dark";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() { return useContext(ThemeCtx); }

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("mazen-theme") as Theme) ?? "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try { localStorage.setItem("mazen-theme", theme); } catch {}
  }, [theme]);

  function toggle() { setTheme((t) => (t === "light" ? "dark" : "light")); }

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

/* ─── NAV DATA ──────────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: "/dashboard", icon: BarChart3, label: "Executive view", adminOnly: false },
  { href: "/dashboard/reporting", icon: FileText, label: "Reports", adminOnly: false },
  { href: "/dashboard/transactions", icon: CreditCard, label: "Transactions", adminOnly: false },
  { href: "/dashboard/sectors", icon: Factory, label: "Sectors", adminOnly: false },
  { href: "/dashboard/alerts", icon: Bell, label: "Alerts", adminOnly: false },
  { href: "/dashboard/news", icon: Newspaper, label: "Internal news", adminOnly: true },
  { href: "/dashboard/messages", icon: Mail, label: "Messages", adminOnly: true },
  { href: "/dashboard/users", icon: Users, label: "Users", adminOnly: true },
  { href: "/dashboard/profile", icon: UserCircle, label: "My profile", adminOnly: false },
];

const PUBLIC_ITEMS = [
  { href: "/news", icon: Newspaper, label: "News" },
  { href: "/contact", icon: Phone, label: "Contact" },
];

/* ─── LAYOUT ────────────────────────────────────────────────── */
function DashboardInner({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { user, signOut } = useAuthContext();
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  function openCmdK() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDark ? "bg-navy-950" : "bg-slate-100"}`}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`${collapsed ? "w-16" : "w-64"} flex flex-col transition-all duration-300 flex-shrink-0 ${
          isDark
            ? "bg-navy-900 border-r border-white/8 text-white"
            : "bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <img
            src="/mazen-logo.jpg?v=20260413"
            alt="Mazen GovTech Group"
            className="h-10 w-auto object-contain flex-shrink-0 brightness-125 rounded-lg"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-black text-sm text-white leading-tight whitespace-nowrap">Mazen GovTech Group</div>
              <div className="text-navy-300 text-[11px]">Strategic oversight</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.filter((item) => !item.adminOnly || user?.role === "admin").map((item) => {
            const active = location === item.href || location.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
                      : "text-white/60 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-gold-400" : ""}`} aria-hidden="true" />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />
                  )}
                </a>
              </Link>
            );
          })}

          {!collapsed && (
            <p className="px-3 pt-5 pb-1 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
              Public site
            </p>
          )}
          {collapsed && <div className="border-t border-white/10 my-2" />}
          {PUBLIC_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:bg-white/8 hover:text-white transition-colors">
                  <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div className="px-2 py-4 border-t border-white/10 space-y-1">
          {!collapsed && user && (
            <div className="px-3 py-2 mb-1 rounded-xl bg-white/5">
              <p className="text-xs text-white/50 truncate">{user.email}</p>
              <span
                className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  user.role === "admin"
                    ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
                    : "bg-white/10 text-white/50"
                }`}
              >
                {user.role === "admin" ? "Admin" : "User"}
              </span>
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className={`backdrop-blur-sm border-b px-6 py-3.5 flex items-center justify-between transition-colors duration-300 ${
            isDark
              ? "bg-navy-900/90 border-white/8"
              : "bg-white/90 border-slate-200"
          }`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "text-white/50 hover:bg-white/8 hover:text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            {/* Cmd+K hint */}
            <button
              onClick={openCmdK}
              title="Open command palette (Ctrl+K)"
              className={`hidden sm:flex items-center gap-1.5 text-[11px] rounded-lg px-2.5 py-1.5 border transition-colors ${
                isDark
                  ? "text-white/30 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white/60"
                  : "text-slate-400 border-slate-200 bg-slate-50 hover:bg-slate-100 hover:text-slate-600"
              }`}
            >
              <Terminal className="w-3 h-3" />
              <kbd className="font-mono font-bold">⌘K</kbd>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`p-2 rounded-xl transition-all ${
                isDark
                  ? "bg-gold-500/15 text-gold-400 hover:bg-gold-500/25 border border-gold-500/30"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"
              }`}
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="block">
                    <Sun className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="block">
                    <Moon className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* User avatar */}
            {user && (
              <div className="flex items-center gap-2">
                <Link href="/dashboard/profile">
                  <a
                    title="My profile"
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                      isDark ? "bg-navy-700 text-gold-300 border border-gold-500/30 hover:border-gold-400/60" : "bg-navy-800 text-white hover:opacity-80"
                    }`}
                  >
                    {user.name?.[0]?.toUpperCase() ?? "U"}
                  </a>
                </Link>
                <span
                  className={`text-sm font-semibold hidden sm:block ${
                    isDark ? "text-white/70" : "text-slate-700"
                  }`}
                >
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main
          className={`flex-1 overflow-y-auto p-6 transition-colors duration-300 ${
            isDark ? "bg-navy-950" : "bg-slate-100"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardInner>{children}</DashboardInner>
    </ThemeProvider>
  );
}
import React, { useState } from "react";
