import { useState } from "react";
import RNPrint from "react-native-print";
import RNHTMLtoPDF from "react-native-html-to-pdf";
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

  const downloadPDF = async (htmlContent: string) => {
    setLoading(true);
    try {
      const options = {
        html: htmlContent,
        fileName: "comanda",
        directory: Platform.OS === "ios" ? undefined : "Documents", // Android guarda en Documents
      };

      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert("PDF generado", `Archivo guardado en:\n${file.filePath}`);
      
      return file.filePath;
    } catch (error) {
      console.log("Error al generar PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { printHTML, downloadPDF, loading };
};
