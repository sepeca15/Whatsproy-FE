import React from "react";
import { Slot } from "expo-router";
import { NativeBaseProvider } from "native-base";
import { PrivateView } from "@/components/PrivateView";

const TabLayout: React.FC = () => {

  return (
    <NativeBaseProvider>
      <PrivateView>
        <Slot />
      </PrivateView>
    </NativeBaseProvider>
  );
};

export default TabLayout;
