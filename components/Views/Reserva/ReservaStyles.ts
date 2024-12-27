import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  photoPlaceholder: {
    height: 200,
    backgroundColor: "#eee",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  statusText: {
    color: "#FF9800",
  },
  observationsInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
  },
  chatButtonText: {
    marginLeft: 8,
    color: "#007AFF",
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
