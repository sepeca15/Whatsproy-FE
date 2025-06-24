import { Colors } from "@/constants/Colors";
import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";

interface CustomProgressBarProps {
  value: number; 
  max?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  style?: ViewStyle;
}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({
  value,
  max = 100,
  height = 6,
  color = Colors.light.primary,
  backgroundColor = "#e5e7eb",
  borderRadius = 5,
  style,
}) => {
  const safeValue = Number.isFinite(value)
    ? Math.min(max, Math.max(0, Number(value.toFixed(0))))
    : 0;

  const percentage = (safeValue / max) * 100;

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor,
          borderRadius,
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
});

export default CustomProgressBar;
