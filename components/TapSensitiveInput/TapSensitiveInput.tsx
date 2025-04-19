import React, { useRef } from "react";
import { Pressable, GestureResponderEvent } from "react-native";
import { FormControl, Input } from "native-base";

const TapSensitiveInput = ({
  label,
  error,
  isRequired,
  height,
  sizeText,
  placeholder,
  setIsModalOpen,
  value,
}: any) => {
  const touchY = useRef(0);

  const handlePressIn = (e: GestureResponderEvent) => {
    touchY.current = e.nativeEvent.pageY;
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    const deltaY = Math.abs(e.nativeEvent.pageY - touchY.current);
    if (deltaY < 10) {
      setIsModalOpen(true);
    }
  };

  return (
    <FormControl isInvalid={error} isRequired={isRequired}>
      <FormControl.Label>{label}</FormControl.Label>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Input
          isReadOnly
          value={value}
          placeholder={placeholder}
          borderColor="coolGray.300"
          backgroundColor="coolGray.50"
          style={{
            height: height ?? "auto",
            fontSize: sizeText ? sizeText : 12,
          }}
        />
      </Pressable>
      {error && <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>}
    </FormControl>
  );
};

export default TapSensitiveInput;
