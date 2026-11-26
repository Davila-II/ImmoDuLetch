import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fr } from '../locales/fr';
import { en } from '../locales/en';

const TRANSLATIONS = { fr, en };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('immo_lang') || 'fr';
  });

  const setLanguage = (lang) => {
    if (lang === 'fr' || lang === 'en') {
      setLanguageState(lang);
      localStorage.setItem('immo_lang', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  // Mettre à jour l'attribut lang de html
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Fonction t(path, params)
  const t = useCallback(
    (path, params = {}) => {
      const keys = path.split('.');
      let current = TRANSLATIONS[language];

      for (const k of keys) {
        if (current && current[k] !== undefined) {
          current = current[k];
        } else {
          // Fallback sur le français si non trouvé
          let fallback = TRANSLATIONS.fr;
          for (const fk of keys) {
            fallback = fallback ? fallback[fk] : undefined;
          }
          current = fallback !== undefined ? fallback : path;
          break;
        }
      }

      if (typeof current === 'string') {
        let result = current;
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramVal);
        });
        return result;
      }

      return current || path;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
