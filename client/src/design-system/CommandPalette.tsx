import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useLocation } from "wouter";
import {
  Home, Compass, BarChart2, Bell, FileText, Newspaper, Mail,
  Users, Waves, Building2, ShieldCheck, Search,
} from "lucide-react";

const ITEMS = [
  { group: "Navigation", icon: Home, label: "Home", path: "/", keywords: "accueil home start" },
  { group: "Navigation", icon: Compass, label: "About", path: "/about", keywords: "qui sommes-nous about" },
  { group: "Navigation", icon: Newspaper, label: "News", path: "/news", keywords: "actualités news press" },
  { group: "Navigation", icon: Mail, label: "Contact", path: "/contact", keywords: "contact reach" },
  { group: "Solutions", icon: Waves, label: "Maritime Sovereignty", path: "/solutions/maritime", keywords: "maritime mer ocean surveillance" },
  { group: "Solutions", icon: BarChart2, label: "Public Revenues", path: "/solutions/revenues", keywords: "fiscal taxes revenues recettes" },
  { group: "Dashboard", icon: BarChart2, label: "Overview", path: "/dashboard", keywords: "dashboard overview kpi" },
  { group: "Dashboard", icon: FileText, label: "Reporting", path: "/dashboard/reporting", keywords: "report reporting" },
  { group: "Dashboard", icon: Building2, label: "Sectors", path: "/dashboard/sectors", keywords: "sector sectors" },
  { group: "Dashboard", icon: Bell, label: "Alerts", path: "/dashboard/alerts", keywords: "alerts alarms" },
  { group: "Admin", icon: Users, label: "Users", path: "/dashboard/users", keywords: "users team members" },
  { group: "Admin", icon: ShieldCheck, label: "Login", path: "/login", keywords: "login signin authentication" },
];

/**
 * CommandPalette — opens with ⌘K / Ctrl+K. Linear/Vercel-style.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function go(path: string) {
    navigate(path);
    setOpen(false);
  }

  if (!open) return null;

  const groups = Array.from(new Set(ITEMS.map((i) => i.group)));

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] px-4 bg-navy-950/60 backdrop-blur-md animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <Command
        loop
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border border-white/10 bg-navy-900/95 backdrop-blur-xl shadow-elev-xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-4 h-4 text-white/60" />
          <Command.Input
            autoFocus
            placeholder="Search pages, solutions, actions…"
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-white/50 border border-white/10">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="px-4 py-8 text-center text-white/50 text-sm">
            No results found.
          </Command.Empty>

          {groups.map((group) => (
            <Command.Group
              key={group}
              heading={group}
              className="text-[10px] uppercase tracking-widest text-white/40 px-3 pt-3 pb-1 [&_[cmdk-group-heading]]:px-2"
            >
              {ITEMS.filter((i) => i.group === group).map((item) => (
                <Command.Item
                  key={item.path}
                  value={`${item.label} ${item.keywords}`}
                  onSelect={() => go(item.path)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/85 cursor-pointer
                             aria-selected:bg-white/10 aria-selected:text-white
                             hover:bg-white/10 transition-colors"
                >
                  <item.icon className="w-4 h-4 text-gold-400" />
                  <span>{item.label}</span>
                  <span className="ml-auto text-[10px] text-white/30 font-mono">{item.path}</span>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>

        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 text-[10px] text-white/40">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded font-mono border border-white/10">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded font-mono border border-white/10">⏎</kbd>
              open
            </span>
          </span>
          <span className="font-mono text-gold-400">Mazen Command</span>
        </div>
      </Command>
    </div>
  );
}
