import React from "react";
import { router, Slot } from "expo-router";
import { NativeBaseProvider, View } from "native-base";
import { useAuth } from "@/hooks/useAuth";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import toastConfig from "@/utils/toast";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { useUser } from "@/hooks/redux/useUser";

const Layout: React.FC = () => {
  const { isAuthenticated, loading, redirecting } = useAuth();
  const { user } = useUser();
  const { loading: loadingFCM, expoPushToken } = usePushNotifications();

  React.useEffect(() => {
    if (user?.id) {
      console.log("pushToken", expoPushToken);
    }
  }, [user, expoPushToken]);

  React.useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/(tabs)/home");
    }
  }, [isAuthenticated, loading]);

  if (loading || redirecting || loadingFCM) {
    return (
      <View style={styles.spinner}>
        <Progress.Circle
          color={Colors.light.primary}
          indeterminate={true}
          size={100}
        />
      </View>
    );
  }
  return (
    <NativeBaseProvider>
      <Toast config={toastConfig} />
      <Slot />
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Layout;
