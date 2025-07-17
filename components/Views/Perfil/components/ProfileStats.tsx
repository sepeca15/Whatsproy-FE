import type React from "react";
import { Text } from "react-native";
import { HStack, VStack, Box, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FormattedMessage } from "react-intl";
import SafeProgress from "./SafeProgress";

interface StatsProps {
  completionPercentage: number;
  totalVisits: number;
  streak: number;
}

const ProfileStats: React.FC<StatsProps> = ({
  completionPercentage = 65,
  totalVisits = 28,
  streak = 5,
}) => {
  return (
    <Box bg="white" borderRadius="lg" p={4} shadow={2} mb={4}>
      <VStack space={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold" }}>
            <FormattedMessage
              id="profile.completion"
              defaultMessage="Perfil completado"
            />
          </Text>
          <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold" }}>
            {Math.round(completionPercentage)}%
          </Text>
        </HStack>
        <HStack justifyContent="space-between" mt={2}>
          <VStack alignItems="center">
            <Icon
              as={Ionicons}
              name="calendar-outline"
              size="md"
              color="#075e54"
            />
            <Text allowFontScaling={false} style={{ fontSize: 14, marginTop: 4 }}>
              <FormattedMessage id="profile.visits" defaultMessage="Visitas" />
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold" }}>
              {totalVisits}
            </Text>
          </VStack>

          <VStack alignItems="center">
            <Icon
              as={Ionicons}
              name="flame-outline"
              size="md"
              color="#128c7e"
            />
            <Text allowFontScaling={false} style={{ fontSize: 14, marginTop: 4 }}>
              <FormattedMessage id="profile.streak" defaultMessage="Racha" />
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold" }}>
              {streak} días
            </Text>
          </VStack>

          <VStack alignItems="center">
            <Icon as={Ionicons} name="star-outline" size="md" color="#25d366" />
            <Text allowFontScaling={false} style={{ fontSize: 14, marginTop: 4 }}>
              <FormattedMessage id="profile.level" defaultMessage="Nivel" />
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: 16, fontWeight: "bold" }}>Pro</Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProfileStats;
