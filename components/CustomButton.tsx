import React from "react";
import { Button, IButtonProps } from "native-base";
import CustomText from "./CustomText";
import { StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

interface CustomButtonProps extends IButtonProps {
  children: React.ReactNode;
  background?: string;
  isDisabled?: boolean;
  loading?: boolean;
  colorSpiner?: string;
}

const CustomButton = ({
  children,
  background = "#128c7e",
  isDisabled = false,
  variant = "solid",
  colorSpiner = background === "#128c7e" ? "white" : "#128c7e",
  loading,
  ...props
}: CustomButtonProps) => {
  const backgroundWithOpacity = `${background}90`;
  const buttonBackgroundColor = isDisabled ? backgroundWithOpacity : background;

  return (
    <Button
      style={styles.containerButton}
      bg={buttonBackgroundColor}
      variant={variant}
      isDisabled={isDisabled || loading}
      onPress={(e) => {
        if (props.onPress && !loading) {
          props.onPress(e);
        }
      }}
      {...props}
    >
      {loading ? (
        <Progress.Circle color={colorSpiner} indeterminate={true} size={20} />
      ) : (
        <CustomText style={styles.buttonText}>{children}</CustomText>
      )}
    </Button>
  );
};

CustomButton.displayName = "CustomButton";

const styles = StyleSheet.create({
  containerButton: {
    height: 45,
    display: "flex",
    paddingLeft: 20,
    paddingRight: 20,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    borderRadius: 5,
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CustomButton;
