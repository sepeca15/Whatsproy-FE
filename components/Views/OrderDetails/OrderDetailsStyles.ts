import { StyleSheet, Platform, StatusBar } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"
import { Colors } from "@/constants/Colors"

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  reclamoContainer: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 10,
    borderColor: "#FBBF24",
    borderWidth: 1,
  },
  reclamoDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  reclamoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  reclamoTitle: {
    color: "#92400e",
    fontWeight: "bold",
    marginLeft: 6,
  },
  reclamoText: {
    color: "#92400e",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    color: Colors.light.text,
    marginTop: 15,
    fontSize: RFValue(15),
    fontWeight: "500",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : StatusBar.currentHeight! + 10,
    paddingBottom: 10,
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    fontSize: RFValue(16),
    fontWeight: "600",
    color: "white",
  },
  headerRight: {
    flexDirection: "row",
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // Scroll Content
  scrollViewContent: {
    padding: 16,
    paddingBottom: 30,
  },

  // Order Summary Card
  orderSummaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  orderNumberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderNumberLabel: {
    fontSize: RFValue(12),
    color: Colors.light.icon,
    marginBottom: 4,
  },
  orderNumberValue: {
    fontSize: RFValue(18),
    fontWeight: "700",
    color: Colors.light.text,
  },
  orderDateLabel: {
    fontSize: RFValue(12),
    color: Colors.light.icon,
    marginBottom: 4,
    textAlign: "right",
  },
  orderDateValue: {
    fontSize: RFValue(14),
    fontWeight: "500",
    color: Colors.light.text,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 16,
  },
  statusSection: {
    marginTop: 4,
  },
  currentStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currentStatusLabel: {
    fontSize: RFValue(14),
    fontWeight: "500",
    color: Colors.light.text,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.light.secondary,
  },
  statusText: {
    color: "white",
    fontSize: RFValue(12),
    fontWeight: "500",
    marginRight: 4,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: RFValue(16),
    fontWeight: "600",
    color: Colors.light.text,
  },

  // Client Info
  clientInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  clientAvatarText: {
    color: "white",
    fontSize: RFValue(20),
    fontWeight: "600",
  },
  clientDetails: {
    marginLeft: 12,
  },
  clientName: {
    fontSize: RFValue(16),
    fontWeight: "600",
    color: Colors.light.text,
  },
  clientPhone: {
    fontSize: RFValue(13),
    color: Colors.light.icon,
    marginTop: 2,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
  },
  addressText: {
    marginLeft: 8,
    fontSize: RFValue(13),
    color: Colors.light.text,
    flex: 1,
    flexWrap: "wrap",
  },

  // Time Container
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    minHeight: 75,

  },
  estimateTimeValue: {
    fontSize: RFValue(24),
    fontWeight: "700",
    color: Colors.light.primary,
    marginLeft: 12,
    padding: "auto",
    height: "100%",
    paddingTop: 15,
  },
  estimateTimeUnit: {
    fontSize: RFValue(16),
    fontWeight: "400",
    color: Colors.light.icon,
    paddingTop: 20,



  },

  // Products
  productsList: {
    marginBottom: 16,
  },

  // Order Details
  orderDetailsContainer: {
    marginTop: 4,
  },
  detailItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: RFValue(12),
    color: Colors.light.icon,

    marginBottom: 4,
  },
  detailValue: {
    fontSize: RFValue(14),
    fontWeight: "500",
    color: Colors.light.text,
  },
  emptyDetailsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyDetailsText: {
    fontSize: RFValue(14),
    color: Colors.light.icon,
    marginTop: 8,
  },

  // Product Specifications
  productSpecification: {
    marginBottom: 12,
  },
  productSpecName: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 6,
  },
  specificationBubble: {
    backgroundColor: "rgba(18, 140, 126, 0.1)",
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.secondary,
  },
  productSpecDetail: {
    fontSize: RFValue(13),
    color: Colors.light.text,
  },
  generalNotes: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  generalNotesLabel: {
    fontSize: RFValue(14),
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  notesContainer: {
    backgroundColor: "rgba(7, 94, 84, 0.05)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  generalNotesText: {
    fontSize: RFValue(13),
    color: Colors.light.text,
    lineHeight: 20,
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
    fontSize: RFValue(16),
    fontWeight: "600",
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: RFValue(20),
    fontWeight: "700",
    color: Colors.light.primary,
  },

  // Chat Button
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  chatButtonText: {
    marginLeft: 8,
    fontSize: RFValue(16),
    fontWeight: "600",
    color: "white",
  },
  paymentLabel: {
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 4,
},
paymentValue: {
  fontSize: 16,
  marginBottom: 4,
},
paymentDescription: {
  fontSize: 14,
  color: '#555',
  marginBottom: 8,
},
paymentSpecs: {
  fontSize: 14,
  color: '#333',
  marginBottom: 8,
},
transferProofContainer: {
  marginTop: 8,
},
transferProofLabel: {
  fontWeight: 'bold',
  fontSize: 14,
  marginBottom: 4,
},
transferProofImage: {
  width: '100%',
  height: 200,
  borderRadius: 8,
},
modalBackground: {
  flex: 1,
  display: "flex",
  backgroundColor: 'rgba(0,0,0,0.95)',
  justifyContent: 'center',
  alignItems: 'center',
},
fullscreenImage: {
  width: '100%',
  height: '100%',
},
closeButton: {
  position: 'absolute',
  top: 120,
  zIndex: 2,
},
})
