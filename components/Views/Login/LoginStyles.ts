import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      justifyContent: "center",
    },
    textPrimary: {
      color: Colors.light.primary,
    },
    textSecondary: {
      color: Colors.light.secondary,
      textDecorationLine: "underline"
    },
    containerImage: {
      alignItems: "center"
    },
});
