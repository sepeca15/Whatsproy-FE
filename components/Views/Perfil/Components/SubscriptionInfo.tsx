import type React from "react"
import { Text, TouchableOpacity } from "react-native"
import { Box, HStack, VStack, Icon } from "native-base"
import { Ionicons } from "@expo/vector-icons"
import { FormattedMessage } from "react-intl"
import SafeProgress from "./SafeProgress"

interface SubscriptionProps {
  plan: string
  expiryDate: string
  usagePercentage: number
}

const SubscriptionInfo: React.FC<SubscriptionProps> = ({
  plan = "Premium",
  expiryDate = "30/06/2023",
  usagePercentage = 75,
}) => {
  return (
    <Box bg="white" borderRadius="lg" p={4} shadow={2} mb={4}>
      <HStack justifyContent="space-between" alignItems="center" mb={2}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          <FormattedMessage id="profile.subscription" defaultMessage="Suscripción" />
        </Text>
        <Box bg="rgba(7, 94, 84, 0.1)" px={2} py={1} borderRadius="full">
          <Text style={{ color: "#075e54", fontWeight: "bold", fontSize: 12 }}>{plan}</Text>
        </Box>
      </HStack>

      <HStack space={2} alignItems="center" mb={4}>
        <Icon as={Ionicons} name="calendar-outline" size="xs" color="gray.500" />
        <Text style={{ fontSize: 12, color: "#666" }}>
          <FormattedMessage id="profile.expiryDate" defaultMessage="Expira: {date}" values={{ date: expiryDate }} />
        </Text>
      </HStack>

      <VStack space={2}>
        <HStack justifyContent="space-between">
          <Text style={{ fontSize: 14 }}>
            <FormattedMessage id="profile.usage" defaultMessage="Uso del plan" />
          </Text>
          <Text style={{ fontSize: 14 }}>{Math.round(usagePercentage)}%</Text>
        </HStack>
        <SafeProgress value={usagePercentage} _filledTrack={{ bg: "#075e54" }} size="xs" />
      </VStack>

      <TouchableOpacity style={{ marginTop: 12 }}>
        <Box bg="#075e54" py={2} borderRadius="md" alignItems="center">
          <Text style={{ color: "white", fontWeight: "bold" }}>
            <FormattedMessage id="r" defaultMessage="Mejorar plan" />
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  )
}

export default SubscriptionInfo

