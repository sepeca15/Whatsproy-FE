import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
    },
    input: {
        marginVertical:10,
        borderColor:Colors.dark.primary,
        borderWidth:1,
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:5,
    },
    AuthCodeText: {
        textAlign:'center',
        color:Colors.light.primary,
        fontWeight:'900',
        fontSize:24,
        marginVertical:20,
    },
    ContainerStepsImages: {
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
    },
    image: {
        width:300,
        height:200,
    },
    bold: {
        fontWeight:'bold'
    }
    

})