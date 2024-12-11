import React from "react";
import { FormControl, Input } from "native-base";

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  isRequired?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChangeText,
  isRequired = true,
}) => {
  return (
    <FormControl isRequired={isRequired}>
      <FormControl.Label>{label}</FormControl.Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </FormControl>
  );
};

export default InputField;
