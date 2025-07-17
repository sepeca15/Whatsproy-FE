import type React from "react";
import { Text, type TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <Text allowFontScaling={false} style={[{ fontFamily: "System" }, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
