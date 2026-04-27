import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.scss';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${currentLang === 'ru' ? 'active' : ''}`}
        onClick={() => switchLanguage('ru')}
      >
        Русский
      </button>
      <button
        className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        onClick={() => switchLanguage('en')}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;