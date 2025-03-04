import React, { createContext, useContext, useState } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState({
    state: localStorage.getItem("selectedState") || "",
    district: localStorage.getItem("selectedDistrict") || ""
  });

  const updateLocation = (newState, newDistrict) => {
    setLocation({ state: newState, district: newDistrict });
    localStorage.setItem("selectedState", newState);
    localStorage.setItem("selectedDistrict", newDistrict);
  };

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  return useContext(LocationContext);
}
