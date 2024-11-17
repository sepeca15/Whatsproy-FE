import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

export const PrivateView = ({ children }: any) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/(tabs)/home')
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};
