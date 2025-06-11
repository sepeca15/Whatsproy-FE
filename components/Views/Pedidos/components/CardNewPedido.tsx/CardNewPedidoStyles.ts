import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  semiBold: {
    fontWeight: "semibold",
    color: "white",
  },
  name: {
    flex:1,
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  text: {
    color: "#D1D5DB",
  },
  reclamoBox: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FBBF24",
  },

  reclamoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  reclamoText: {
    color: "#92400e",
    fontWeight: "bold",
    marginLeft: 6,
  },

  reclamoDate: {
    marginTop: 2,
    fontSize: 12,
    color: "#78350f",
  },
  container: {
    position: "relative",
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 20,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    flex:1,
  },
  column2: {
    alignItems: "flex-end",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  row1: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: "#1F2937",
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
  },
    row3: {
      flex:1,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
  },
  nuevo: {
    backgroundColor: "#bfdbfe",
    color: "#1e3a8a",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 100,
    fontWeight: "bold",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  detalles: {
    gap: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonTransparent: {
    backgroundColor: 'transparent'
  },
  separator: {
    marginTop: 10,
  },
  miniSeparator: {
    marginTop: 5,
  },
  buttonsTop: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  deleteButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    top: 0,
    padding: 6,
  },
});
