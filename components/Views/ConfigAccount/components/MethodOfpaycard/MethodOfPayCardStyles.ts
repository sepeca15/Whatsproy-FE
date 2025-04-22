import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  MainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  WhiteText: {
    color: "white",
  },
  WhiteTextBold: {
    color: "white",
    fontWeight: "bold",
  },
  ContainerRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  ContainerRowAdventage: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ContainerAdvantages: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  containerCardMethodOfPay: {
    margin: 10,
    backgroundColor: "black",
    width: 225,
    height: 400,
    borderRadius: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 20,
  },
  ContainerCircle: {
    width: 16,
    height: 16,
    backgroundColor: "white",
    borderRadius: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  ContainerHeader: {
    width: "100%",
    alignSelf: "flex-start",
    marginBottom: 40,
  },
  ContainerFooter: {
    width: "100%",
    alignSelf: "flex-end",
  },
  ContainerMostPopular: {
    width: 225,
    padding: 10,
    height: 60,
    marginBottom: -20,
    backgroundColor: "#323232",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  ButtonBuyNow: {
    alignContent: "flex-start",
    backgroundColor: "#323232",
  },
});
