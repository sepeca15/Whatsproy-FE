"use client";

import type React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { FormattedMessage } from "react-intl";
import { Colors } from "@/constants/Colors";
import { styles } from "./CardContactStyles";

interface CardContactProps {
  nombre: string;
  telefono: string;
  clickDeleteAction: () => void;
  index?: number;
}

const CardContact: React.FC<CardContactProps> = ({
  nombre,
  telefono,
  clickDeleteAction,
  index = 0,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPhoneNumber = (phone: string) => {
    // Basic phone formatting - can be enhanced based on locale
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length >= 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  };

  return (
    <Animated.View entering={FadeInDown.duration(600).delay(index * 100)}>
      <View style={styles.container}>
        <LinearGradient colors={["#ffffff", "#f8fafc"]} style={styles.gradient}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[
                Colors.light.primary + "25",
                Colors.light.primary + "15",
              ]}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>
                {getInitials(nombre || "?")}
              </Text>
            </LinearGradient>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: Colors.light.success },
                ]}
              />
            </View>
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactName} numberOfLines={1}>
              {nombre || (
                <FormattedMessage
                  id="trustedNumbers.card.noName"
                  defaultMessage="Sin nombre"
                />
              )}
            </Text>
            <View style={styles.phoneContainer}>
              <MaterialIcons
                name="phone"
                size={14}
                color={Colors.light.textSecondary}
              />
              <Text style={styles.contactPhone} numberOfLines={1}>
                {formatPhoneNumber(telefono)}
              </Text>
            </View>
            <View style={styles.badgeContainer}>
              <View style={styles.trustedBadge}>
                <MaterialIcons
                  name="verified"
                  size={12}
                  color={Colors.light.success}
                />
                <Text style={styles.trustedText}>
                  <FormattedMessage
                    id="trustedNumbers.card.trusted"
                    defaultMessage="Confianza"
                  />
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            {/* <TouchableOpacity style={styles.callButton} activeOpacity={0.7}>
              <LinearGradient
                colors={[
                  Colors.light.primary + "25",
                  Colors.light.primary + "15",
                ]}
                style={styles.callButtonGradient}
              >
                <Ionicons name="call" size={16} color={Colors.light.primary} />
              </LinearGradient>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={clickDeleteAction}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[Colors.light.danger, Colors.light.danger + "DD"]}
                style={styles.deleteButtonGradient}
              >
                <MaterialIcons name="delete-outline" size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

export default CardContact;
