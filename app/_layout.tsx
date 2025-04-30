import React, { useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { NativeBaseProvider } from "native-base";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "@/services/redux/store";
import { ToastProvider } from "@/contexts/ToastContext";
import { LocalizationProvider } from "./LocalizationContext";
import { StatusBar, Platform } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import * as Notifications from "expo-notifications";
import { Colors } from "@/constants/Colors";
// import PedidosListener from "../utils/notificaciones/PedidosListener";
// import { NotificationProvider } from "@/contexts/NotificationPreferenceContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
    
      {/* <NotificationProvider> */}
        <StripeProvider publishableKey="pk_test_51R4irgCSKnEqCO5rpO7Q8M1eyJvLZmZRVkYwsWYDEcoiLTqMYkhZCj6J6WsZWVv2WQOF8DCPVICck3Y1ezN10b3800sTbng8ux">
          <LocalizationProvider>
            <NativeBaseProvider>
              <ToastProvider>
                <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
        </StripeProvider>
      {/* </NotificationProvider> */}
    </Provider>
  );
}
