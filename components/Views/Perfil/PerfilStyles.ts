import { StyleSheet } from "react-native"
import { Colors } from "../../../constants/Colors"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loader: {
    marginTop: 32,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  plan: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 200,
    borderWidth: 4,
    borderColor: Colors.light.primary,
  },
  largeAvatar: {
    width: 300,
    height: 300,
    borderRadius: 200,
  },
  inProgress: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
})
