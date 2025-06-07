import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  imagePicker: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: Colors.light.text,
    textAlign: "center",
  },
  icon: {
    marginRight: 10,
    color: Colors.light.primary,
  },
  input: {
    width: "100%",
    height: 40,
    color: "#333333",
    fontSize: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
  },

  placeholderText: {},
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonCreate: {
    backgroundColor: "black",
    borderRadius: 4,
    width: 100,
  },
  marginCont: {
    marginLeft: 6,
  },
  focused: {
    borderColor: "black",
    backgroundColor: "#f2f2f2",
  },
});

export default styles;
