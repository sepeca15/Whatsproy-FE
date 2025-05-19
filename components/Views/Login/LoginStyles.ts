import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    height:'100%',
    justifyContent: "center",
  },
  textPrimary: {
    textAlign:'center',
    color: Colors.light.primary,
    display: "flex",
  },
  textSecondary: {
    color: Colors.light.secondary,
    textDecorationLine: "underline",
  },
  containerImage: {
    alignItems: "center",
    display:'flex',
    justifyContent:'center'
  },
});
