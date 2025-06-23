import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: Colors.light.primary,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerTitle: {
    color: "white",
    fontSize: RFValue(17),
    fontWeight: "600",
    marginLeft: 15,
  },
  containerGlobal: {
    padding: 16,
    width: "100%",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  form: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  notifReserva: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    borderBottomWidth: 0.3,
    paddingBottom: 4,
    borderColor: "gray",
  },
  row1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row1Custom: {
    height: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row2: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  colum: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  column2: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  button: {
    width: "100%",
    height: 50,
    display: "flex",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  rowButton: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  container1: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  inputContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  containerNotifReserva: {
    marginVertical: 20,
  },
  containerHorasReserva: {
    marginVertical: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  textInput: {
    fontSize: 14,
    color: "black",
  },
  logoSection: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "100%",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },

  logoHeader: {
    flexDirection: "row",
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
    alignSelf: "flex-start",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginLeft: 8,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
    backgroundColor: Colors.light.background,
    borderWidth: 3,
    borderColor: Colors.light.primary + "20",
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 47,
  },

  logoEditOverlay: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },

  logoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  logoIconContainer: {
    backgroundColor: Colors.light.primary + "15",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  logoPlaceholderText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
    textAlign: "center",
  },

  logoLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 47,
  },

  logoSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    borderTopColor: "transparent",
    marginBottom: 8,
    // Add animation here if needed
  },

  uploadingText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },

  logoHint: {
    fontSize: 13,
    color: Colors.light.icon,
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    fontWeight: "500",
  },
  addressSection: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  addressInputContainer: {
    marginTop: 8,
  },

  addressInput: {
    minHeight: 60,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  addressHint: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 8,
    fontStyle: "italic",
    lineHeight: 16,
  },
});
