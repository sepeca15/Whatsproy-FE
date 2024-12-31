import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding:10,
        flex:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    photo:{
        width:65,
        height:65,
        borderRadius:12,
        backgroundColor:'gray'
    },
    info: {
        marginLeft:20,
        flexGrow:1,
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        gap:6
    },
    price: {
        fontWeight:'bold',
        fontSize:20,
    },
    nameProduct : {
        fontSize:16,
        fontWeight:'bold'
    }, 
    cantidad: { 
        fontSize:14,
        color:"gray"
    }

    
})