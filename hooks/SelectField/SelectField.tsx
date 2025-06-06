import React from "react";
import { View, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FormControl } from "native-base";

interface SelectFieldProps {
    label?: string;
    selectedValue: any;
    onValueChange: (value: any) => void;
    placeholder?: string;
    options: { label: string; value: any }[];
    isRequired?: boolean;
    error?: string;
    isDisabled?: boolean;
    [key: string]: any;
}

const SelectField: React.FC<SelectFieldProps> = ({
    label,
    selectedValue,
    onValueChange,
    placeholder = "Seleccione una opción",
    options,
    isRequired = true,
    error,
    isDisabled = false,
    ...props
}) => {
    return (
        <FormControl isInvalid={!!error} isRequired={isRequired} isDisabled={isDisabled}>
            {label && <FormControl.Label>{label}</FormControl.Label>}

            <View
                style={{
                    borderWidth: 1,
                    borderColor: error ? "#E53E3E" : "#ccc",
                    borderRadius: 8,
                    paddingHorizontal: Platform.OS === "android" ? 4 : 0,
                    height: 50,
                    justifyContent: "center",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    enabled={!isDisabled}
                    mode="dropdown"
                    style={{
                        height: 50,
                        color: selectedValue ? "#000" : "#999",
                    }}
                    {...props}
                >
                    <Picker.Item label={placeholder} value={null} enabled={false} />
                    {options.map((opt, index) => (
                        <Picker.Item key={index} label={opt.label} value={opt.value} />
                    ))}
                </Picker>
            </View>

            {error && <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>}
        </FormControl>
    );
};

export default SelectField;
