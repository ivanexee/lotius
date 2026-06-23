import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "es" | "fr" | "de" | "it" | "pt" | "ja" | "zh" | "ko" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  detectedLanguage: Language | null;
  showTranslationPrompt: boolean;
  dismissTranslationPrompt: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES: Record<string, Language> = {
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  pt: "pt",
  ja: "ja",
  "zh-CN": "zh",
  "zh-TW": "zh",
  ko: "ko",
  ar: "ar",
  en: "en",
};

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  ar: "العربية",
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check for stored preference
    const stored = localStorage.getItem("language");
    if (stored && stored in LANGUAGE_NAMES) {
      return stored as Language;
    }
    return "en";
  });

  const [detectedLanguage, setDetectedLanguage] = useState<Language | null>(null);
  const [showTranslationPrompt, setShowTranslationPrompt] = useState(false);

  // Detect system language on mount
  useEffect(() => {
    const systemLang = navigator.language || (navigator as any).userLanguage;
    const baseLang = systemLang.split("-")[0];
    
    // Map system language to supported language
    let detectedLang: Language | null = null;
    
    if (baseLang in SUPPORTED_LANGUAGES) {
      detectedLang = SUPPORTED_LANGUAGES[baseLang];
    } else if (systemLang in SUPPORTED_LANGUAGES) {
      detectedLang = SUPPORTED_LANGUAGES[systemLang];
    }

    if (detectedLang && detectedLang !== language) {
      setDetectedLanguage(detectedLang);
      // Show prompt only if user hasn't dismissed it before
      if (!localStorage.getItem("translation-prompt-dismissed")) {
        setShowTranslationPrompt(true);
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    setShowTranslationPrompt(false);
  };

  const dismissTranslationPrompt = () => {
    setShowTranslationPrompt(false);
    localStorage.setItem("translation-prompt-dismissed", "true");
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        detectedLanguage,
        showTranslationPrompt,
        dismissTranslationPrompt,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export { LANGUAGE_NAMES, SUPPORTED_LANGUAGES };
