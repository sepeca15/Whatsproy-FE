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

const TabLayout: React.FC = () => {
  const { user } = useUser();
  const {userConfigured, paymentMade, apiConfigured, greenApiConfigured } = user;
  // const globalConfig = false // testing  borrar


  const globalConfig = userConfigured && paymentMade && apiConfigured && greenApiConfigured  

  
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
