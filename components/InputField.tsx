import React from 'react';
import { FormControl, Input } from 'native-base';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  onChangeText?: (text: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  onChangeText,
}) => {
  return (
    <FormControl isRequired>
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
