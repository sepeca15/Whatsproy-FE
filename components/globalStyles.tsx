import { Colors } from "@/constants/Colors";
import { StyleSheet, Dimensions } from "react-native";




const { width } = Dimensions.get("window");
const dynamicFontSize = width * 0.02; // Ajusta el porcentaje según sea necesario


export const globalStyles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
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
  addButtonText: {
    color: "#ffffff",
    fontSize: dynamicFontSize * 3, 
    fontWeight: "semibold",
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    padding: 12,
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
    marginHorizontal:4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:12
  },
  businessName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
});
