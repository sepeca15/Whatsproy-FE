"use client"

import React, { useState } from "react"
import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useIntl } from "react-intl"

interface SelectOption {
  label: string
  value: string
}

interface AnimatedSelectProps {
  selectedValue: string | undefined
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
}

const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
  selectedValue,
  onValueChange,
  options,
  placeholder = "Seleccionar...",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const intl = useIntl()

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const selectItem = (value: string) => {
    onValueChange(value)
    closeModal()
  }

  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label || placeholder

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.selectButton}>
        <Text style={styles.selectButtonText}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <SafeAreaView style={styles.modalWrapper}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Seleccionar período</Text>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                      <Ionicons name="close" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.optionsContainer}>
                    {options.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.optionItem,
                          selectedValue === option.value && styles.selectedOption,
                        ]}
                        onPress={() => selectItem(option.value)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selectedValue === option.value && styles.selectedOptionText,
                          ]}
                        >
                          {option.label}
                        </Text>
                        {selectedValue === option.value && (
                          <Ionicons name="checkmark" size={16} color="#075e54" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 40,
  },
  selectButtonText: {
    fontSize: 12,
    color: "#374151",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrapper: {
    width: "100%",
    maxWidth: 300,
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedOption: {
    backgroundColor: "rgba(7, 94, 84, 0.1)",
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  selectedOptionText: {
    color: "#075e54",
    fontWeight: "600",
  },
})

export default AnimatedSelect
