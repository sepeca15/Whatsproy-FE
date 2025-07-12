import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import InputField from "@/components/InputField";
import { useUser } from "@/hooks/redux/useUser";
import {
  ScrollView,
  Switch,
  View,
  VStack,
  Select,
  CheckIcon,
} from "native-base";
import * as React from "react";
import { TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import api from "@/services/api/admin";
import { useToastContext } from "@/contexts/ToastContext";
import { ICategoryData } from "../Categories/components/CardCategory/CardCategory";
import CustomHeader from "@/components/CustomHeader/CustomHeader";

interface IPriceUpdateForm {
  updateType: "all" | "category";
  selectedCategory: string;
  increaseType: "percentage" | "fixed";
  increaseValue: string;
  applyToActiveOnly: boolean;
}

const PriceManagementSettings = () => {
  const intl = useIntl();
  const router = useRouter();
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  const [hasChanges, setHasChanges] = React.useState<boolean>(false);
  const [categories, setCategories] = React.useState<ICategoryData[]>([]);

  const { showToast } = useToastContext();

  const [form, setForm] = React.useState<IPriceUpdateForm>({
    updateType: "all",
    selectedCategory: "",
    increaseType: "percentage",
    increaseValue: "",
    applyToActiveOnly: true,
  });

  const loadAllCategories = async () => {
    setLoadingApi(true);
    try {
      const resp = await api.category.getAll();

      if (resp.ok) {
        setCategories(resp.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false);
    }
  };

  React.useEffect(() => {
    loadAllCategories();
  }, []);

  const handleInputChange = (key: keyof IPriceUpdateForm, value: any) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    setHasChanges(true);
  };

  console.log("increaseType", form.increaseType);

  const handlePriceUpdate = async () => {
    if (!form.increaseValue || Number.parseFloat(form.increaseValue) <= 0) {
      showToast({
        title: intl.formatMessage({
          id: "toast.error.title",
          defaultMessage: "Error",
        }),
        description: intl.formatMessage({
          id: "toast.error.invalidValue",
          defaultMessage: "Por favor ingresa un valor válido para el aumento",
        }),
        status: "error",
      });
      return;
    }

    if (form.updateType === "category" && !form.selectedCategory) {
      showToast({
        title: intl.formatMessage({
          id: "toast.error.title",
          defaultMessage: "Error",
        }),
        description: intl.formatMessage({
          id: "toast.error.selectCategory",
          defaultMessage: "Por favor selecciona una categoría",
        }),
        status: "error",
      });
      return;
    }

    console.log("form.increaseType", form.increaseType);

    setLoadingApi(true);
    try {
      const updateData = {
        tipoActualizacion:
          form.increaseType === "fixed" ? "monto" : "porcentaje",
        valor: Number.parseFloat(form.increaseValue),
        categoriaId:
          form.updateType === "category"
            ? (form.selectedCategory as any)
            : null,
        soloDisponibles: form.applyToActiveOnly,
      };
      console.log("updateData", updateData);

      const resp = await api.products.updatePrices(updateData);

      if (resp?.ok) {
        showToast({
          title: intl.formatMessage({
            id: "toast.success.title",
            defaultMessage: "Éxito",
          }),
          description: intl.formatMessage({
            id: "toast.success.update",
            defaultMessage: "Precios actualizados correctamente.",
          }),
          status: "success",
        });
      } else {
        showToast({
          title: intl.formatMessage({
            id: "toast.error.title",
            defaultMessage: "Error",
          }),
          description: intl.formatMessage({
            id: "toast.error.updateFailed",
            defaultMessage: "Hubo un problema al actualizar los precios",
          }),
          status: "error",
        });
      }
      setHasChanges(false);
    } catch (error) {
      console.log(error);
      showToast({
        title: intl.formatMessage({
          id: "toast.error.title",
          defaultMessage: "Error",
        }),
        description: intl.formatMessage({
          id: "toast.error.apiFailure",
          defaultMessage: "No se pudieron actualizar los precios",
        }),
        status: "error",
      });
    } finally {
      setLoadingApi(false);
    }
  };

  const resetForm = () => {
    setForm({
      updateType: "all",
      selectedCategory: "",
      increaseType: "percentage",
      increaseValue: "",
      applyToActiveOnly: true,
    });
    setHasChanges(false);
  };

  const selectedCategoryData = categories.find(
    (cat) => cat.id.toString() === form.selectedCategory
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <CustomHeader
          title={
            <FormattedMessage
              id="priceManagementTitle"
              defaultMessage="Ajuste de Precios"
            />
          }
          onBack={() => router.back()}
          showBackButton
        />

        <View style={styles.containerGlobal}>
          <View style={styles.form}>
            {/* Tipo de actualización */}
            <View style={styles.section}>
              <CustomText style={styles.sectionTitle}>
                <FormattedMessage
                  id="updateScope"
                  defaultMessage="Alcance de la actualización"
                />
              </CustomText>

              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    form.updateType === "all" && styles.radioOptionSelected,
                  ]}
                  onPress={() => handleInputChange("updateType", "all")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      form.updateType === "all" && styles.radioCircleSelected,
                    ]}
                  >
                    {form.updateType === "all" && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <CustomText style={styles.radioTitle}>
                      <FormattedMessage
                        id="allProducts"
                        defaultMessage="Todos los productos"
                      />
                    </CustomText>
                    <CustomText style={styles.radioSubtitle}>
                      <FormattedMessage
                        id="updateAllProductsSubtitle"
                        defaultMessage="Actualizar precios de todos los productos del negocio"
                      />
                    </CustomText>
                  </View>
                  <MaterialIcons
                    name="inventory"
                    size={24}
                    color={Colors.light.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    form.updateType === "category" &&
                      styles.radioOptionSelected,
                  ]}
                  onPress={() => handleInputChange("updateType", "category")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      form.updateType === "category" &&
                        styles.radioCircleSelected,
                    ]}
                  >
                    {form.updateType === "category" && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <CustomText style={styles.radioTitle}>
                      <FormattedMessage
                        id="byCategory"
                        defaultMessage="Por categoría"
                      />
                    </CustomText>
                    <CustomText style={styles.radioSubtitle}>
                      <FormattedMessage
                        id="updateByCategorySubtitle"
                        defaultMessage="Actualizar precios de una categoría específica"
                      />
                    </CustomText>
                  </View>
                  <MaterialIcons
                    name="category"
                    size={24}
                    color={Colors.light.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Selección de categoría */}
            {form.updateType === "category" && (
              <View style={styles.section}>
                <CustomText style={styles.textInput}>
                  <FormattedMessage
                    id="selectCategory"
                    defaultMessage="Seleccionar categoría"
                  />
                </CustomText>
                <Select
                  selectedValue={form.selectedCategory}
                  minWidth="200"
                  accessibilityLabel={intl.formatMessage({
                    id: "selectCategory",
                  })}
                  placeholder={intl.formatMessage({ id: "selectCategory" })}
                  _selectedItem={{
                    bg: Colors.light.primary,
                    borderRadius: 20,
                    _text: {
                      color: "white",
                    },
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) =>
                    handleInputChange("selectedCategory", itemValue)
                  }
                  style={styles.select}
                >
                  {categories.map((category) => (
                    <Select.Item
                      key={category.id}
                      label={`${category.name} (${category?.productosCount ?? 0} productos)`}
                      value={category.id.toString()}
                    />
                  ))}
                </Select>

                {selectedCategoryData && (
                  <View style={styles.categoryInfo}>
                    <MaterialIcons
                      name="info"
                      size={16}
                      color={Colors.light.secondary}
                    />
                    <CustomText style={styles.categoryInfoText}>
                      <FormattedMessage
                        id="priceUpdateWarn"
                        defaultMessage={`Se actualizarán {count} productos de la categoría "{name}"`}
                        values={{
                          count: selectedCategoryData?.productosCount ?? 0,
                          name: selectedCategoryData.name,
                        }}
                      />
                    </CustomText>
                  </View>
                )}
              </View>
            )}

            {/* Tipo de aumento */}
            <View style={styles.section}>
              <CustomText style={styles.sectionTitle}>
                <FormattedMessage
                  id="increaseType"
                  defaultMessage="Tipo de aumento"
                />
              </CustomText>

              <View style={styles.increaseTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.increaseTypeButton,
                    form.increaseType === "percentage" &&
                      styles.increaseTypeButtonSelected,
                  ]}
                  onPress={() =>
                    handleInputChange("increaseType", "percentage")
                  }
                >
                  <MaterialIcons
                    name="percent"
                    size={20}
                    color={
                      form.increaseType === "percentage"
                        ? "white"
                        : Colors.light.primary
                    }
                  />
                  <CustomText
                    style={[
                      styles.increaseTypeText,
                      form.increaseType === "percentage" &&
                        styles.increaseTypeTextSelected,
                    ]}
                  >
                    <FormattedMessage
                      id="percentage"
                      defaultMessage="Porcentaje"
                    />
                  </CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.increaseTypeButton,
                    form.increaseType === "fixed" &&
                      styles.increaseTypeButtonSelected,
                  ]}
                  onPress={() => handleInputChange("increaseType", "fixed")}
                >
                  <MaterialIcons
                    name="attach-money"
                    size={20}
                    color={
                      form.increaseType === "fixed"
                        ? "white"
                        : Colors.light.primary
                    }
                  />
                  <CustomText
                    style={[
                      styles.increaseTypeText,
                      form.increaseType === "fixed" &&
                        styles.increaseTypeTextSelected,
                    ]}
                  >
                    <FormattedMessage
                      id="fixedAmount"
                      defaultMessage="Monto fijo"
                    />
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Valor del aumento */}
            <View style={styles.section}>
              <CustomText style={styles.textInput}>
                <FormattedMessage
                  id="increaseValue"
                  defaultMessage={`Valor del aumento ${form.increaseType === "percentage" ? "(%)" : "($)"}`}
                />
              </CustomText>
              <InputField
                keyboardType="numeric"
                placeholder={`Ingresa el ${form.increaseType === "percentage" ? "porcentaje" : "monto"} de aumento`}
                value={form.increaseValue}
                onChangeText={(value) =>
                  handleInputChange("increaseValue", value)
                }
                icon={
                  <MaterialIcons
                    style={{ marginLeft: 12 }}
                    color="#b6b6b6"
                    name={
                      form.increaseType === "percentage"
                        ? "percent"
                        : "attach-money"
                    }
                    size={20}
                  />
                }
              />

              {form.increaseValue && (
                <View style={styles.previewContainer}>
                  <CustomText style={styles.previewText}>
                    <FormattedMessage
                      id="increaseExample"
                      values={{
                        price:
                          form.increaseType === "percentage"
                            ? (
                                100 +
                                (95 *
                                  Number.parseFloat(
                                    form.increaseValue || "0"
                                  )) /
                                  100
                              ).toFixed(2)
                            : (
                                95 +
                                Number.parseFloat(form.increaseValue || "0")
                              ).toFixed(2),
                      }}
                    />
                  </CustomText>
                </View>
              )}
            </View>

            {/* Opciones adicionales */}
            <View style={styles.section}>
              <View style={styles.switchContainer}>
                <View style={styles.switchContent}>
                  <CustomText style={styles.textInput}>
                    <FormattedMessage
                      id="applyToActiveOnly"
                      defaultMessage="Solo productos activos"
                    />
                  </CustomText>
                  <CustomText style={styles.switchSubtitle}>
                    <FormattedMessage
                      id="activeOnlySubtitle"
                      defaultMessage="Aplicar aumento únicamente a productos disponibles"
                    />
                  </CustomText>
                </View>
                <Switch
                  isChecked={form.applyToActiveOnly}
                  onToggle={() =>
                    handleInputChange(
                      "applyToActiveOnly",
                      !form.applyToActiveOnly
                    )
                  }
                  size="lg"
                  colorScheme="primary"
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                colorSpiner="white"
                disabled={!hasChanges && !form.increaseValue}
                onPress={() => handlePriceUpdate()}
                loading={loadingApi}
                style={[
                  styles.button,
                  styles.primaryButton,
                  {
                    backgroundColor:
                      hasChanges && form.increaseValue
                        ? Colors.light.primary
                        : "#b6b6b6",
                  },
                ]}
                icon={
                  <MaterialIcons name="trending-up" size={20} color="white" />
                }
              >
                <CustomText style={styles.buttonText}>
                  <FormattedMessage
                    id="updatePrices"
                    defaultMessage="Actualizar Precios"
                  />
                </CustomText>
              </CustomButton>

              {hasChanges && (
                <CustomButton
                  onPress={resetForm}
                  style={[styles.button, styles.secondaryButton]}
                >
                  <VStack style={styles.rowButton}>
                    <MaterialIcons
                      name="refresh"
                      size={20}
                      color={Colors.light.primary}
                    />
                    <CustomText
                      style={[
                        styles.buttonText,
                        { color: Colors.light.primary },
                      ]}
                    >
                      <FormattedMessage
                        id="reset"
                        defaultMessage="Restablecer"
                      />
                    </CustomText>
                  </VStack>
                </CustomButton>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  containerGlobal: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  form: {
    flex: 1,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  radioContainer: {
    gap: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
  },
  radioOptionSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: `${Colors.light.primary}10`,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleSelected: {
    borderColor: Colors.light.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  radioContent: {
    flex: 1,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  radioSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  select: {
    backgroundColor: "white",
    borderColor: "#e0e0e0",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 8,
    backgroundColor: `${Colors.light.secondary}15`,
    borderRadius: 6,
  },
  categoryInfoText: {
    fontSize: 14,
    color: Colors.light.secondary,
    marginLeft: 6,
    flex: 1,
  },
  increaseTypeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  increaseTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    backgroundColor: "white",
  },
  increaseTypeButtonSelected: {
    backgroundColor: Colors.light.primary,
  },
  increaseTypeText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.primary,
    marginLeft: 8,
  },
  increaseTypeTextSelected: {
    color: "white",
  },
  previewContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: `${Colors.light.secondary}10`,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.secondary,
  },
  previewText: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  switchSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  primaryButton: {
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  rowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default PriceManagementSettings;
