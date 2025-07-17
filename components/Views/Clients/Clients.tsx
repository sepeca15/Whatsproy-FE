import React, { useState, useMemo } from "react";
import { FlatList } from "react-native";
import {
  Box,
  Text,
  VStack,
  Icon,
  View,
  Center,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FormattedMessage, useIntl } from "react-intl";
import Animated from "react-native-reanimated";
import { globalStyles } from "@/components/globalStyles";
import CustomText from "@/components/CustomText";
import { Cliente } from "./types";
import { Colors } from "@/constants/Colors";
import InputField from "@/components/InputField";
import * as Progress from "react-native-progress";
import CardClient from "./components/CardClient.tsx";
import { useRouter } from "expo-router";
import { useClientsData } from "@/hooks/redux/useClientsData";

const Clients = () => {
  const isFetchingRef = React.useRef(false);
  const intl = useIntl();
  const [filtroNombre, setFiltroNombre] = useState("");
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setRefreshing(true);
    await handleLoadClientData(filtroNombre, true);
    isFetchingRef.current = false;
    setRefreshing(false);
  };

  const { totalItems, offset, loaded, loadingApi, limit, clientsData, handleLoadClientData } = useClientsData()

  React.useEffect(() => {
    if (!loaded) {
      handleLoadClientData('', false);
    }
  }, []);

  console.log(loadingApi);


  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleLoadClientData(filtroNombre, true);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [filtroNombre]);

  const handleSendPageDetails = (clientData: Cliente) => {
    router.push({
      pathname: "/(tabs)/clientDetails",
      params: { clientDataString: JSON.stringify(clientData) },
    });
  };

  return (
    <Box flex={1} bg="white">
      <Animated.View style={globalStyles.header}>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText style={globalStyles.businessName}>
              <FormattedMessage id="clients.title" />
            </CustomText>
          </View>
        </View>
      </Animated.View>
      <Box flex={1} m={2}>
        <Text allowFontScaling={false} px={1} pt={3} color="teal.600">
          <FormattedMessage id="clients.subtitle" />
        </Text>
        <VStack px={1} my={4} space={3}>
          <InputField
            placeholder={intl.formatMessage({
              id: "clients.searchPlaceholder",
            })}
            value={filtroNombre}
            onChangeText={setFiltroNombre}
            InputLeftElement={
              <Icon
                as={Ionicons}
                name="search"
                size={5}
                ml="2"
                color={Colors.light.primary}
              />
            }
          />
        </VStack>

        {clientsData.length > 0 && (
          <FlatList
            contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 5 }}
            data={clientsData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CardClient
                setClienteSeleccionado={() => handleSendPageDetails(item)}
                item={item}
              />
            )}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={() => {
              if (clientsData.length < totalItems && !loadingApi && !isFetchingRef.current) {
                isFetchingRef.current = true;
                handleLoadClientData(filtroNombre, false).finally(() => {
                  isFetchingRef.current = false;
                });
              }
            }}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              loadingApi && clientsData.length > 0 ? (
                <Center>
                  <Progress.Circle
                    color={"#075e54"}
                    indeterminate={true}
                    size={40}
                  />
                </Center>
              ) : null
            }
          />
        )}

        {clientsData.length === 0 && loadingApi && (
          <Center
            flex={1}
            display={"flex"}
            flexDir={"row"}
            alignItems={"center"}
          >
            <Progress.Circle color={"#075e54"} indeterminate={true} size={40} />
          </Center>
        )}

        {clientsData.length === 0 && !loadingApi && (
          <Center
            flex={1}
            display={"flex"}
            flexDir={"row"}
            alignItems={"center"}
          >
            <Text allowFontScaling={false} textAlign="center" color="teal.600">
              <FormattedMessage id="clients.noResults" />
            </Text>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default Clients;
