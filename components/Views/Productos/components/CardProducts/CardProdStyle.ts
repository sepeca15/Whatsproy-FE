import { StyleSheet } from "react-native";
import Index from "../../../../../app/index";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    padding: 5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,

    marginRight: 15,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  price: {
    fontSize: 14,
    color: "#27ae60",
    marginVertical: 5,
  },
  description: {
    fontSize: 12,
    color: "#777",
  },
  moreButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalOptionText: {
    fontSize: 16,
  },
  disabledLabel: {
    position: "absolute",
    top: 40,
    left: "2%",
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  disabledText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
