import React, { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    selectedState: sessionStorage.getItem("selectedState") || "",
    selectedDistrict: sessionStorage.getItem("selectedDistrict") || "",
  });

  useEffect(() => {
    sessionStorage.setItem("selectedState", location.selectedState);
    sessionStorage.setItem("selectedDistrict", location.selectedDistrict);
  }, [location]);

  const updateLocation = (state, district) => {
    setLocation({ selectedState: state, selectedDistrict: district });
  };

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
