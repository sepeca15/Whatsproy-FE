import React from "react";
import { Pressable, IPressableProps } from "native-base";
import CustomText from "./CustomText";

interface CustomButtonProps extends IPressableProps {
  onPress: () => void;
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  children,
  ...props
}) => {
  return (
    <Pressable onPress={onPress} {...props}>
      <CustomText style={styles.buttonText}>{children}</CustomText>
    </Pressable>
  );
};

const styles = {
  buttonText: {
    padding: 10,
    backgroundColor: "#128c7e",
    borderRadius: 5,
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
};

export default CustomButton;
