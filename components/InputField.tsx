import React from "react";
import { FormControl, Input } from "native-base";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  isRequired?: boolean;
  marginTop?: number,
  type?: 'text' | 'password';
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChangeText,
  marginTop
}) => {
  return (
    <FormControl style={{ marginTop: marginTop }}
      isRequired>
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
