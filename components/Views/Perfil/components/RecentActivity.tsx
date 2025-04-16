import type React from "react";
import { Text } from "react-native";
import { VStack, Box, HStack, Icon, Divider } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { FormattedMessage } from "react-intl";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  iconColor: string;
}

const RecentActivity: React.FC = () => {
  // Datos de ejemplo - en una implementación real, estos vendrían de una API o estado
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "login",
      title: "Inicio de sesión",
      description: "Acceso desde dispositivo móvil",
      date: "Hoy, 10:30",
      icon: "log-in-outline",
      iconColor: "#075e54",
    },
    {
      id: "2",
      type: "update",
      title: "Perfil actualizado",
      description: "Cambio de imagen de perfil",
      date: "Ayer, 15:45",
      icon: "create-outline",
      iconColor: "#128c7e",
    },
    {
      id: "3",
      type: "report",
      title: "Reporte generado",
      description: "Reporte mensual de actividad",
      date: "23/05/2023",
      icon: "document-text-outline",
      iconColor: "#25d366",
    },
  ];

  return (
    <Box bg="white" borderRadius="lg" p={4} shadow={2} mb={4}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        <FormattedMessage
          id="profile.recentActivity"
          defaultMessage="Actividad reciente"
        />
      </Text>

      <VStack space={3} divider={<Divider />}>
        {activities.map((activity) => (
          <HStack key={activity.id} space={3} alignItems="center">
            <Box bg={`${activity.iconColor}20`} p={2} borderRadius="full">
              <Icon
                as={Ionicons}
                name={activity.icon}
                size="sm"
                color={activity.iconColor}
              />
            </Box>
            <VStack flex={1}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                {activity.title}
              </Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                {activity.description}
              </Text>
            </VStack>
            <Text style={{ fontSize: 12, color: "#999" }}>{activity.date}</Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default RecentActivity;
