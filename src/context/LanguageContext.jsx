import React, { createContext, useState, useEffect } from "react";
import i18n from "../i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const storedLanguage = sessionStorage.getItem("language");
    return storedLanguage ? storedLanguage : "en";
  });
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
