// LanguageContext.jsx
import React, { createContext, useState, useEffect } from "react";
import i18n from "../i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const storedLanguage = sessionStorage.getItem("language");
    return storedLanguage ? storedLanguage : "en";
  });

  // Tracks if the language change was triggered by the header
  const [headerChange, setHeaderChange] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(language);
    sessionStorage.setItem("language", language);
  }, [language]);

  // Called when user picks language from the chatbot’s own buttons
  const updateLanguage = (newLanguage) => {
    setHeaderChange(false); // This indicates it's from the chatbot
    setLanguage(newLanguage);
  };

  // Called when user picks language from the header
  const updateLanguageFromHeader = (newLanguage) => {
    setHeaderChange(true); // This indicates it's from the header
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{ language, headerChange, updateLanguage, updateLanguageFromHeader }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
