import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import de from '../locales/de.json';

const translations: Record<Language, any> = { en, ar, fr, es, de };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (path: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'tempmail_plus_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (saved && ['en', 'ar', 'fr', 'es', 'de'].includes(saved)) {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
    // Default to browser language or English
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.slice(0, 2).toLowerCase();
      if (['ar', 'fr', 'es', 'de'].includes(browserLang)) {
        return browserLang as Language;
      }
    }
    return 'en';
  });

  const isRtl = language === 'ar';

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', language);
    html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }, [language, isRtl]);

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = undefined;
        break;
      }
    }

    if (current !== undefined && typeof current === 'string') {
      return current;
    }

    // Fallback to English if translation is missing in current language
    if (language !== 'en') {
      let enFallback: any = translations['en'];
      for (const key of keys) {
        if (enFallback && typeof enFallback === 'object' && key in enFallback) {
          enFallback = enFallback[key];
        } else {
          enFallback = undefined;
          break;
        }
      }
      if (enFallback !== undefined && typeof enFallback === 'string') {
        return enFallback;
      }
    }

    return fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
