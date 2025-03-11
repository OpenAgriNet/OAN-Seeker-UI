import React, { createContext, useState, useEffect } from "react";
import i18n from "../i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize language from sessionStorage if available, otherwise default to "en"
  const [language, setLanguage] = useState(() => {
    const storedLanguage = sessionStorage.getItem("language");
    return storedLanguage ? storedLanguage : "en";
  });

  // Update i18n language and sessionStorage whenever language changes
  useEffect(() => {
    i18n.changeLanguage(language);
    sessionStorage.setItem("language", language);
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
