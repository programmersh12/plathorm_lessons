import React from 'react';
import { GlobeIcon } from './Icons';

const LanguageSwitcher = () => {
  return (
    <div className="language-switcher">
      <span className="language-label">
        <GlobeIcon size={14} />
        Язык: Русский
      </span>
    </div>
  );
};

export default LanguageSwitcher;
