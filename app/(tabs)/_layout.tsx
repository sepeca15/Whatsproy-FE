import React from "react";
import { Slot } from "expo-router";
import { NativeBaseProvider } from "native-base";
import { PrivateView } from "@/components/PrivateView";
import Layout from "@/components/Layout";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/hooks/redux/useUser";
import ConfigAccount from "@/components/Views/ConfigAccount";
import { io } from "socket.io-client";
import { useHomeData } from "@/hooks/redux/useHomeData";
import moment from "moment";
import { useIntl } from "react-intl";
import { getTimeAgo } from "@/hooks/home_functions/useLastOrders";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TabLayout: React.FC = () => {
  const { user } = useUser();
  const { handleAddNewOrderNormal } = useHomeData()
  const { userConfigured, paymentMade, apiConfigured, greenApiConfigured } = user;
  const globalConfig = userConfigured && paymentMade && apiConfigured && greenApiConfigured
  const intl = useIntl()

  React.useEffect(() => {
    const socketIo = io(user.apiUrl);

    socketIo.on("sendOrderRealTime", (data) => {
      let address = intl.formatMessage({ id: "orders.noAddress" });
      let status = intl.formatMessage({ id: "orders.noStatus" });

      try {
        const info = JSON.parse(data.infoLinesJson);
        address = info?.Direccion?.trim() || address;
      } catch (error) {
        console.error("Error al parsear infoLinesJson", error);
      }

      const newOrderInfo = {
        id: data.id,
        time: getTimeAgo(data.createdAt, intl),
        fecha: data?.fecha ? moment(data?.fecha).format("YYYY-MM-DD HH:mm") : new Date(),
        amount: intl.formatMessage({ id: "orders.currencyPrefix" }, { amount: data.total }),
        icon: "receipt",
        address,
        status,
        createdAt: data?.createdAt,
      };

      handleAddNewOrderNormal(newOrderInfo)
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <GestureHandlerRootView>
      <NativeBaseProvider>
        <PrivateView>
          {globalConfig ? (
            <Layout>
              <SafeAreaView style={{ flex: 1 }}>
                <Slot />
              </SafeAreaView>
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
