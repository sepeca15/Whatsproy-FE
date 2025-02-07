import React from 'react';
import { FormControl, Input, TextArea } from 'native-base';

interface InputFieldProps {
  label?: React.ReactNode; // Acepta elementos JSX
  placeholder: React.ReactNode; // Acepta elementos JSX
  value?: string;
  onChangeText?: (text: string) => void;
  marginTop?: number;
  isTextArea?: boolean;
  [key: string]: any;
  keyboardType?: any;
  isRequired?: boolean;
  error?: any;
  icon?: any;
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
  icon,
  error,
  ...props
}) => {
  return (
    <FormControl isInvalid={error} style={{ marginTop: marginTop }} isRequired={isRequired}>
      {label && <FormControl.Label>{label}</FormControl.Label>}
      {isTextArea ? (
        <TextArea
          InputLeftElement={icon}
          keyboardType={keyboardType}
          autoCompleteType={""}
          placeholder={typeof placeholder === 'string' ? placeholder : undefined}
          onChangeText={onChangeText}
          {...props}
        />
      ) : (
        <Input
          InputLeftElement={icon}
          keyboardType={keyboardType}
          type={type}
          placeholder={typeof placeholder === 'string' ? placeholder : undefined}
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