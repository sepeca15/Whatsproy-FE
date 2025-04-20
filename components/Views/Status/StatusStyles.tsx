import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";


export const styles = StyleSheet.create({
    container: {

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
        marginBottom: 20,
      },
      headerContent: {
        flexDirection: "row",
        justifyContent: "flex-start",
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
      backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
      },
      headerTitle: {
        color: "white",
        fontSize: RFValue(17),
        fontWeight: "600",
        marginLeft: 15,
      },
      title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 24,
        color: Colors.light.text,
        textAlign: "center",
      },
})