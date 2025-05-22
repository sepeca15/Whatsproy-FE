import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { IntlProvider } from "react-intl";
import translations from "./locales/translations.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { configureCalendarLocale } from "@/components/Views/Calendar/locale.config";

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
  setLocale: async () => { },
});

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleKey>("en");
  const [hydrated, setHydrated] = useState(false);

  const isValidLocale = (value: string): value is 'en' | 'es' | 'pt' => {
    return ['en', 'es', 'pt'].includes(value);
  };
  const setLocale = useCallback(async (newLocale: LocaleKey) => {
    setLocaleState(newLocale);
    configureCalendarLocale(newLocale as 'en' | 'es' | 'pt');
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
        if (stored && isValidLocale(stored)) {
          setLocaleState(stored);
          configureCalendarLocale(stored);
        } else {
          const sysLocale = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
          const fallbackLocale = isValidLocale(sysLocale) ? sysLocale : 'en';
          setLocaleState(fallbackLocale);
          configureCalendarLocale(fallbackLocale);
          await AsyncStorage.setItem("locale", fallbackLocale);
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
