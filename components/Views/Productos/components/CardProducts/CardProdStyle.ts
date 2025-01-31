import { StyleSheet } from "react-native"
import { Colors } from "../../../../../constants/Colors"

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "row",
    overflow: "hidden",
    height: 150,
    width: "95%",
  },
  imageContainer: {
    width: 130,
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  titlePriceContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2ecc71",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moreButton: {
    padding: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    zIndex: 11,
  },
  categoryLabel: {
    position: "absolute",
    top: 3,
    left: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  categoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  containerFatehr: {
    width: "100%",
  },
  cardBack: {
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardBackContent: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 16,
  },
  cardBackButton: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
    width: "80%",
    marginVertical: 8,
    alignItems: "center",
  },
  cardBackButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  flipBackButton: {
    backgroundColor: "#3498db",
  },
  archiveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backIcon: {
    marginRight: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  flipButton: {
    position: "absolute",
    bottom: 8,
    right: 7,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 280,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  modalIcon: {
    width: 24,
    textAlign: "center",
  },
  modalIconColor: {
    backgroundColor: "#666",
  },
  editButton: {
    backgroundColor: "#f0f0f0",
  },
  archiveButton: {
    backgroundColor: "#f0f0f0",
  },
  deleteButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
})

