import React, { createContext, useContext, useState } from "react";
import { Box, Text, VStack, HStack, Icon, useToast } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { RootSiblingParent } from "react-native-root-siblings";

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: any) => {
  const toast = useToast();

  const showToast = ({ title, description, status }: any) => {
    toast.show({
      placement: "top",
      zIndex: 9999999,
      duration: 3000,
      position: "fixed",
      render: () => (
        <Box
          bg={status === "success" ? "green.500" : "red.500"}
          px="4"
          py="3"
          rounded="lg"
          zIndex={9999999}
          shadow="2"
          _text={{ color: "white" }}
        >
          <HStack space={3} alignItems="center">
            <Icon
              as={Ionicons}
              name={status === "success" ? "checkmark-circle" : "alert-circle"}
              color="white"
              size="lg"
            />
            <VStack>
              <Text color="white" bold fontSize="md">
                {title}
              </Text>
              {description && (
                <Text color="white" fontSize="sm">
                  {description}
                </Text>
              )}
            </VStack>
          </HStack>
        </Box>
      ),
    });
  };

  return (
      <RootSiblingParent>
    <ToastContext.Provider value={{ showToast }}>
        {children}
    </ToastContext.Provider>
      </RootSiblingParent>
  );
};

export const useToastContext = () => useContext(ToastContext);
