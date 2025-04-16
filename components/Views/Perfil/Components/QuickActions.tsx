"use client";

import type React from "react";
import { Text, TouchableOpacity } from "react-native";
import { HStack, Box, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FormattedMessage } from "react-intl";

const QuickActions: React.FC = () => {
  const router = useRouter();

  const actions = [
    {
      id: "edit-profile",
      icon: "person-outline",
      label: "profile.edit",
      defaultMessage: "Editar perfil",
      route: "/(tabs)/usuarios",
    },
    {
      id: "notifications",
      icon: "notifications-outline",
      label: "profile.notifications",
      defaultMessage: "Notificaciones",
      route: "/(tabs)/home",
    },
    {
      id: "security",
      icon: "shield-outline",
      label: "profile.security",
      defaultMessage: "Seguridad",
      route: "/(tabs)/config",
    },
    {
      id: "help",
      icon: "help-circle-outline",
      label: "profile.help",
      defaultMessage: "Ayuda",
      route: "/(tabs)/config",
    },
  ];

  return (
    <Box bg="white" borderRadius="lg" p={4} shadow={2} mb={4}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        <FormattedMessage
          id="profile.quickActions"
          defaultMessage="Acciones rápidas"
        />
      </Text>

      <HStack flexWrap="wrap" justifyContent="space-between">
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={{ width: "48%", marginBottom: 12 }}
            onPress={() => router.push(action.route as any)}
          >
            <Box
              bg="rgba(7, 94, 84, 0.1)"
              p={3}
              borderRadius="md"
              alignItems="center"
              flexDirection="row"
            >
              <Icon
                as={Ionicons}
                name={action.icon}
                size="sm"
                color="#075e54"
                mr={2}
              />
              <Text style={{ fontSize: 14 }}>
                <FormattedMessage
                  id={action.label}
                  defaultMessage={action.defaultMessage}
                />
              </Text>
            </Box>
          </TouchableOpacity>
        ))}
      </HStack>
    </Box>
  );
};

export default QuickActions;
