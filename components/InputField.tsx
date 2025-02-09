import React, { useRef } from 'react';
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

  const inputRef = useRef<any>(null);

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
          _stack={{ style: {} }} 
          {...props as any}
        />
      ) : (
        <Input
          ref={inputRef}
          autoFocus={false}
          _stack={{ style: {} }} 
          InputLeftElement={icon}
          keyboardType={keyboardType}
          type={type}
<<<<<<< HEAD
          placeholder={typeof placeholder === 'string' ? placeholder : undefined}
=======
          blurOnSubmit={false}
          placeholder={placeholder}
>>>>>>> 27f7b16c561a7bda988eb4f51bedc0172bd7f3b0
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