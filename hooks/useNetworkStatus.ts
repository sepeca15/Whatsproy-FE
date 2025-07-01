"use client";

import { useState, useEffect } from "react";
import * as Network from "expo-network";

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [networkType, setNetworkType] = useState<string>("");

  const checkConnection = async () => {
    try {
      setIsLoading(true);

      const networkState = await Network.getNetworkStateAsync();

      setIsConnected(networkState.isConnected ?? false);
      setNetworkType(networkState.type || "");
    } catch (error) {
      console.error("Error checking network status:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    isLoading,
    networkType,
    checkConnection,
  };
};
