import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tableContent: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  column: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  text: {
    fontSize: 12,
    color: "gray",
    fontWeight: "900",
  },
  buttonEdit: {
    padding: 0,
    margin: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  columnName: {
    flex: 1.8,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  columnDelete: {
    flex: 0.5,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
});
