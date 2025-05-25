import React, { createContext, useContext } from "react";
import { View, Dimensions } from "react-native";
import { useToast, Box, Text, VStack } from "native-base";
import { useIntl } from "react-intl";

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: any) => {
  const intl = useIntl();
  const toast = useToast();
  const screenWidth = Dimensions.get("window").width;

  const showToast = ({ title, description, status }: any) => {
    const resolveToString = (value: any): string => {
      if (typeof value === "string") return value;
      if (value?.props?.id && value?.props?.defaultMessage) {
        return intl.formatMessage({
          id: value.props.id,
          defaultMessage: value.props.defaultMessage,
        });
      }
      return "";
    };

    const titleText = resolveToString(title);
    const descriptionText = resolveToString(description);

    toast.show({
      placement: "top",
      duration: 3000,
      render: () => (
        <View style={{ width: screenWidth * 0.9, alignSelf: "center" }}>
          <Box
            bg="coolGray.200"
            px="4"
            py="3"
            rounded="xl"
            shadow={3}
            borderLeftWidth={6}
            borderLeftColor={
              status === "success"
                ? "green.600"
                : status === "error"
                ? "red.600"
                : "yellow.600"
            }
          >
            <VStack space={1}>
              <Text fontWeight="bold" color="coolGray.800">
                {titleText}
              </Text>
              {descriptionText ? (
                <Text fontSize="sm" color="coolGray.600">
                  {descriptionText}
                </Text>
              ) : null}
            </VStack>
          </Box>
        </View>
      ),
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
