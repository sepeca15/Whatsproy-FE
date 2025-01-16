import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Negro transparente
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent:'center'
    },
    containerContent: {
        width:200,
        height:200,
        backgroundColor:'white',
    }
  });