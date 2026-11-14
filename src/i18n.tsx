import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import enNs1 from "./locales/en/translation.json";
import frNs1 from "./locales/fr/translation.json";
 i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    debug: false,
    defaultNS: "ns1",
    supportedLngs: ["fr", "en"],
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      caches: ["localStorage"],
    },
    resources: {
      en: {
        ns1: enNs1,
      },
      fr: {
        ns1: frNs1,
      }
   
    },
    
  });
export default i18next;