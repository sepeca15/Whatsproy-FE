import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      justifyContent: "center",
    },
    textCenterLg: {
      textAlign: "center",
      fontSize: 18,
    },
    textPrimary: {
      color: Colors.light.primary,
    },
    textSecondary: {
      color: Colors.light.secondary,
      textDecorationLine: "underline",
    },
    containerImage: {
      alignItems: "center"
    },
  });
  