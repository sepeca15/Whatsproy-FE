"use client";

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { styles } from "./CustomHeaderStyles";

interface GradientHeaderProps {
  title: any;
  subtitle?: any;
  onBack?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  bottomComponent?: React.ReactNode;
  gradientColors?: string[];
  animationDuration?: number;
  style?: any;
}

const CustomHeader: React.FC<GradientHeaderProps> = ({
  title,
  subtitle,
  onBack,
  showBackButton = true,
  rightComponent,
  bottomComponent,
  gradientColors = [Colors.light.primary, Colors.light.primary + "E6"],
  animationDuration = 0,
  style,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <LinearGradient
      colors={gradientColors as any}
      style={[styles.headerGradient, style]}
    >
      <View style={{ flexDirection: "column", width: "100%", gap: 5 }}>
        <View
          style={styles.headerContent}
        >
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}

          <View
            style={[
              styles.headerTextContainer,
              !showBackButton && styles.headerTextContainerNoBack,
            ]}
          >
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
          </View>

          {rightComponent && (
            <View style={styles.rightComponent}>{rightComponent}</View>
          )}
        </View>

        {bottomComponent && (
          <View style={{ paddingHorizontal: 20 }}>{bottomComponent}</View>
        )}
      </View>
    </LinearGradient>
  );
};

export default CustomHeader;
