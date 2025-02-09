import { StyleSheet, Dimensions } from "react-native"
import { Colors } from "../../../../constants/Colors"
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors"

const { width } = Dimensions.get("window")

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    width: "100%",
    height: width * 0.6,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
    maxWidth: "100%",
  },
  titleContainer: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  currency: {
    fontSize: 18,
    color: "#666",
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 2,
    textAlign: "right",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },

  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    maxWidth: "100%",
    width: "100%",
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
    marginTop: 10,
    textAlign: "center",
    maxWidth: "100%",
    textTransform: "uppercase",
    letterSpacing: 1,
    lineHeight: 24,
    paddingRight: 20,
    
  },

  chart: {
    borderRadius: 16,
    marginTop: 20,
    right: 0,
    // borderWidth: 1,
    backgroundColor: "#fff",
    width: "100%",
   
  
  },

  chartWrapperContainer: {
    marginVertical: 8,
    borderRadius: 16,
    maxWidth: "100%",
    width: "100%",
    borderColor: "black",
    borderWidth: 0.5,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
  
  },

  chartWrapper: {
  
   width: "100%",
   maxWidth: "100%",
    
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
    maxWidth: "100%",
    width: "100%",
    paddingLeft : 10,
    paddingRight: 10,
   
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    maxWidth: "100%",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 40,
    width: 1,
    backgroundColor: "#f0f0f0",
  },
  actionButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#2E7D32",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#666",
    fontSize: 14,
  },
  satisfactionText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.primary,
    textAlign: "center",
    marginTop: 10,
  },
  additionalInfo: {
    marginTop: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
  },
  additionalInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  additionalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  additionalInfoLabel: {
    fontSize: 14,
    color: "#666",
  },
  additionalInfoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  toggleButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
   
    maxWidth:'100%',
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
})

