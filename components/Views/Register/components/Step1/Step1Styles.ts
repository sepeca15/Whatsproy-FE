import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  containerImage: {
    alignItems: "center",
  },
  textCenterLg: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  imagePicker: {
    position: "absolute",
    right: 10,
    bottom: 0,
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 200,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
