import React from 'react';
import { FormControl, Input } from 'native-base';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: 'text' | 'password';
  onChangeText?: (text: string) => void;
  marginTop?: number,
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
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
        onChangeText={onChangeText}
      />
    </FormControl>
  );
};

export default InputField;
