import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { IntlProvider } from "react-intl";
import translations from "./locales/translations.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

interface Translations {
  en: Messages;
  es: Messages;
}

function isValidTranslations(obj: any): obj is Translations {
  if (typeof obj !== 'object' || obj == null) return false;
  for (const locale of ['en', 'es']) {
    if (typeof obj[locale] !== 'object' || obj[locale] == null) return false;
    for (const key of ['notAvailable','edit','disable','enable','delete','back','somethingHere']) {
      if (typeof obj[locale][key] !== 'string') return false;
    }
  }
  return true;
}

if (!isValidTranslations(translations)) {
  throw new Error('Invalid translations.json format');
}

const messages: Translations = translations;

type LocaleKey = keyof Translations;

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
        if (stored === 'en' || stored === 'es') {
          setLocaleState(stored);
        } else {
          const sys = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
          const supported: Record<string, LocaleKey> = { en: 'en', es: 'es', 'es-UY': 'es' };
          const detected = (supported[sys] as LocaleKey) || 'en';
          setLocaleState(detected);
          await AsyncStorage.setItem("locale", detected);
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
    return null; // o un spinner
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
