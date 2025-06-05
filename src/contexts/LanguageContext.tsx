import React, { createContext, useState, useContext, useCallback } from 'react';
import { translations, Language } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Optionally, persist language choice in localStorage
    // const savedLanguage = localStorage.getItem('petgas-lang') as Language;
    // return savedLanguage || 'es';
    return 'es'; // Default to Spanish
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // localStorage.setItem('petgas-lang', lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key; // Fallback to key if translation is missing
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};