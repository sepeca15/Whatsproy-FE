import { StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"

export const styles = StyleSheet.create({
  // Header Info Button
  headerInfoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Day Cards
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dayTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.light.primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },

  // Schedules Container
  schedulesContainer: {
    gap: 8,
  },
  noSchedulesText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },

  // Schedule Items
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
  },

  // Loading Skeleton
  skeletonCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
  },
  skeletonHeader: {
    backgroundColor: "#ddd",
    height: 20,
    width: "40%",
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonContent: {
    backgroundColor: "#ddd",
    height: 16,
    width: "80%",
    borderRadius: 4,
  },

  // Modal Styles
  modalContent: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  inputIcon: {
    marginLeft: 12,
  },

  // Info Modal Styles
  infoModalContent: {
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    flex: 1,
  },
})
