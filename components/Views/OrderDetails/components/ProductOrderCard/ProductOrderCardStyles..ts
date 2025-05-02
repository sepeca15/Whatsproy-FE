import { StyleSheet } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"
import { Colors } from "@/constants/Colors"

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mainContent: {
    flexDirection: "row",
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  unitPrice: {
    fontSize: RFValue(13),
    fontWeight: "500",
    color: Colors.light.text,
  },
  unitLabel: {
    fontSize: RFValue(11),
    fontWeight: "400",
    color: Colors.light.icon,
  },
  quantity: {
    fontSize: RFValue(13),
    fontWeight: "500",
    color: "white",
    marginLeft: 8,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  description: {
    fontSize: RFValue(12),
    color: Colors.light.icon,
    marginTop: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  expandButtonText: {
    fontSize: RFValue(12),
    color: Colors.light.primary,
    marginRight: 4,
  },
  totalPrice: {
    fontSize: RFValue(16),
    fontWeight: "700",
    color: Colors.light.primary,
  },
})
