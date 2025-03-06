import { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedDistrict, setSelectedDistrict] = useState("");

  return (
    <LocationContext.Provider value={{ selectedDistrict, setSelectedDistrict }}>
      {children}
    </LocationContext.Provider>
  );
};
