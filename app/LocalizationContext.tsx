import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { IntlProvider } from "react-intl";
import translations from "./locales/translations.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

// Runtime validation for translation shape
type Messages = Record<string, string> & {
  notAvailable: string;
  edit: string;
  disable: string;
  enable: string;
  delete: string;
  back: string;
  somethingHere: string;
};

function isValidTranslations(obj: any): obj is Record<string, Messages> {
  if (typeof obj !== 'object' || obj == null) return false;
  for (const locale in obj) {
    const messages = obj[locale];
    if (typeof messages !== 'object' || messages == null) return false;
    for (const key of ['notAvailable', 'edit', 'disable', 'enable', 'delete', 'back', 'somethingHere']) {
      if (typeof messages[key] !== 'string') return false;
    }
  }
  return true;
}

if (!isValidTranslations(translations)) {
  throw new Error('Invalid translations.json format');
}

const messages: Record<string, Messages> = translations;

type LocaleKey = keyof typeof messages;

interface LocalizationContextProps {
  locale: LocaleKey;
  setLocale: (locale: LocaleKey) => Promise<void>;
}

const LocalizationContext = createContext<LocalizationContextProps>({
  locale: "en",
  setLocale: async () => {},
});

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleKey>("en");
  const [hydrated, setHydrated] = useState(false);

  const setLocale = useCallback(async (newLocale: LocaleKey) => {
    setLocaleState(newLocale);
    try {
      await AsyncStorage.setItem("locale", newLocale);
    } catch (e) {
      console.warn('Error saving locale to storage', e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("locale");
        if (stored && stored in messages) {
          setLocaleState(stored as LocaleKey);
          console.log("Idioma detectado desde AsyncStorage:", stored); // Imprime el idioma almacenado
        } else {
          const sysLocale = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
          const fallbackLocale = (Object.keys(messages).includes(sysLocale) ? sysLocale : 'en') as LocaleKey;
          setLocaleState(fallbackLocale);
          await AsyncStorage.setItem("locale", fallbackLocale);
          console.log("Idioma detectado desde sistema:", sysLocale); // Imprime el idioma basado en el sistema
          console.log("Idioma seleccionado:", fallbackLocale); // Imprime el idioma final seleccionado
        }
      } catch (error) {
        console.warn("Error loading locale", error);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);
  const contextValue = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  if (!hydrated) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <LocalizationContext.Provider value={contextValue}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        onError={(err) => {
          if (__DEV__) console.warn("Missing translation:", err.message);
        }}
      >
        {children}
      </IntlProvider>
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);

export default LocalizationProvider;
