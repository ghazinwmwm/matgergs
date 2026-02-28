import { createContext, useContext, useState, ReactNode } from "react";
import { ar } from "@/translations/ar";
import { ku } from "@/translations/ku";

export type Lang = "ar" | "ku";

const translations = { ar, ku } as const;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof ar;
  langLabel: string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  t: ar,
  langLabel: "العربية",
});

const LANG_LABELS: Record<Lang, string> = { ar: "العربية", ku: "کوردی" };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("app-lang");
    return (saved === "ku" ? "ku" : "ar") as Lang;
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("app-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], langLabel: LANG_LABELS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
