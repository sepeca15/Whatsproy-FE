import React from 'react';
import { FormControl, Input, TextArea } from 'native-base';

interface InputFieldProps {
  label?: string;
  placeholder: string;
  type?: 'text' | 'password';
  onChangeText?: (text: string) => void;
  marginTop?: number;
  isTextArea?: boolean;
  [key: string]: any;
  isRequired?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  onChangeText,
  marginTop,
  isTextArea = false,
  isRequired = true,
  ...props
}) => {
  return (
    <FormControl style={{ marginTop: marginTop }} isRequired={isRequired}>
      {label && <FormControl.Label>{label}</FormControl.Label>}
      {isTextArea ? (
        <TextArea
          autoCompleteType={""}
          placeholder={placeholder}
          onChangeText={onChangeText}
          {...props}
        />
      ) : (
        <Input
          type={type}
          placeholder={placeholder}
          onChangeText={onChangeText}
          {...props}
        />
      )}
    </FormControl>
  );
};

export default InputField;
