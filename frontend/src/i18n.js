import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptTranslation from './locales/pt/translation.json';
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import deTranslation from './locales/de/translation.json';
import ruTranslation from './locales/ru/translation.json';
import zhTranslation from './locales/zh/translation.json';

// Mapeamento de Idioma para Moeda
const languageToCurrency = {
  pt: 'BRL',
  en: 'USD',
  es: 'EUR',
  fr: 'EUR',
  de: 'EUR',
  ru: 'RUB',
  zh: 'CNY'
};

// Função Global de Formatação de Preço
export const formatPrice = (value, lng) => {
  const currency = languageToCurrency[lng] || 'USD';
  return new Intl.NumberFormat(lng, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      pt: { translation: ptTranslation },
      es: { translation: esTranslation },
      fr: { translation: frTranslation },
      de: { translation: deTranslation },
      ru: { translation: ruTranslation },
      zh: { translation: zhTranslation }
    },
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;