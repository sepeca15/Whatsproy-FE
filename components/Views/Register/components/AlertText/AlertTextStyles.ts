import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        marginVertical:12,
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#ffebeb',
        paddingVertical:10,
        paddingHorizontal:10,
        borderLeftColor:'#ce0202',
        borderLeftWidth:4,
        gap:2
    },
    text: {
        color: '#ce0202',
        flexShrink: 1, 
        flexWrap: 'wrap', 
    },
    icon: {
        marginRight: 8,
    },
})