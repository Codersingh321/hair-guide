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
// Hindi is loaded only when it is needed.
i18n.use(initReactI18next).init({
  resources: { en: { translation: {} } },
  lng: "en",
  fallbackLng: "en",
  keySeparator: false,
  interpolation: { escapeValue: false },
  returnEmptyString: false,
  react: { useSuspense: false },
});

// Hindi text files. When you add a new hi.*.json file, add one line here.
const hindiFiles = [
  () => import("./hi.json"),
  () => import("./hi.checker.json"),
  () => import("./hi.results.json"),
  () => import("./hi.learn.json"),
  () => import("./hi.tracker.json"),
];

export async function setLanguage(lang) {
  if (lang === "hi" && !i18n.hasResourceBundle("hi", "translation")) {
    try {
      const parts = await Promise.all(hindiFiles.map((load) => load()));
      const files = parts.map((m) => m.default);
      const merged = Object.assign({}, ...files);
      if (import.meta.env.DEV) {
        console.log(
          "Hindi lines loaded per file:",
          files.map((f) => Object.keys(f).length),
          "total:",
          Object.keys(merged).length
        );
      }
      i18n.addResourceBundle("hi", "translation", merged, true, true);
    } catch (err) {
      console.error("Could not load the Hindi text:", err);
      lang = "en";
    }
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