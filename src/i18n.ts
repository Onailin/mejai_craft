import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import ja from "./locales/ja";
import th from "./locales/th";
import zh from "./locales/zh";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "th",
    supportedLngs: ["th", "en", "zh", "ja"],
    interpolation: {
      escapeValue: false,
    },
    resources: {
      th: {
        translation: th,
      },
      en: {
        translation: en,
      },
      zh: {
        translation: zh,
      },
      ja: {
        translation: ja,
      },
    },
  });

export default i18n;
