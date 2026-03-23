import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ruTranslations from './ru.json';
import enTranslations from './en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: ruTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
