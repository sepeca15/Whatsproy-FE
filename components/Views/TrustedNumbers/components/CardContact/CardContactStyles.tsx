import { StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"

export const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3.84,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border + "40",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.primary + "30",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 2,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactPhone: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: "500",
  },
  badgeContainer: {
    marginTop: 4,
  },
  trustedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.success + "15",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    alignSelf: "flex-start",
  },
  trustedText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.light.success,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  callButton: {
    borderRadius: 12,
  },
  callButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.primary + "30",
  },
  deleteButton: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  deleteButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
})
