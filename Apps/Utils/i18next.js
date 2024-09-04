import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as SecureStore from "expo-secure-store";
import en from "./../../locales/en.json";
import es from "./../../locales/es.json";

export const languagesResources = {
  es: { translation: es },
  en: { translation: en },
};

const getStoredLanguage = async () => {
  const storedLang = await SecureStore.getItemAsync("language");
  return storedLang || "es";
};

getStoredLanguage().then((lng) => {
  i18next.use(initReactI18next).init({
    compatibilityJSON: "v3",
    lng: lng,
    fallbackLng: "es",
    resources: languagesResources,
  });
});

export default i18next;
