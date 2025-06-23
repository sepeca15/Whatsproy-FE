import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../../../constants/Colors";

const { width } = Dimensions.get("window");
const dynamicFontSize = width * 0.02; // Ajusta el porcentaje según sea necesario

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 20,
  },
  backButton: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.light.primary,
  },
  imageUpload: {
    alignItems: "center",
    marginVertical: 20,
    width: width * 0.9,
    height: width * 0.6,
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  uploadPlaceholder: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  uploadText: {
    marginTop: 10,
    color: Colors.light.primary,
    fontSize: 16,
  },
  formContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    fontWeight: "600",
  },
  input: {
  
    borderColor: "#ddd",
    borderRadius: 8,
    height: 50,
    padding: 12,
   
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  inputfile: {
    marginBottom: 20,
  },



  inputarea: {

    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  column: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    height: 50,
  },
  picker: {
    display:'flex',
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
   modalContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },

  modalScrollContent: {
    paddingBottom: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.light.icon,
  },

  cancelButtonText: {
    color: Colors.light.icon,
  },

  createButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
