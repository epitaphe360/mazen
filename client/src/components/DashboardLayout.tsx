import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthContext } from "../hooks/useAuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "📊", label: "Dashboard", adminOnly: false },
  { href: "/dashboard/reporting", icon: "📈", label: "Reporting", adminOnly: false },
  { href: "/dashboard/sectors", icon: "🏭", label: "Secteurs", adminOnly: false },
  { href: "/dashboard/alerts", icon: "🔔", label: "Alertes", adminOnly: false },
  { href: "/dashboard/news", icon: "✍️", label: "Actualités admin", adminOnly: true },
  { href: "/news", icon: "📰", label: "Actualités", adminOnly: false },
  { href: "/contact", icon: "✉️", label: "Contact", adminOnly: false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { user, signOut } = useAuthContext();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-64"} bg-blue-950 text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black flex-shrink-0">M</div>
          {!collapsed && <span className="font-bold text-sm">Mazen GovTech</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.filter(item => !item.adminOnly || user?.role === "admin").map(item => {
            const active = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <a className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-blue-700 text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"
                }`}>
                  <span className="text-base flex-shrink-0">{item.icon}</span>
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
                {user.role}
              </span>
            </div>
          )}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex-shrink-0">🚪</span>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">{collapsed ? "☰" : "✕"}</span>
          </button>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">
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
