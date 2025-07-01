import React, { useState, useMemo } from "react";
import { Box, Text, VStack, ScrollView, View } from "native-base";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated from "react-native-reanimated";
import { globalStyles } from "@/components/globalStyles";
import CustomText from "@/components/CustomText";
import { FormattedMessage } from "react-intl";
import CardNewPedido from "../Pedidos/components/CardNewPedido.tsx";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const ClientDetails = ({}) => {
  const { clientDataString }: { clientDataString: string } =
    useLocalSearchParams();
  const clientData = JSON.parse(clientDataString);

  const initials = getInitials(clientData.nombre);
  const router = useRouter();

  if (!clientData) {
    return;
  }

  return (
    <Box flex={1}>
      <Animated.View style={globalStyles.header}>
        <View style={globalStyles.headerContent}>
          <TouchableOpacity
            style={globalStyles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <View style={globalStyles.headerLeft}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel="Pedidos"
            >
              <FormattedMessage id="manageClients" />
            </CustomText>
          </View>
        </View>
      </Animated.View>
      <ScrollView p={4}>
        <View bg={"white"} shadow={"3"} p={4} marginBottom={4} rounded={"md"}>
          <View display={"flex"} flexDir={"row"} alignItems={"center"}>
            <View
              display={"flex"}
              flex={1}
              flexDir={"row"}
              alignItems={"center"}
              style={{ gap: 12 }}
            >
              <View
                w={50}
                h={50}
                bg={"teal.700"}
                rounded={"full"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Text fontSize={14} fontWeight={"bold"} color={"white"}>
                  {initials}
                </Text>
              </View>
              <View display={"flex"} flexDir={"column"}>
                <Text color="teal.600" bold>
                  Nombre: <Text color="teal.800">{clientData?.nombre}</Text>
                </Text>
                <Text color="teal.600" bold>
                  Teléfono: <Text color="teal.800">{clientData?.telefono}</Text>
                </Text>
              </View>
            </View>
          </View>

          <VStack mt={4}>
            <Text>Monto Total: ${clientData?.totalGenerated}</Text>
            <Text>
              Promedio: $
              {(
                clientData?.totalGenerated / clientData?.pedido?.length
              ).toFixed(2)}
            </Text>
          </VStack>
        </View>
        {clientData?.pedido?.map((pedido: any) => {
          return (
            <View my={1} key={pedido?.id}>
              <CardNewPedido trashIcon={false} pending={false} active={false} orderData={pedido} />
            </View>
          );
        })}
      </ScrollView>
    </Box>
  );
};

export default ClientDetails;
