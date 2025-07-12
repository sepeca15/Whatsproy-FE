import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const dynamicFontSize = width * 0.02;

interface AddButtonProps {
  route?: string;
  onPress?: any;
}

const AddButton: React.FC<AddButtonProps> = ({ route, onPress }) => {
  const router = useRouter();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (onPress) {
            onPress();
          } else if (route) {
            router.push(route as any);
          }
        }}
        disabled={!route && !onPress}
      >
        <Ionicons name="add" size={dynamicFontSize * 3} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AddButton;
