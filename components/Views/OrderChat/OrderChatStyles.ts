import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/Colors";

// Colores principales
const primaryColor = Colors.light.primary;
const secondaryColor = Colors.light.secondary;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: secondaryColor,
    backgroundColor: primaryColor,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  messageContainer: {
    padding: 10,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dateDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dateText: {
    fontSize: 12,
    color: "#64748B",
    marginHorizontal: 8,
  },
  clientMessage: {
    alignSelf: "flex-end",
    backgroundColor: secondaryColor,
    borderRadius: 12,
    borderTopRightRadius: 4,
    padding: 12,
    marginVertical: 4,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  agentMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    borderTopLeftRadius: 4,
    padding: 12,
    marginVertical: 4,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  clientMessageText: {
    color: "#FFFFFF",
  },
  agentMessageText: {
    color: "#1E293B",
  },
  timeText: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  clientTimeText: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  agentTimeText: {
    color: "#94A3B8",
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  footerText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 14,
  },
});
