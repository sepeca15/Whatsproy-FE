import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"
import { Colors } from "@/constants/Colors"

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  pickerContainer: {
    backgroundColor:Colors.light.secondary,
    color:'white',
    width:150,
    borderRadius:100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },

  loadingText: {
    color: Colors.light.text,
    marginTop: 15,
    fontSize: RFValue(15),
    fontWeight: "500",
  },

  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  headerTitle: {
    color: "white",
    fontSize: RFValue(17),
    fontWeight: "600",
    marginLeft: 15,
  },

  scrollViewContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 25,
  },

  orderNumberCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  orderNumberContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  orderNumberLabel: {
    fontSize: RFValue(12),
    color: Colors.light.icon,
    marginBottom: 4,
  },

  orderNumberValue: {
    fontSize: RFValue(18),
    fontWeight: "600",
    color: Colors.light.text,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.light.secondary,
  },

  statusText: {
    color: "white",
    fontSize: RFValue(12),
    fontWeight: "500",
  },

  orderDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  orderDateText: {
    marginLeft: 8,
    fontSize: RFValue(13),
    color: Colors.light.icon,
  },

  sectionCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    marginLeft: 10,
    fontSize: RFValue(15),
    fontWeight: "600",
    color: Colors.light.text,
  },

  estimateTimeValue: {
    fontSize: RFValue(22),
    fontWeight: "600",
    color: Colors.light.primary,
    textAlign: "center",
  },

  estimateTimeUnit: {
    fontSize: RFValue(15),
    fontWeight: "400",
    color: Colors.light.icon,
  },

  clientName: {
    fontSize: RFValue(16),
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 12,
  },

  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },

  addressText: {
    marginLeft: 8,
    fontSize: RFValue(13),
    color: Colors.light.text,
    flex: 1,
    flexWrap: "wrap",
  },

  productsList: {
    marginBottom: 15,
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  totalLabel: {
    fontSize: RFValue(15),
    fontWeight: "600",
    color: Colors.light.text,
  },

  totalValue: {
    fontSize: RFValue(18),
    fontWeight: "700",
    color: Colors.light.primary,
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 15,
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  deleteButtonText: {
    marginLeft: 8,
    fontSize: RFValue(14),
    fontWeight: "500",
    color: Colors.light.text,
  },

  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  chatButtonText: {
    marginLeft: 8,
    fontSize: RFValue(14),
    fontWeight: "500",
    color: "white",
  },
})
