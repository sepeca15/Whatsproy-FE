import React from "react";
import { Slot } from "expo-router";
import { NativeBaseProvider } from "native-base";
import { PrivateView } from "@/components/PrivateView";
import Layout from "@/components/Layout";
import { useUser } from "@/hooks/redux/useUser";
import ConfigAccount from "@/components/Views/ConfigAccount";
import { io } from "socket.io-client";
import { useHomeData } from "@/hooks/redux/useHomeData";
import moment from "moment";
import { useIntl } from "react-intl";
import { getTimeAgo } from "@/hooks/home_functions/useLastOrders";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";
import { useColorScheme, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { NoConnectionScreen } from "@/components/NoConectionScreen/NoConecctionScreen";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const TabLayout: React.FC = () => {
  const { user } = useUser();
  const { handleAddNewOrderNormal } = useHomeData();
  const { userConfigured, paymentMade, apiConfigured, greenApiConfigured } =
    user;
  const globalConfig =
    userConfigured && paymentMade && apiConfigured && true;
  const isSuperAdmin = user?.isSuperAdmin;
  const assistentEnabled = user?.assistentEnabled;

  const intl = useIntl();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { isConnected, isLoading, checkConnection } = useNetworkStatus();

  React.useEffect(() => {
    if (!isConnected) return;

    const socketIo = io(user.apiUrl);

    socketIo.on("sendOrderRealTime", (data) => {
      let address = intl.formatMessage({ id: "orders.noAddress" });
      const status = intl.formatMessage({ id: "orders.noStatus" });

      try {
        const info = JSON.parse(data.infoLinesJson);
        address = info?.Direccion?.trim() || address;
      } catch (error) {
        console.error("Error al parsear infoLinesJson", error);
      }

      const newOrderInfo = {
        id: data.id,
        time: getTimeAgo(data.createdAt, intl),
        fecha: data?.fecha
          ? moment(data?.fecha).format("YYYY-MM-DD HH:mm")
          : new Date(),
        amount: intl.formatMessage(
          { id: "orders.currencyPrefix" },
          { amount: data.total }
        ),
        icon: "receipt",
        address,
        status,
        createdAt: data?.createdAt,
      };

      handleAddNewOrderNormal(newOrderInfo);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [isConnected]);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NativeBaseProvider>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.background,
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </NativeBaseProvider>
      </GestureHandlerRootView>
    );
  }

  if (!isConnected) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NativeBaseProvider>
          <NoConnectionScreen onRetry={checkConnection} />
        </NativeBaseProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <PrivateView>
          {globalConfig || isSuperAdmin || assistentEnabled === false ? (
            <Layout>
              <View style={{ flex: 1 }}>
                <Slot />
              </View>
            </Layout>
          ) : (
            <ConfigAccount />
          )}
        </PrivateView>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
};

export default TabLayout;
