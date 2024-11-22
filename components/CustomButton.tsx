import React from "react";
import { Pressable, IPressableProps } from "native-base";
import CustomText from "./CustomText";
import { StyleSheet } from "react-native";

interface CustomButtonProps extends IPressableProps {
  children: React.ReactNode;
  background?: string;
  isDisabled?: boolean; // Añadido para gestionar el estado deshabilitado
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  background = '#128c7e',
  isDisabled = false,
  ...props
}) => {
  // Si está deshabilitado, cambia el color de fondo a gris
  const buttonBackgroundColor = isDisabled ? '#d3d3d3' : background;

  return (
    <Pressable {...props} isDisabled={isDisabled}>
      <CustomText style={[styles.buttonText, { backgroundColor: buttonBackgroundColor }]}>
        {children}
      </CustomText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CustomButton;
