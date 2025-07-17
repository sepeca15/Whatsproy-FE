import React, { useState } from "react";
import { View, Platform, Text, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (value: any) => {
    onValueChange(value);
    setIsModalVisible(false);
  };

  return (
    <View style={{ opacity: isDisabled ? 0.5 : 1 }}>
      {label && (
        <Text 
          allowFontScaling={false}
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#374151",
            marginBottom: 8,
          }}
        >
          {label}
          {isRequired && (
            <Text allowFontScaling={false} style={{ color: "#E53E3E" }}>
              {" "}
              *
            </Text>
          )}
        </Text>
      )}

      <TouchableOpacity
        disabled={isDisabled}
        onPress={() => setIsModalVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: error ? "#E53E3E" : "#ccc",
          borderRadius: 8,
          paddingHorizontal: 12,
          height: 50,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: isDisabled ? "#f3f4f6" : "#f9f9f9",
        }}
      >
        <Text 
          allowFontScaling={false}
          style={{
            fontSize: 16,
            color: selectedValue ? "#000" : "#999",
            flex: 1,
          }}
        >
          {displayText}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color="#999" 
        />
      </TouchableOpacity>

      {error && (
        <Text 
          allowFontScaling={false}
          style={{
            fontSize: 12,
            color: "#E53E3E",
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <TouchableWithoutFeedback>
              <View style={{
                backgroundColor: "white",
                borderRadius: 12,
                maxHeight: "70%",
                width: "85%",
                maxWidth: 400,
              }}>
                <View style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#e5e7eb",
                }}>
                  <Text 
                    allowFontScaling={false}
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#374151",
                      textAlign: "center",
                    }}
                  >
                    {label || "Seleccionar opción"}
                  </Text>
                </View>
                
                <ScrollView style={{ maxHeight: 300 }}>
                  {options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelect(option.value)}
                      style={{
                        padding: 16,
                        borderBottomWidth: index < options.length - 1 ? 1 : 0,
                        borderBottomColor: "#f3f4f6",
                        backgroundColor: selectedValue === option.value ? "#f0f9ff" : "transparent",
                      }}
                    >
                      <Text 
                        allowFontScaling={false}
                        style={{
                          fontSize: 16,
                          color: selectedValue === option.value ? "#0284c7" : "#374151",
                          fontWeight: selectedValue === option.value ? "600" : "400",
                        }}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  style={{
                    padding: 16,
                    borderTopWidth: 1,
                    borderTopColor: "#e5e7eb",
                  }}
                >
                  <Text 
                    allowFontScaling={false}
                    style={{
                      fontSize: 16,
                      color: "#6b7280",
                      textAlign: "center",
                      fontWeight: "500",
                    }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SelectField;
