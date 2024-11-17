import { View } from "native-base"
import { StyleSheet } from "react-native";


const Layout = ({children}: any) => {
    return <View style={styled.mainContainer}>
        {children}
        <View style={styled.navigationMenu}></View>
    </View>
}

const styled = StyleSheet.create({
    mainContainer:{
        flex:1,
    },
    navigationMenu: {
        height:40,
        width:"100%",
        backgroundColor:"red"
    }
})


export default Layout;