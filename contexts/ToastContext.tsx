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
      duration: 4000,
      render: () => (
        <Box
          marginTop={-5}
          bg={status === "success" ? "green.600" : "red.600"}
          maxWidth="95%"
          alignSelf="center"
          rounded="xl"
          width={"95%"}
          px="4"
          py="3"
          shadow="9"
          borderLeftWidth={6}
          borderColor={status === "success" ? "green.300" : "red.300"}
        >
          <HStack space={3} alignItems="flex-start">
            <Icon
              as={Ionicons}
              name={status === "success" ? "checkmark-circle" : "alert-circle"}
              color="white"
              size="lg"
              mt={0.5}
            />
            <VStack flexShrink={1}>
              <Text color="white" bold fontSize="md">
                {title}
              </Text>
              {description && (
                <Text color="white" fontSize="sm" flexWrap="wrap">
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
