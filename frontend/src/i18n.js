import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar os dicionários
import enTranslations from './locales/en/translation.json';
import ptTranslations from './locales/pt/translation.json';

i18n
  .use(LanguageDetector) // Deteta o idioma do navegador
  .use(initReactI18next) // Passa o i18n para o React
  .init({
    resources: {
      en: { translation: enTranslations },
      pt: { translation: ptTranslations }
    },
    fallbackLng: 'en', // Se o idioma do cliente não existir, usa Inglês por defeito
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;