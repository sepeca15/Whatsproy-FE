import { Hidden } from "native-base";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerTransparent: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  container: {
    width: "90%",
    backgroundColor: "white",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  containerForm: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    alignItems: "center",
  },
  containerStep1: {
    width: "90%",
    margin: "auto",
  },
  containerStep2: {
    width: "100%",
  },
  containerStep3: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ContainerHeader: {
    position:'relative',
    width: "100%",
    alignSelf: "flex-start",
  },
  ContainerFooter: {
    width: "100%",
    alignSelf: "flex-end",
    marginTop: 20,
  },
  test: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
