// DebugLocale.tsx (al lado de tu LocalizationContext)
import React, { useEffect } from "react";
import { useLocalization } from "./LocalizationContext";
import { useIntl } from "react-intl";

export function DebugLocale() {
  const { locale } = useLocalization();
  const intl = useIntl();

  useEffect(() => {
    console.log("🚩 DebugLocale → locale:", locale);
    console.log(
      "🚩 DebugLocale → notAvailable:",
      intl.formatMessage({ id: "notAvailable", defaultMessage: "NA" })
    );
  }, [locale]);

  return null;
}
