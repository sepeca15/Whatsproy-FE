import React from "react";
import { Slot } from "expo-router";
import { NativeBaseProvider } from "native-base";
import { PrivateView } from "@/components/PrivateView";
import Layout from "@/components/Layout";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/hooks/redux/useUser";
import toastConfig from "@/utils/toast";
import Toast from "react-native-toast-message";
import ConfigAccount from "@/components/Views/ConfigAccount";
import { io } from "socket.io-client";
import { useHomeData } from "@/hooks/redux/useHomeData";

const TabLayout: React.FC = () => {
  const { user } = useUser();
  const { handleAddNewOrder } = useHomeData()
  const {userConfigured, paymentMade, apiConfigured, greenApiConfigured } = user;
  const globalConfig = userConfigured && paymentMade && apiConfigured && greenApiConfigured 


  React.useEffect(() => {
    const socketIo = io(user.apiUrl);

    socketIo.on("sendOrderRealTime", (data) => {      
      handleAddNewOrder(data)
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);
  
  return (
    <NativeBaseProvider>
      <Toast config={toastConfig} />
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
  );
};

export default TabLayout;
