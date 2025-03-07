import React, { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    selectedState: "",
    selectedDistrict: "",
  });

  const updateLocation = (state, district) => {
    setLocation({ selectedState: state, selectedDistrict: district });
  };

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
