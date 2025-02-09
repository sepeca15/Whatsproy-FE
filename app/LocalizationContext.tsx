import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import translations from './locales/translations.json'; 


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
  locale: 'en',
  setLocale: () => {},
});

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<keyof Translations>('en');

  useEffect(() => {
    const userLocale = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
    console.log('Detected locale:', userLocale); 

    // Mapea la configuración regional a los idiomas soportados
    const supportedLocales: Record<string, keyof Translations> = {
      en: 'en',
      es: 'es',
      'es-UY': 'es', // Mapea es-UY a es
      // Agrega más mapeos según sea necesario
    };

    const mappedLocale = supportedLocales[userLocale] || 'en';
    setLocale(mappedLocale);
  }, []);

  return (
    <LocalizationContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);

// Exporta LocalizationProvider por defecto
export default LocalizationProvider;