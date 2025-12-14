import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import enNs1 from "./locales/en/translation.json";
import frNs1 from "./locales/fr/translation.json";
import arNs1 from "./locales/ar/translation.json";
i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    debug: true,
    lng: "fr",
    defaultNS: "ns1",
    resources: {
      en: {
        ns1: enNs1,
      },
      fr: {
        ns1: frNs1,
      },
      ar: {
        ns1: arNs1,
      },
    },
    
  });
export default i18next;