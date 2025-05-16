import { StyleSheet, Dimensions, Platform } from "react-native"
import { Colors } from "../../../constants/Colors"

const { width } = Dimensions.get("window")

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    padding: 16,
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: Colors.light.primary,
        // borderBottomLeftRadius: 15,
        // borderBottomRightRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerLeft: {
    flex: 1,
  },
  businessName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: Colors.light.text,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  listContent: {
    paddingBottom: 80,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 0,
    borderRadius: 12,
    fontSize: 16,
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: "500",
  },
  buttonCreate: {
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#555",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
})
