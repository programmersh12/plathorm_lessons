import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher" style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: '10px', color: 'white' }}>{t('language')}:</span>
      <button
        onClick={() => changeLanguage('ru')}
        style={{
          marginRight: '5px',
          padding: '5px 10px',
          backgroundColor: i18n.language === 'ru' ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        RU
      </button>
      <button
        onClick={() => changeLanguage('en')}
        style={{
          padding: '5px 10px',
          backgroundColor: i18n.language === 'en' ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;