import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  plan: {
    fontSize: 14,
    color: "#666",
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
    backgroundColor: "#fff",
    borderRadius: 200,
  },
  largeAvatar: {
    width: 300,
    height: 300,
    borderRadius: 200,
  },
  inProgress: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
});
