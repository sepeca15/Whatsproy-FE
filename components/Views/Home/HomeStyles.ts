import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  dateText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  iconButton:{
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: 32,
  },
  metricsContainer: {
    padding: 16,
  },
  metricCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 4,
    textAlign: "center",
  },
  metricSubtitle: {
    fontSize: 10,
    color: Colors.light.icon,
    marginTop: 2,
  },
  lastActivitiesContainer: {
    padding: 16,
  },
  lastActivityCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  lastActivityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lastActivityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  lastActivityTime: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  lastActivityContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lastActivityInfo: {
    flex: 1,
  },
  lastActivityId: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  lastActivityAmount: {
    fontSize: 14,
    color: Colors.light.primary,
    marginTop: 2,
  },
  lastActivityExtra: {
    fontSize: 14,
    color: Colors.light.secondary,
    marginTop: 2,
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
    paddingRight: 16,
    maxWidth: "100%",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 12,
    
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 8,
  },
   emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      height: Dimensions.get('window').height * 0.4,
    },
    emptyStateAnimation: {
      width: 150,
      height: 150,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      color: Colors.light.primary,
    },
    emptyStateSubtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginTop: 10,
      paddingHorizontal: 20,
    },
});

export default styles;
