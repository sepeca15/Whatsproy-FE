import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  containerSpiner: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  containerImage: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 125,
  },
  spinerCenter: {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    marginVertical:8
  }
});
