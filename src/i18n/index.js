import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const STORAGE_KEY = "hairally-lang";

function savedLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

// English text lives in the components as default values.
// Hindi is loaded from hi.json only when it is needed.
i18n.use(initReactI18next).init({
  resources: { en: { translation: {} } },
  lng: "en",
  fallbackLng: "en",
  keySeparator: false,
  interpolation: { escapeValue: false },
  returnEmptyString: false,
  react: { useSuspense: false },
});

export async function setLanguage(lang) {
  if (lang === "hi" && !i18n.hasResourceBundle("hi", "translation")) {
    const mod = await import("./hi.json");
    i18n.addResourceBundle("hi", "translation", mod.default, true, true);
  }
  await i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Storage blocked: the choice just won't be remembered
  }
}

// Apply the saved language before the first screen is drawn
export const ready = setLanguage(savedLanguage());

export default i18n;