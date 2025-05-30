import React, { useRef } from "react";
import { FormControl, Input, TextArea } from "native-base";
import MaskInput from "react-native-mask-input";
import { StyleSheet } from "react-native";
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
}

const InputField: React.FC<InputFieldProps> = ({
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
  ...props
}) => {
  const inputRef = useRef<any>(null);

  return (
    <FormControl
      isDisabled={isDisabled}
      isInvalid={error}
      style={styles.input}
      isRequired={isRequired}
    >
      {label && <FormControl.Label>{label}</FormControl.Label>}
      {isTime ? (
        <MaskInput
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholder="HH:MM"
          mask={[/\d/, /\d/, ":", /\d/, /\d/]}
          style={{
            height: 38,
            borderWidth: 1,
            borderColor: error ? "red" : "#ccc",
            borderRadius: 8,
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}
          {...props}
        />
      ) : isTextArea ? (
        <TextArea
          InputLeftElement={icon}
          keyboardType={keyboardType}
          autoCompleteType={""}
          borderRadius={8}
          placeholder={
            typeof placeholder === "string" ? placeholder : undefined
          }
          onChangeText={onChangeText}
          _stack={{ style: {} }}
          {...(props as any)}
        />
      ) : (
        <Input
          borderRadius={8}
          ref={inputRef}
          autoFocus={false}
          _stack={{ style: {} }}
          InputLeftElement={icon}
          keyboardType={keyboardType}
          type={type}
          placeholder={
            typeof placeholder === "string" ? placeholder : undefined
          }
          onChangeText={onChangeText}
          {...props}
        />
      )}
      {error && <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>}
    </FormControl>
  );
};

export default InputField;

const styles = StyleSheet.create({
 input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    height: 50,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
});