import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        borderRadius: 10,
        marginBottom:15,
    },
    data: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom:20
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    Column: {
        flex:1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    buttons: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap:12,
    },
    icon: {
        marginRight: 12,
        height: 40,
        width: 40,
        backgroundColor: '#e9e9e9',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    textName: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000035'
    },
    textCorreo: {
        color: '#8e8e95'
    },
    buttonEdit : {
        paddingHorizontal:10,
        paddingVertical:6,
        borderRadius:4,
        borderColor:'#7a7ab0',
        opacity:0.6,
        borderWidth:1,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:12,
    },
    buttonDelete : {
        backgroundColor:'#DC2626',
        paddingHorizontal:10,
        paddingVertical:6,
        borderRadius:4,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:12,
    },
    textEdit : {
        color:'#000035'
    },
    textDelete: {
        color:'white'
    },
    statusUser: {
        display:'flex',
        flexDirection:'row',
        alignSelf:'flex-start',
        alignItems:'center',
        justifyContent:'space-between',
        gap:6,
        borderRadius:4,
        paddingHorizontal:6,
        paddingVertical:2
    }
});

export default styles;

