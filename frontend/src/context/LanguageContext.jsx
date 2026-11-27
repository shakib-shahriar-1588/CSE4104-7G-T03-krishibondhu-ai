import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to Bangla ('bn') if nothing is saved
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'bn');

  const toggleLang = () => {
    const newLang = lang === 'bn' ? 'en' : 'bn';
    setLang(newLang);
    localStorage.setItem('appLang', newLang); // Save preference
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context easily
export const useLanguage = () => useContext(LanguageContext);