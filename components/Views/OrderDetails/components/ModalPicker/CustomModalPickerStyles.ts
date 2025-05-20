import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        position: "absolute",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    containerContent: {
        borderRadius:12,
        width: "90%",
        backgroundColor: "white",
        maxHeight: "80%",
        overflow: "hidden",
    },
    elements: {
        maxHeight:'80%',
        padding:20,
    },
    header: {
        backgroundColor: Colors.light.primary,
        color:'white',
        paddingVertical:20,
        paddingHorizontal:20,
    },
    element: {
        width:"100%",
        paddingVertical:15,
        paddingHorizontal:15,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:4,
        borderRadius:4

    }
})