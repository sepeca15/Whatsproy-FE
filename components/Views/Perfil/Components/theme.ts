// Actualizar el archivo de tema para usar con NativeBase
import { extendTheme } from "native-base";

export const primaryColor = "#075e54";
export const secondaryColor = "#128c7e";
export const tertiaryColor = "#25d366"; // Verde más claro
export const accentColor = "#34b7f1"; // Azul

// Crear un tema extendido para NativeBase
export const nativeBaseTheme = extendTheme({
  colors: {
    primary: {
      50: `${primaryColor}10`,
      100: `${primaryColor}20`,
      200: `${primaryColor}30`,
      300: `${primaryColor}40`,
      400: `${primaryColor}50`,
      500: primaryColor,
      600: primaryColor,
      700: primaryColor,
      800: primaryColor,
      900: primaryColor,
    },
    secondary: {
      50: `${secondaryColor}10`,
      100: `${secondaryColor}20`,
      200: `${secondaryColor}30`,
      300: `${secondaryColor}40`,
      400: `${secondaryColor}50`,
      500: secondaryColor,
      600: secondaryColor,
      700: secondaryColor,
      800: secondaryColor,
      900: secondaryColor,
    },
    tertiary: {
      500: tertiaryColor,
    },
    accent: {
      500: accentColor,
    },
  },
  config: {
    // Configuración opcional para modo oscuro
    useSystemColorMode: false,
    initialColorMode: "light",
  },
});

// Exportar colores individuales para uso directo
export const theme = {
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    accent: accentColor,
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    light: {
      text: "#11181C",
      background: "#fff",
      icon: "#687076",
      tabIconDefault: "#687076",
      tabIconSelected: primaryColor,
    },
    dark: {
      text: "#ECEDEE",
      background: "#151718",
      icon: "#9BA1A6",
      tabIconDefault: "#9BA1A6",
      tabIconSelected: primaryColor,
    },
  },
};

export default nativeBaseTheme;
