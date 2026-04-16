import React, { useState } from "react";
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
  Newspaper,
  Phone,
  Users,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: BarChart3, label: "Vue exécutive", adminOnly: false },
  { href: "/dashboard/reporting", icon: FileText, label: "Rapports", adminOnly: false },
  { href: "/dashboard/transactions", icon: CreditCard, label: "Transactions", adminOnly: false },
  { href: "/dashboard/sectors", icon: Factory, label: "Secteurs", adminOnly: false },
  { href: "/dashboard/alerts", icon: Bell, label: "Alertes", adminOnly: false },
  { href: "/dashboard/news", icon: Newspaper, label: "Actualités internes", adminOnly: true },
  { href: "/dashboard/messages", icon: Mail, label: "Messages", adminOnly: true },
  { href: "/dashboard/users", icon: Users, label: "Utilisateurs", adminOnly: true },
];

const PUBLIC_ITEMS = [
  { href: "/news", icon: Newspaper, label: "Actualités" },
  { href: "/contact", icon: Phone, label: "Contact" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { user, signOut } = useAuthContext();

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-64"} bg-gradient-to-b from-[#0a1c3d] via-[#0f2a5f] to-[#123a7b] text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <img src="/mazen-logo.jpg?v=20260413" alt="Mazen GovTech Groupe" className="h-10 w-auto object-contain flex-shrink-0 brightness-125" />
          {!collapsed && (
            <div>
              <div className="font-extrabold text-sm text-white leading-tight">Mazen GovTech Groupe</div>
              <div className="text-blue-300 text-xs">Pilotage stratégique</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.filter(item => !item.adminOnly || user?.role === "admin").map(item => {
            const active = location === item.href || location.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <a className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-blue-600/90 text-white shadow-md" : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}>
                  <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              </Link>
            );
          })}

          {/* Séparateur liens publics */}
          {!collapsed && (
            <p className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-[0.15em] text-blue-400/70 font-semibold">
              Site public
            </p>
          )}
          {collapsed && <div className="border-t border-white/10 my-2" />}
          {PUBLIC_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-white/10 hover:text-white transition-colors">
                  <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-2 py-4 border-t border-white/10">
          {!collapsed && user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-blue-300 truncate">{user.email}</p>
              <span className={`badge mt-1 ${user.role === "admin" ? "badge-blue" : "badge-gray"}`}>
                {user.role === "admin" ? "Administration" : "Utilisateur"}
              </span>
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-blue-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? "Déplier la barre latérale" : "Réduire la barre latérale"}
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-govblue text-white flex items-center justify-center text-sm font-bold">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
