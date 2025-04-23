import React, { createContext, useContext, useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import translations from "./locales/translations.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Messages extends Record<string, string> {
  notAvailable: string;
  edit: string;
  disable: string;
  enable: string;
  delete: string;
  back: string;
  somethingHere: string;
}

interface Translations {
  en: Messages;
  es: Messages;
}

const messages: Translations = translations as Translations;

interface LocalizationContextProps {
  locale: keyof Translations;
  setLocale: (locale: keyof Translations) => void;
}

const LocalizationContext = createContext<LocalizationContextProps>({
  locale: "en",
  setLocale: () => {},
});

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<keyof Translations>("en");

  const setLocale = async (newLocale: keyof Translations) => {
    setLocaleState(newLocale);
    await AsyncStorage.setItem("locale", newLocale);
  };

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const storedLocale = await AsyncStorage.getItem("locale");

        if (storedLocale === "en" || storedLocale === "es") {
          setLocaleState(storedLocale);
        } else {
          const userLocale = Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];
          const supportedLocales: Record<string, keyof Translations> = {
            en: "en",
            es: "es",
            "es-UY": "es",
          };

          const mappedLocale = supportedLocales[userLocale] || "en";
          setLocaleState(mappedLocale);
          await AsyncStorage.setItem("locale", mappedLocale);
        }
      } catch (error) {
        console.warn("Error loading locale", error);
      }
    };

    loadLocale();
  }, []);

  return (
    <LocalizationContext.Provider value={{ locale, setLocale }}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        onError={(err) => {
          if (__DEV__) {
            console.warn("Missing translation:", err.message);
          }
        }}
      >
        {children}
      </IntlProvider>
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);

export default LocalizationProvider;
