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
  keyboardType?: any;
  isRequired?: boolean;
  error?: any;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  keyboardType,
  onChangeText,
  marginTop,
  isTextArea = false,
  isRequired = true,
  error,
  ...props
}) => {
  return (
    <FormControl isInvalid={error} style={{ marginTop: marginTop }} isRequired={isRequired}>
      {label && <FormControl.Label>{label}</FormControl.Label>}
      {isTextArea ? (
        <TextArea
          keyboardType={keyboardType}
          autoCompleteType={""}
          placeholder={placeholder}
          onChangeText={onChangeText}
          {...props}
        />
      ) : (
        <Input
          keyboardType={keyboardType}
          type={type}
          placeholder={placeholder}
          onChangeText={onChangeText}
          {...props}
        />
      )}
      {error && <FormControl.ErrorMessage>
        {error}
      </FormControl.ErrorMessage>}
    </FormControl>
  );
};

export default InputField;
