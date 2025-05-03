"use client";

import type React from "react";
import { Text, TouchableOpacity } from "react-native";
import { HStack, Box, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FormattedMessage } from "react-intl";
import { removeData } from "@/storage/localStorage";
import { Shadow } from 'react-native-shadow-2';



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
      id: "logout",
      icon: "log-out-outline",
      label: "profile.logout",
      defaultMessage: "Cerrar sesión",
      route: "/(auth)/login",
      onPress: async () => {
        await removeData("token");
        router.replace("/(auth)/login");
      },
    },
  ];

  return (
    <Shadow
      distance={5}
      startColor={'rgba(0, 0, 0, 0.05)'}
      endColor={'rgba(0, 0, 0, 0.01)'}
      offset={[0, 2]}
      style={{ width: '100%', marginBottom: 12 }}
    >
      <Box bg="white" borderRadius="lg" p={4} >
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
          <FormattedMessage
            id="profile.quickActions"
            defaultMessage="Acciones rápidas"
          />
        </Text>

        <HStack flexWrap="wrap" justifyContent="center">
          {actions.map((action, index) => (
            <TouchableOpacity
              key={action.id}
              style={{
                width: "45%",
                minWidth: 140,
                marginBottom: 12,
                maxWidth: "50%",
                alignSelf: actions.length % 2 !== 0 && index === actions.length - 1 ? "center" : "auto",
                marginRight: "2.5%",
                flexShrink: 1,
              }}
              onPress={() => {
                if (action.onPress) {
                  action.onPress();
                } else {
                  router.push(action.route as any);
                }
              }}
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
    </Shadow>
  );
};

export default QuickActions;
