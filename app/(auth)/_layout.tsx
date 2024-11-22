import React from "react";
import { Slot } from "expo-router";
import { NativeBaseProvider } from "native-base";

const Layout: React.FC = () => {
  return (
    
    <NativeBaseProvider>
      <Slot />
    </NativeBaseProvider>
  );
};

export default Layout;
