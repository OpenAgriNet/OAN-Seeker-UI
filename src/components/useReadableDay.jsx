import { useTranslation } from "react-i18next";

export const useReadableDay = () => {
  const { t } = useTranslation();

  const getReadableDay = (dateStr) => {
    const date = new Date(dateStr);
    // Get day name in English, e.g., "Monday"
    const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
    // Return translated day; fallback to dayName if no translation exists
    return t(`days.${dayName.toLowerCase()}`, dayName);
  };

  return getReadableDay;
};
