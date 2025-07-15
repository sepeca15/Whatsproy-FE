import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../../constants/Colors";

export const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
    imageRecognitionButton: {
    position: "absolute",
    right: 15,
    top: 15,
    bottom: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  emptyClientsSubtext: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    width: "100%",
  },
  scrollViewContent: {
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 80,
    width: "100%",
  },
  updatingOverlay: {},
  scrollView: {
    width: "100%",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    margin: 10,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
    color: "#888",
    fontSize: 18,
  },
  searchBar: {
    flex: 1,
    height: "100%",
    borderColor: "#ccc",
    borderWidth: 0,
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    fontSize: 16,
  },

  graficButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  clearButton: {
    padding: 8,
  },
  clearIcon: {
    color: "#888",
    fontSize: 18,
  },
  categoryContainer: {
    paddingTop: 12,
    marginBottom: 5,
    height: 110,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginHorizontal: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 80,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  selectedCategoryButton: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
    shadowOpacity: 0.2,
    elevation: 5,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
  selectedCategoryText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: "100%",
  },
  emptyStateAnimation: {
    width: 200,
    height: 200,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: Colors.light.primary,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  // Actualizar estos estilos en tu archivo ProductosStyles.js

  dayCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#075e54",
  },

  addItemButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#075e54",
  },

  menuItemsContainer: {
    gap: 12,
  },

  menuItemCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  menuItemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  menuItemInfo: {
    flex: 1,
    paddingRight: 8,
  },

  menuItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
    marginBottom: 4,
  },

  menuItemDescription: {
    fontSize: 14,
    color: "#687076",
    marginBottom: 6,
    lineHeight: 18,
  },

  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#075e54",
  },

  menuItemActions: {
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },

  editItemButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#128c7e",
    minWidth: 32,
    alignItems: "center",
  },

  deleteItemButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E74C3C",
    minWidth: 32,
    alignItems: "center",
  },

  emptyDayContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },

  emptyDayText: {
    fontSize: 14,
    color: "#687076",
    textAlign: "center",
  },

  floatingAddButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#075e54",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonText: {
    fontSize: 12,
    textAlign: "center",
  },
  dayTitleContainer: {
    flex: 1,
  },
  daySchedule: {
    fontSize: 12,
    color: "#687076",
    marginTop: 2,
    fontStyle: "italic",
  },
  notificationSection: {
    backgroundColor: "white",
    marginHorizontal: 10,
    marginBottom: 16,
    marginTop: 10,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  disabledSection: {
    backgroundColor: "#f8f9fa",
    opacity: 0.7,
  },

  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginLeft: 8,
    flex: 1,
  },

  disabledText: {
    color: Colors.light.icon,
  },

  notificationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary + "10",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary + "20",
  },

  disabledButton: {
    backgroundColor: "#f0f0f0",
    borderColor: "#e0e0e0",
  },

  notificationButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.primary,
    marginLeft: 8,
    flex: 1,
  },

  disabledHint: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 8,
    fontStyle: "italic",
  },

  // Modal Content Styles
  modalContent: {
    flex: 1,
    paddingTop: 16,
  },

  modalDescription: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.light.text,
  },

  clientsList: {
    paddingHorizontal: 16,
  },

  clientNotificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  clientDetails: {
    marginLeft: 12,
    flex: 1,
  },

  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 2,
  },

  clientPhone: {
    fontSize: 14,
    color: Colors.light.icon,
  },

  notificationToggle: {
    marginLeft: 16,
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },

  emptyClients: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },

  emptyClientsText: {
    fontSize: 16,
    color: Colors.light.icon,
    marginTop: 16,
    textAlign: "center",
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  scheduleActions: {
    flexDirection: "row",
    gap: 8,
    marginRight: 6,
  },
  addScheduleButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: Colors.light.primary + "20",
  },
  editScheduleButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: Colors.light.secondary + "20",
  },
  noScheduleContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  noScheduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 4,
  },
  noScheduleSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  noScheduleText: {
    color: Colors.light.danger,
    fontStyle: "italic",
  },
});
