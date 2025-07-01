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
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
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

    return () => {
      Linking.removeAllListeners("url");
    };
  }, [router]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <LocalizationProvider>
        <NativeBaseProvider>
          <Toast />

          <ToastProvider>
            <ThemeProvider value={DefaultTheme}>
              <StatusBar barStyle="light-content" backgroundColor={"#075e54"} />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ThemeProvider>
          </ToastProvider>
        </NativeBaseProvider>
      </LocalizationProvider>
    </Provider>
  );
}
