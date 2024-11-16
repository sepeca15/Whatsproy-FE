import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

export const PrivateView = ({ children } : any) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/(auth)/login"); 
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Text>Cargando...</Text>; 
  }

  if (!isAuthenticated) {
    return null;
  }

  return <View>{children}</View>;
};
