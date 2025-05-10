import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Dimensions } from "react-native";


const { width } = Dimensions.get("window");
const dynamicFontSize = width * 0.02; // Ajusta el porcentaje según sea necesario

export const styles = StyleSheet.create({
  dataPoint: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  monthLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  chartTitle: {
    fontSize: dynamicFontSize, // Tamaño dinámico
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  legend: {
    marginTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
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
      fontSize: dynamicFontSize * 1.2,
      fontWeight: "bold",
      color: "#fff",
    },
    container: {
      flex: 1,
    },
    chartWrapper: {
      marginBottom: 20,
    },
    title: {
      fontSize: 30,
      textAlign: "center",
    },
    orders: {
      marginTop: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      flex: 1,
    },
    Corders: {
      flex: 1,
      height: "100%",
      backgroundColor: "red",
    },
    tab: {
      marginVertical: 12,
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomColor: "#d4ece8",
      borderBottomWidth: 4,
    },
    containerTabItem: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "center",
      flex: 1 / 2,
    },
    pressable: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      width: "60%",
      paddingVertical: 12,
    },
    selected: {
      height: 4,
      width: "100%",
      backgroundColor: "#075e54",
      position: "absolute",
      bottom: -16,
      borderRadius: 12,
    },
    text: {
      textAlign: "center",
      fontSize: dynamicFontSize * 1.3, // Tamaño dinámico
      flexWrap: "wrap",
      flexShrink: 1,
    },
    column: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      flexWrap: "wrap",
    },
    addButtonText: {
      color: "#ffffff",
      fontSize: dynamicFontSize * 3, // Tamaño dinámico
      fontWeight: "semibold",
    },
  });

