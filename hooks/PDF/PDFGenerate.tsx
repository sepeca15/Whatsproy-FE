import { useState } from "react";
import RNPrint from "react-native-print";
import { Alert, Platform } from "react-native";

export const useThermalPrint = () => {
  const [loading, setLoading] = useState(false);

  const printHTML = async (htmlContent: string) => {
    setLoading(true);
    try {
      await RNPrint.print({
        html: htmlContent,
      });
      return true;
    } catch (error) {
      console.log("Error al imprimir:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { printHTML, loading };
};
