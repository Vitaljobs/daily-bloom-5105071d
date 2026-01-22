import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { translations, Language } from "@/lib/translations";

type Translations = typeof translations.nl | typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("nl");

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "nl" ? "en" : "nl"));
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Helper to interpolate variables in translation strings
export const interpolate = (str: string, vars: Record<string, string | number>): string => {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value)),
    str
  );
};
