import React from "react";
import { Slot } from "expo-router";
import { NativeBaseProvider } from "native-base";
import { PrivateView } from "@/components/PrivateView";
import Layout from "@/components/Layout";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/hooks/redux/useUser";
import ConfigAccount from "@/components/Views/Home/Components/ConfigAccount";

const TabLayout: React.FC = () => {
  const { user:{userConfigured, paymentMade, apiConfigured, greenApiConfigured }} = useUser()
  const globalConfig = userConfigured && paymentMade && apiConfigured && greenApiConfigured
  return (
    <NativeBaseProvider>
      <PrivateView>
        {
          globalConfig ?
            <Layout>
              <SafeAreaView style={{ flex: 1 }}>
                <Slot />
              </SafeAreaView>
            </Layout>
            :
            <ConfigAccount />
        }
      </PrivateView>
    </NativeBaseProvider>
  );
};

export default TabLayout;
