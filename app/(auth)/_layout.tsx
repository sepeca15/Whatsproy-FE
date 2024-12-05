import React from "react";
import { router, Slot } from "expo-router";
import { NativeBaseProvider, View } from "native-base";
import { useAuth } from "@/hooks/useAuth";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

const Layout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()

  React.useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/(tabs)/home')
    }
  }, [isAuthenticated, loading])

  if (loading) {
    return <View style={styles.spinner}>
      <Progress.Circle color={Colors.light.primary} indeterminate={true} size={100} />
    </View>
  }
  return (
    <NativeBaseProvider>
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
