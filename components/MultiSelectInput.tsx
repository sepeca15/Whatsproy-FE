"use client";

import type React from "react";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  VStack,
  Badge,
  Text,
  View,
  Spinner,
  Button,
  Input,
  Icon as NBIcon,
} from "native-base";
import InputField from "./InputField";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useToastContext } from "@/contexts/ToastContext";
import { FlatList, TouchableOpacity, StyleSheet } from "react-native";
import TapSensitiveInput from "./TapSensitiveInput/TapSensitiveInput";
import { useIntl } from "react-intl";
import GenericModal from "./Views/ConfigAccount/components/GenericModal/GenericModal";

interface ItemAdd {
  name: string;
  type: string;
}

interface Option {
  label: string | any;
  value: string | number;
  placeholder?: string;
  subText?: string;
}

interface MultiSelectInputProps {
  placeholder?: string;
  label?: string;
  options: Option[];
  setItemsSelected: (items: any[]) => void;
  handleProductSelection?: (value: any, isSelected: boolean) => void;
  isRequired?: boolean;
  isMultiple?: boolean;
  onSearch?: (query: string) => void;
  loading?: boolean;
  error?: string;
  initialStateAdd?: ItemAdd[];
  actionToAddItem?: (data: any) => Promise<void>;
  height?: number;
  sizeText?: number;
  itemsSelected?: any[];
  withAdd?: boolean;
  disabled?: boolean;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  placeholder = "Seleccionar opciones",
  label = "Opciones",
  options = [],
  isRequired = false,
  loading = false,
  isMultiple = true,
  error,
  setItemsSelected,
  handleProductSelection,
  onSearch,
  initialStateAdd,
  actionToAddItem,
  height,
  sizeText,
  withAdd = true,
  itemsSelected = [],
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemsKeys, setSelectedItemsKeys] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const hasInitialSearchRun = useRef(false);

  const { showToast } = useToastContext();
  const intl = useIntl();

  useEffect(() => {
    if (initialStateAdd && initialStateAdd.length > 0) {
      const initialValues = initialStateAdd.reduce(
        (acc, item) => ({ ...acc, [item.name]: "" }),
        {}
      );
      setFormValues(initialValues);
    }
  }, [initialStateAdd]);

  const itemsSelectedString = JSON.stringify(itemsSelected);
  useEffect(() => {
    if (itemsSelected && Array.isArray(itemsSelected)) {
      const newSelectedKeys = itemsSelected.map(String);
      setSelectedItemsKeys((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newSelectedKeys)) {
          return newSelectedKeys;
        }
        return prev;
      });
    }
  }, [itemsSelectedString]);

  useEffect(() => {
    if (onSearch && searchQuery !== undefined) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        onSearch(searchQuery);
      }, 500);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    if (onSearch && !hasInitialSearchRun.current) {
      hasInitialSearchRun.current = true;
      onSearch("");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectionToggle = useCallback(
    (value: string | number) => {
      const stringValue = String(value);
      let updatedSelected: string[];

      if (!isMultiple) {
        updatedSelected = [stringValue];
      } else {
        updatedSelected = selectedItemsKeys.includes(stringValue)
          ? selectedItemsKeys.filter((key) => key !== stringValue)
          : [...selectedItemsKeys, stringValue];
      }

      setSelectedItemsKeys(updatedSelected);
      setItemsSelected(updatedSelected);
      handleProductSelection?.(value, !selectedItemsKeys.includes(stringValue));
    },
    [selectedItemsKeys, setItemsSelected, isMultiple, handleProductSelection]
  );

  const handleFieldChange = useCallback((name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const areAllFieldsFilled = useMemo(() => {
    if (!initialStateAdd || initialStateAdd.length === 0) return false;
    return initialStateAdd.every((item) => formValues[item.name]?.trim());
  }, [initialStateAdd, formValues]);

  const handleCreateItem = useCallback(async () => {
    if (!actionToAddItem || !areAllFieldsFilled) {
      showToast({
        title: intl.formatMessage({ id: "error", defaultMessage: "Error" }),
        descripcion: intl.formatMessage({
          id: "fillAllFields",
          defaultMessage: "Debe llenar todos los campos",
        }),
        status: "error",
      });
      return;
    }

    setIsCreating(true);
    try {
      await actionToAddItem(formValues);
      setIsAddModalOpen(false);

      // Reset form values
      if (initialStateAdd) {
        const resetValues = initialStateAdd.reduce(
          (acc, item) => ({ ...acc, [item.name]: "" }),
          {}
        );
        setFormValues(resetValues);
      }

      showToast({
        title: intl.formatMessage({ id: "success", defaultMessage: "Éxito" }),
        descripcion: intl.formatMessage({
          id: "itemCreatedSuccessfully",
          defaultMessage: "Elemento creado exitosamente",
        }),
        status: "success",
      });
    } catch (error) {
      showToast({
        title: intl.formatMessage({ id: "error", defaultMessage: "Error" }),
        descripcion: intl.formatMessage({
          id: "errorCreatingItem",
          defaultMessage: "Error al crear el elemento",
        }),
        status: "error",
      });
    } finally {
      setIsCreating(false);
    }
  }, [
    actionToAddItem,
    areAllFieldsFilled,
    formValues,
    initialStateAdd,
    intl,
    showToast,
  ]);

  const selectedOptionsText = useMemo(() => {
    if (selectedItemsKeys.length === 0) return "";

    return selectedItemsKeys
      .map((key) => {
        const option = options.find((item) => String(item.value) === key);
        return option?.placeholder || option?.label || "";
      })
      .filter(Boolean)
      .join(", ");
  }, [selectedItemsKeys, options]);

  const renderOptionItem = useCallback(
    ({ item }: { item: Option }) => {
      const itemValue = String(item.value);
      const isSelected = selectedItemsKeys.includes(itemValue);

      return (
        <TouchableOpacity
          style={[styles.optionItem, isSelected && styles.selectedOptionItem]}
          onPress={() => handleSelectionToggle(item.value)}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <View style={styles.optionTextContainer}>
              <Text allowFontScaling={false}
                style={[
                  styles.optionLabel,
                  isSelected && styles.selectedOptionLabel,
                ]}
              >
                {item.label}
              </Text>
              {item.subText && (
                <Text allowFontScaling={false} style={styles.optionSubText}>{item.subText}</Text>
              )}
            </View>
            <View
              style={[styles.checkbox, isSelected && styles.selectedCheckbox]}
            >
              {isSelected && <Feather name="check" size={16} color="white" />}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [selectedItemsKeys, handleSelectionToggle]
  );

  const renderSelectedBadges = useCallback(() => {
    if (selectedItemsKeys.length === 0) return null;

    return (
      <View style={styles.badgesContainer}>
        {selectedItemsKeys.map((key, index) => {
          const option = options.find((item) => String(item.value) === key);
          const displayText = option?.placeholder || option?.label || "";

          return (
            <Badge
              key={`badge-${key}-${index}`}
              style={styles.badge}
              variant="solid"
              colorScheme="primary"
              rounded="full"
            >
              <View style={styles.badgeContent}>
                <Text allowFontScaling={false} style={styles.badgeText}>
                  {displayText}
                  {option?.subText}
                </Text>
                <TouchableOpacity
                  onPress={() => handleSelectionToggle(key)}
                  style={styles.badgeRemove}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                >
                  <Feather name="x" size={12} color="white" />
                </TouchableOpacity>
              </View>
            </Badge>
          );
        })}
      </View>
    );
  }, [selectedItemsKeys, options, handleSelectionToggle]);

  const renderSearchHeader = useCallback(
    () => (
      <View style={styles.searchContainer}>
        <Input
          allowFontScaling={false}
          borderColor={"gray.400"}
          placeholder={intl.formatMessage(
            { id: "searchPlaceholder", defaultMessage: "Buscar {label}..." },
            { label: label.toLowerCase() }
          )}
          value={searchQuery}
          onChangeText={setSearchQuery}
          variant="filled"
          bg="gray.50"
          borderRadius="12"
          py="3"
          px="4"
          fontSize="14"
          InputLeftElement={
            <NBIcon
              as={<Feather name="search" />}
              size={5}
              ml="3"
              color="muted.400"
            />
          }
          InputRightElement={
            searchQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearSearch}
              >
                <Feather name="x" size={16} color={Colors.light.icon} />
              </TouchableOpacity>
            ) : undefined
          }
        />
      </View>
    ),
    [searchQuery, label, intl]
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <MaterialIcons name="search-off" size={48} color={Colors.light.icon} />
        <Text allowFontScaling={false} style={styles.emptyStateText}>
          {intl.formatMessage({
            id: "noResultsFound",
            defaultMessage: "No se encontraron resultados",
          })}
        </Text>
        {searchQuery && (
          <Text allowFontScaling={false} style={styles.emptyStateSubtext}>
            {intl.formatMessage({
              id: "tryDifferentSearch",
              defaultMessage: "Intenta con un término diferente",
            })}
          </Text>
        )}
      </View>
    ),
    [searchQuery, intl]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAddModalClose = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  return (
    <VStack space={3}>
      <TapSensitiveInput
        label={label}
        error={error}
        isRequired={isRequired}
        height={height}
        sizeText={sizeText}
        placeholder={placeholder}
        setIsModalOpen={setIsModalOpen}
        value={selectedOptionsText}
        disabled={disabled}
      />

      {renderSelectedBadges()}

      <GenericModal
        visible={isModalOpen}
        onClose={handleModalClose}
        title={intl.formatMessage(
          { id: "selectOptions", defaultMessage: "Seleccionar {label}" },
          { label: label.toLowerCase() }
        )}
        actions={[
          {
            label: `${intl.formatMessage({ id: "add", defaultMessage: "Agregar" })} ${label}`,
            onPress: () => setIsAddModalOpen(true),
            style: "secondary",
            icon: "plus",
          },
          {
            label: intl.formatMessage({
              id: "accept",
              defaultMessage: "Aceptar",
            }),
            onPress: handleModalClose,
            style: "primary",
            disabled: loading,
          },
        ]}
      >
        <View style={styles.modalContent}>
          {onSearch && renderSearchHeader()}

          <FlatList
            data={options}
            renderItem={renderOptionItem}
            keyExtractor={(item) => `option-${item.value}`}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.optionsList}
            extraData={selectedItemsKeys}
          />
        </View>
      </GenericModal>

      {/* Add New Item Modal */}
      {withAdd && (
        <GenericModal
          visible={isAddModalOpen}
          onClose={handleAddModalClose}
          title={intl.formatMessage(
            { id: "addNew", defaultMessage: "Agregar {label}" },
            { label: label.toLowerCase() }
          )}
        >
          <View style={styles.addModalContent}>
            {initialStateAdd?.map((item, index) => (
              <View key={`field-${index}`} style={styles.formField}>
                <InputField
                  label={intl.formatMessage(
                    { id: "enterField", defaultMessage: "Ingresar {field}" },
                    { field: item.name }
                  )}
                  keyboardType={item.type as any}
                  isRequired
                  value={formValues[item.name] || ""}
                  placeholder={intl.formatMessage(
                    { id: "enterField", defaultMessage: "Ingresar {field}" },
                    { field: item.name }
                  )}
                  onChangeText={(value) => handleFieldChange(item.name, value)}
                />
              </View>
            ))}

            <View style={styles.addModalActions}>
              <Button
                style={styles.cancelButton}
                variant="outline"
                onPress={handleAddModalClose}
                disabled={isCreating}
              >
                <Text allowFontScaling={false} style={styles.cancelButtonText}>
                  {intl.formatMessage({
                    id: "cancel",
                    defaultMessage: "Cancelar",
                  })}
                </Text>
              </Button>

              <Button
                style={styles.createButton}
                onPress={handleCreateItem}
                disabled={!areAllFieldsFilled || isCreating}
              >
                {isCreating ? (
                  <Spinner color="white" size="sm" />
                ) : (
                  <Text allowFontScaling={false} style={styles.createButtonText}>
                    {intl.formatMessage({
                      id: "create",
                      defaultMessage: "Crear",
                    })}
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </GenericModal>
      )}
    </VStack>
  );
};

const styles = StyleSheet.create({
  // Badges
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  badgeRemove: {
    padding: 2,
  },

  modalContent: {
    flex: 1,
  },
  searchContainer: {
    marginBottom: 16,
  },
  clearSearch: {
    marginRight: 12,
    padding: 4,
  },

  // Options List
  optionsList: {
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 16,
  },
  optionItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    elevation: 2,
    borderColor: "#f0f0f0",
  },
  selectedOptionItem: {
    borderColor: Colors.light.primary,
    // backgroundColor: "rgba(7, 94, 84, 0.05)",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  selectedOptionLabel: {
    color: Colors.light.primary,
  },
  optionSubText: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCheckbox: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.icon,
    marginTop: 12,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 4,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Add Button
  addButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(7, 94, 84, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(7, 94, 84, 0.2)",
    borderStyle: "dashed",
  },
  addIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.primary,
  },

  modalActions: {
    paddingTop: 16,
    marginTop: -15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  acceptButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  acceptButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Add Modal
  addModalContent: {
    paddingVertical: 8,
  },
  formField: {
    marginBottom: 16,
  },
  addModalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelButton: {
    flex: 1,
    borderColor: Colors.light.icon,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: Colors.light.icon,
    fontSize: 14,
    fontWeight: "500",
  },
  createButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
  },
  createButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MultiSelectInput;
