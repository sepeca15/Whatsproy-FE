import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  father: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  containerItems: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    backgroundColor: "black",
    width: "60%",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    borderBottomWidth: 0.5,
    borderColor: "#dbdbdb",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  cardText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  textDesc: {
    flexWrap: "wrap",
    maxWidth: "90%",
    color: "#939393",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  col: {
    flex: 1,
    marginLeft: 12,
  },
  rounded: {
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: "gray",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
