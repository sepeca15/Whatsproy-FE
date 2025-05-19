import React, { useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider, useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { NativeBaseProvider } from "native-base";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "@/services/redux/store";
import { ToastProvider } from "@/contexts/ToastContext";
import { LocalizationProvider } from "./LocalizationContext";
import { StatusBar, Platform, Linking } from "react-native";
import * as Notifications from "expo-notifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter()
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  useEffect(() => {
    const handleDeepLink = (event : any) => {
      console.log('sisisisis');
      
      const url = new URL(event.url);
      const token = url.searchParams.get('token');
      console.log("Token recibido: ", token);

      if (token) {
        router.push(`/reset-password?token=${token}`);
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    // Limpia el listener cuando el componente se desmonte
    return () => {
      Linking.removeAllListeners('url');
    };
  }, [router]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
    
      {/* <NotificationProvider> */}
          <LocalizationProvider>
            <NativeBaseProvider>
              <ToastProvider>
                <ThemeProvider value={DefaultTheme}>
                <StatusBar barStyle="light-content" backgroundColor={"#075e54" }/>
                  {/* <PedidosListener /> */}
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </ThemeProvider>
              </ToastProvider>
            </NativeBaseProvider>
          </LocalizationProvider>
      {/* </NotificationProvider> */}
    </Provider>
  );
}
