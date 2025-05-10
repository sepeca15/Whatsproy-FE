import type React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Box, HStack, VStack, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FormattedMessage } from "react-intl";
import { Shadow } from "react-native-shadow-2";
import SafeProgress from "./Views/Perfil/components/SafeProgress";
import { router } from "expo-router";
import moment from "moment-timezone";
import { useUser } from "@/hooks/redux/useUser";

interface SubscriptionProps {
  plan: string;
  expiryDate: string;
  maxPedidos: number;
  currentPedidosMonthActual: number;
}

const SubscriptionInfo: React.FC<SubscriptionProps> = ({
  plan = "Premium",
  expiryDate = "30/06/2023",
  maxPedidos,
  currentPedidosMonthActual = 150,
}) => {
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "#2e7d32";
    if (percentage < 90) return "#ef6c00";
    return "#c62828";
  };
  const { user } = useUser();

  const usagePercentage = currentPedidosMonthActual * 100 / maxPedidos;

  return (
    <Shadow
      distance={5}
      startColor={"rgba(0, 0, 0, 0.05)"}
      endColor={"rgba(0, 0, 0, 0.01)"}
      offset={[0, 2]}
      style={{ width: "100%", marginBottom: 32 }}
    >
      <Box bg="white" borderRadius="lg" p={4}>
        <HStack justifyContent="space-between" alignItems="center" mb={2}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            <FormattedMessage
              id="profile.subscription"
              defaultMessage="Suscripción"
            />
          </Text>
          <Box bg="rgba(7, 94, 84, 0.1)" px={2} py={1} borderRadius="full">
            <Text
              style={{ color: "#075e54", fontWeight: "bold", fontSize: 12 }}
            >
              {plan}
            </Text>
          </Box>
        </HStack>

        <HStack space={2} alignItems="center" mb={4}>
          <Icon
            as={Ionicons}
            name="calendar-outline"
            size="xs"
            color="gray.500"
          />
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <Text style={{ fontSize: 12, color: "black" }}>
              <FormattedMessage
                id="profile.expiryDate"
                defaultMessage="Expira: {date}"
                values={{ date: moment(expiryDate).format("YYYY-MM-DD HH:mm") }}
              />
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>{moment(expiryDate).tz(user?.timeZone).format("YYYY-MM-DD HH:mm")}</Text>
          </View>
        </HStack>

        <VStack space={2}>
          <HStack justifyContent="space-between">
            <Text style={{ fontSize: 14 }}>
              <FormattedMessage
                id="profile.usage"
                defaultMessage="Uso del plan"
              />
            </Text>
            <Text style={{ fontSize: 14 }}>
              {currentPedidosMonthActual}/{maxPedidos}
            </Text>
          </HStack>

          <HStack justifyContent="space-between">
            <Text style={{ fontSize: 12, color: "gray" }}>
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>
              {Math.round(usagePercentage)}%
            </Text>
          </HStack>

          <SafeProgress
            value={usagePercentage}
            _filledTrack={{ bg: getProgressColor(usagePercentage) }}
            size="xs"
          />
        </VStack>

        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)/subscriptions");
          }}
          style={{ marginTop: 12 }}
        >
          <Box bg="#075e54" py={2} borderRadius="md" alignItems="center">
            <Text style={{ color: "white", fontWeight: "bold" }}>
              <FormattedMessage
                id="profile.upgradePlan"
                defaultMessage="Mejorar plan"
              />
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Shadow>
  );
};

export default SubscriptionInfo;
