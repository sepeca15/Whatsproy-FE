import React from "react";
import { Button, IButtonProps } from "native-base";
import CustomText from "./CustomText";
import { StyleSheet, View } from "react-native";
import * as Progress from "react-native-progress";

interface CustomButtonProps extends IButtonProps {
  children: React.ReactNode;
  background?: string;
  isDisabled?: boolean;
  loading?: boolean;
  colorSpiner?: string;
  icon?: React.ReactNode;  // <--- Nueva prop opcional
}

const CustomButton = ({
  children,
  background = "#128c7e",
  isDisabled = false,
  variant = "solid",
  colorSpiner = background === "#128c7e" ? "white" : "#128c7e",
  loading,
  icon,
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
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <CustomText style={styles.buttonText}>{children}</CustomText>
        </View>
      )}
    </Button>
  );
};

CustomButton.displayName = "CustomButton";

const styles = StyleSheet.create({
  containerButton: {
    height: 45,
    display: "flex",
    minWidth: 140,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
  iconContainer: {
    marginRight: 8,
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
