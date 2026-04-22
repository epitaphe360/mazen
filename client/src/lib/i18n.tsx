import React, { createContext, useContext, useMemo, useState } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

type Translations = Record<string, any>;

const LOCALES: Record<string, Translations> = { en, fr };

type I18nContextValue = {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function lookup(obj: any, path: string): any {
  return path.split(".").reduce((acc: any, k: string) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<string>("fr");
  const translations = useMemo(() => LOCALES[locale] || LOCALES["fr"], [locale]);

  function t(key: string, vars?: Record<string, string | number>) {
    const raw = lookup(translations, key) ?? key;
    if (!vars) return String(raw);
    return Object.keys(vars).reduce((s, k) => s.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(vars[k])), String(raw));
  }

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}

export default I18nContext;
