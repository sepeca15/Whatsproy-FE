import React from "react";
import { Button, HStack, Text } from "native-base";
import { useLocalization } from "../../app/LocalizationContext";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocalization();

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "es" : "en");
  };

  return (
    <HStack space={3} alignItems="center">
      <Text bold>Idioma:</Text>
      <Button size="sm" variant="outline" onPress={toggleLanguage}>
        {locale === "en" ? "Español" : "English"}
      </Button>
    </HStack>
  );
};

export default LanguageSwitcher;
