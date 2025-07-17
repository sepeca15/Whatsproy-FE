import React, { useRef } from "react";
import { FormControl, Input, TextArea, View } from "native-base";
import MaskInput from "react-native-mask-input";

interface InputFieldProps {
  label?: React.ReactNode;
  placeholder: React.ReactNode;
  value?: string;
  onChangeText?: (text: string) => void;
  marginTop?: number;
  isTextArea?: boolean;
  [key: string]: any;
  keyboardType?: any;
  isDisabled?: boolean;
  isRequired?: boolean;
  error?: any;
  icon?: any;
  isTime?: boolean;
  bg?: string
}

const RoundedInputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  keyboardType,
  onChangeText,
  marginTop,
  isTextArea = false,
  isRequired = true,
  icon,
  error,
  isTime,
  isDisabled,
  bg,
  ...props
}) => {
  const inputRef = useRef<any>(null);

  return (
   <FormControl
  isDisabled={isDisabled}
  isInvalid={!!error}
  style={{ marginTop: marginTop }}
  isRequired={isRequired}
>
  <View>
    <View
      display="flex"
      flexDirection="row"
      alignItems="center"
      rounded="full"
      bg={bg ? bg : "gray.100"}
      px={6}
      py={2}
    >
      {icon}
      <Input
        allowFontScaling={false}
        ref={inputRef}
        autoFocus={false}
        keyboardType={keyboardType}
        type={type}
        placeholder={typeof placeholder === "string" ? placeholder : undefined}
        onChangeText={onChangeText}
        variant="unstyled"
        {...props}
      />
    </View>

    {error && (
      <FormControl.ErrorMessage mt={1} ml={3}>
        {error}
      </FormControl.ErrorMessage>
    )}
  </View>
</FormControl>

  );
};

export default RoundedInputField;
