// Google Translate integration for automatic website translation
// This uses Google's translate element which works without API keys

type Language = "en" | "es" | "fr" | "de" | "it" | "pt" | "ja" | "zh" | "ko" | "ar";

const LANGUAGE_CODES: Record<Language, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  pt: "pt",
  ja: "ja",
  zh: "zh-CN",
  ko: "ko",
  ar: "ar",
};

export function initializeGoogleTranslate() {
  // Add Google Translate script to the page
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);

  // Define the callback function
  (window as any).googleTranslateElementInit = function () {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,es,fr,de,it,pt,ja,zh-CN,ko,ar",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };
}

export function translatePage(language: Language) {
  const languageCode = LANGUAGE_CODES[language];
  
  // Get the Google Translate element
  const googleTranslateCombo = document.querySelector(
    ".goog-te-combo"
  ) as HTMLSelectElement;

  if (googleTranslateCombo) {
    // Set the language
    googleTranslateCombo.value = languageCode;

    // Trigger change event to apply translation
    const event = new Event("change", { bubbles: true });
    googleTranslateCombo.dispatchEvent(event);

    // Store the preference
    localStorage.setItem("language", language);
  }
}

export function getCurrentLanguage(): Language {
  const stored = localStorage.getItem("language");
  if (stored && stored in LANGUAGE_CODES) {
    return stored as Language;
  }
  return "en";
}

export function resetTranslation() {
  const googleTranslateCombo = document.querySelector(
    ".goog-te-combo"
  ) as HTMLSelectElement;

  if (googleTranslateCombo) {
    googleTranslateCombo.value = "en";
    const event = new Event("change", { bubbles: true });
    googleTranslateCombo.dispatchEvent(event);
  }

  localStorage.removeItem("language");
}
