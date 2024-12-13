import React from "react";
import { Button, IButtonProps } from "native-base";
import CustomText from "./CustomText";
import { StyleSheet } from "react-native";
import * as Progress from 'react-native-progress';

interface CustomButtonProps extends IButtonProps {
  children: React.ReactNode;
  background?: string;
  isDisabled?: boolean;
  loading?: boolean;
  colorSpiner?: string,
}

const CustomButton = ({ children, background = "#128c7e", isDisabled = false, variant = "solid", colorSpiner='#128c7e' , loading, ...props }: CustomButtonProps) => {
  const buttonBackgroundColor = isDisabled ? "#d3d3d3" : background;

  return (
    <Button
      style={styles.containerButton}
      bg={buttonBackgroundColor}
      variant={variant}
      isDisabled={isDisabled}
      {...props}
    >
      {
        loading ?
          <Progress.Circle color={colorSpiner} indeterminate={true} size={20} />
          :
          <CustomText style={styles.buttonText}>
            {children}
          </CustomText>
      }
    </Button>
  );
}


CustomButton.displayName = "CustomButton";

const styles = StyleSheet.create({
  containerButton: {
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    borderRadius: 5,
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CustomButton;
