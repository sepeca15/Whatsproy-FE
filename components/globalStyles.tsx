import { Colors } from "@/constants/Colors";
import { StyleSheet, Dimensions } from "react-native";




const { width } = Dimensions.get("window");
const dynamicFontSize = width * 0.02;


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

  addtext: {
    fontSize: dynamicFontSize * 3,
    fontWeight: "semibold",
    color: "#ffffff",
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
  header2: {
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
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent_datoPedido: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContent_categorias: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 10,
  },
  headerLef_categorias: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 30,
  },
  businessName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
  businessName_cierrepro: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

   businessName_confianza: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
