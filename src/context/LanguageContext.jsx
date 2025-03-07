import React, { createContext, useState, useEffect } from "react";
import i18n from "../i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize language from sessionStorage or default to "en"
  const [language, setLanguage] = useState(
    sessionStorage.getItem("preferredLanguage") || "en"
  );

  // Whenever language changes, update sessionStorage and i18n language
  useEffect(() => {
    sessionStorage.setItem("preferredLanguage", language);
    i18n.changeLanguage(language);
  }, [language]);

  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
