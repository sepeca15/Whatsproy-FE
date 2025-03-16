import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const Styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  chartBackground: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
  },
  chart: {
    flex: 1,
    flexDirection: "row",
    height: 200,
    justifyContent: "space-between",
    alignItems: "flex-end",
    maxHeight: "90%",
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    maxHeight: "100%",
  },
  barWrapper: {
    maxHeight: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: screenWidth * 0.06,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    maxHeight: "100%",
  },
  monthLabel: {
    marginTop: 5,
    fontSize: 10,
    color: "#333",
  },
  tooltip: {
    position: "absolute",
    top: -15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    padding: 5,
    maxHeight: "100%",
    width: 30,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
  },
  scale: {
    width: "8%",
    justifyContent: "space-between",
    paddingVertical: 2,
    paddingBottom: 20,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  scaleStep: {
    alignItems: "flex-end",
    paddingRight: 5,
  },
  scaleText: {
    fontSize: 10,
    color: "#666",
  },
});
