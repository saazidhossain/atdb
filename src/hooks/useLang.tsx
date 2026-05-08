import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "bn";

const STORAGE_KEY = "atdb_lang";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Inline bilingual: t("English", "বাংলা"). Returns the active locale's string. */
  t: (en: string, bn: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (en) => en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  // Always start as "en" so SSR and the first client render match.
  // Hydrate the stored preference in an effect to avoid hydration mismatch.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "bn" || stored === "en") setLangState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.classList.toggle("lang-bn", lang === "bn");
    }
  }, [lang]);

  const t = (en: string, bn: string) => (lang === "bn" ? bn : en);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
