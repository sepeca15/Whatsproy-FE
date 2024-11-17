import React from "react";
import { Slot } from "expo-router";
import { NativeBaseProvider } from "native-base";
import { PrivateView } from "@/components/PrivateView";
import Layout from "@/components/Layout";
import { SafeAreaView } from "react-native-safe-area-context";

const TabLayout: React.FC = () => {

  return (
    <NativeBaseProvider>
      <Layout>
        <SafeAreaView style={{ flex: 1 }}>
          <PrivateView>
            <Slot />
          </PrivateView>
        </SafeAreaView>
      </Layout>
    </NativeBaseProvider>
  );
};

export default TabLayout;
