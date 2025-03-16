import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  footer: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  buttonContinue: {
    width: 100,
    backgroundColor: "black",
    borderRadius: 8,
  },
  buttonCancel: {
    width: 100,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
  },
  message: {
    color: "#9b9b9b",
    marginTop: 4,
  },
  title: {
    textAlign: "left",
    fontWeight: "bold",
  },
});
