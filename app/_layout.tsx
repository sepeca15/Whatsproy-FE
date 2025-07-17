import { useEffect } from "react";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { NativeBaseProvider } from "native-base";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { store } from "@/services/redux/store";
import { ToastProvider } from "@/contexts/ToastContext";
import { LocalizationProvider } from "./LocalizationContext";
import { StatusBar, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Text, TextInput } from "react-native";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "index",
  reactStrictMode: false,
};

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
  (Text as any).defaultProps.allowFontScaling = false;

  if ((TextInput as any).defaultProps == null)
    (TextInput as any).defaultProps = {};
  (TextInput as any).defaultProps.allowFontScaling = false;

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  useEffect(() => {
    const handleDeepLink = (event: any) => {
      const url = new URL(event.url);
      const token = url.searchParams.get("token");

      if (token) {
        router.push(`/(auth)/reset-password?token=${token}` as any);
      }
    };

    Linking.addEventListener("url", handleDeepLink);
    return () => Linking.removeAllListeners("url");
  }, [router]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <LocalizationProvider>
        <NativeBaseProvider>
          <Toast />
          <ToastProvider>
            <ThemeProvider value={DefaultTheme}>
              <SafeAreaView
                style={{ flex: 0, backgroundColor: "#075e54" }}
                edges={["top"]}
              />
              <StatusBar
                translucent={false}
                barStyle="light-content"
                backgroundColor="#075e54"
              />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ThemeProvider>
          </ToastProvider>
        </NativeBaseProvider>
      </LocalizationProvider>
    </Provider>
  );
}
