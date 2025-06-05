import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    header: {
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
    containerGlobal: {
        padding: 16,
        width: "100%",
        marginHorizontal: "auto",
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    container: {
        flex: 1,
    },
    form: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,

        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    notifReserva: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderBottomWidth: 0.3,
        paddingBottom:4,
        borderColor: 'gray'
    },
    row1: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    row1Custom: {
        height: 30,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    row2: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
    },
    colum: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    column2: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    button: {
        width: "100%",
        height: 50,
        display: "flex",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 16,
    },
    rowButton: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    container1: {
        display: 'flex',
        flexDirection: "column",
        width: '100%',
        alignItems: 'center',
        gap: 8,
    },
    inputContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
    },
    containerNotifReserva: {
        marginVertical: 20,
    },
    containerHorasReserva: {
        marginVertical: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8
    },
    textInput: {
        fontSize:14,
        color:'black'
    }
});