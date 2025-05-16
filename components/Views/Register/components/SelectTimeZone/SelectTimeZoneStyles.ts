import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    fontWeight: 500,
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
  },
  modalContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    height: 350,
    width: 300,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  containerScroll: {
    width: "100%",
    flex: 1,
  },
  buttonTz: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    borderRadius: 4,
    paddingVertical: 6,
  },
});
