"use client";

import * as React from "react";
import { View, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Text, Spinner } from "native-base";
import InputField from "@/components/InputField";
import { useUser } from "@/hooks/redux/useUser";
import api from "@/services/api/admin";
import { useToastContext } from "@/contexts/ToastContext";
import { FormattedMessage, useIntl } from "react-intl";
import { Colors } from "@/constants/Colors";
import GenericModal from "@/components/Views/ConfigAccount/components/GenericModal/GenericModal";
import { useColorScheme } from "react-native";

interface IDateOrder {
  es_defecto: boolean;
  id?: number;
  id_tipo_servicio?: number;
  nombre: string;
  requerido: boolean;
  tipo: string;
}

interface IProps {
  data?: IDateOrder;
  visible: boolean;
  onClose: () => void;
  updateOrder: (newOrder: IDateOrder) => void;
}

const initialValues = {
  es_defecto: false,
  id_tipo_servicio: 1,
  nombre: "",
  requerido: false,
  tipo: "",
};

const ModalCreateOrderDate = ({
  data,
  visible,
  onClose,
  updateOrder,
}: IProps) => {
  const { user } = useUser();
  const { showToast } = useToastContext();
  const intl = useIntl();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  const [form, setForm] = React.useState<IDateOrder>(
    data ? data : initialValues
  );
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  // Reset form when modal opens/closes or data changes
  React.useEffect(() => {
    if (visible) {
      setForm(data ? data : initialValues);
      setErrors({});
    }
  }, [visible, data]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = intl.formatMessage({
        id: "orderData.nameRequired",
        defaultMessage: "El nombre del campo es requerido",
      });
    }

    if (form.requerido === undefined || form.requerido === null) {
      newErrors.requerido = intl.formatMessage({
        id: "orderData.requiredFieldRequired",
        defaultMessage: "Debes seleccionar si el campo es requerido",
      });
    }

    if (!form.tipo) {
      newErrors.tipo = intl.formatMessage({
        id: "orderData.typeRequired",
        defaultMessage: "Debes seleccionar el tipo de campo",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeValue = (key: string, value: any) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    // Clear error when user makes changes
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const createOrUpdateOrderData = async () => {
    if (!validateForm()) return;

    setLoadingApi(true);
    try {
      let response;
      if (data?.id) {
        response = await api.dataOrder.create({
          ...form,
          id_tipo_servicio: user.tipo_servicio,
        });
      }

      if (response) {
        updateOrder(response);
        onClose();
        showToast({
          title: intl.formatMessage({
            id: data?.id
              ? "orderData.updateSuccess"
              : "orderData.createSuccess",
            defaultMessage: data?.id
              ? "Campo actualizado exitosamente"
              : "Campo creado exitosamente",
          }),
          status: "success",
        });
      } else {
        showToast({
          title: intl.formatMessage({
            id: "unknownError",
            defaultMessage: "Error desconocido",
          }),
          status: "error",
        });
      }
    } catch (error: any) {
      showToast({
        title:
          error.response?.data?.message ??
          intl.formatMessage({
            id: "unknownError",
            defaultMessage: "Error desconocido",
          }),
        status: "error",
      });
    } finally {
      setLoadingApi(false);
    }
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case "string":
        return "📝";
      case "number":
        return "🔢";
      case "boolean":
        return "✅";
      case "date":
        return "📅";
      default:
        return "❓";
    }
  };

  const modalActions = [
    {
      label: intl.formatMessage({
        id: "common.cancel",
        defaultMessage: "Cancelar",
      }),
      onPress: onClose,
      style: "secondary" as const,
      disabled: loadingApi,
    },
    {
      label: loadingApi
        ? intl.formatMessage({
            id: "common.saving",
            defaultMessage: "Guardando...",
          })
        : intl.formatMessage({
            id: data?.id ? "common.update" : "common.create",
            defaultMessage: data?.id ? "Actualizar" : "Crear",
          }),
      onPress: createOrUpdateOrderData,
      style: "primary" as const,
      disabled: loadingApi,
    },
  ];

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      title={intl.formatMessage({
        id: data?.id ? "orderData.editTitle" : "orderData.createTitle",
        defaultMessage: data?.id
          ? "Editar campo personalizado"
          : "Crear campo personalizado",
      })}
      subtitle={intl.formatMessage({
        id: "orderData.subtitle",
        defaultMessage: "Configura campos adicionales para las órdenes",
      })}
      actions={modalActions}
      scrollable={true}
    >
      <View style={styles.container}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          <FormattedMessage
            id="orderData.description"
            defaultMessage="Define los campos personalizados que los clientes deberán completar al realizar una orden"
          />
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              <FormattedMessage
                id="orderData.nameLabel"
                defaultMessage="Nombre del campo"
              />
              <Text style={styles.required}> *</Text>
            </Text>
            <InputField
              value={form.nombre}
              onChangeText={(text) => handleChangeValue("nombre", text)}
              placeholder={intl.formatMessage({
                id: "orderData.namePlaceholder",
                defaultMessage: "Ej: Instrucciones especiales",
              })}
              style={[errors.nombre && styles.inputError]}
            />
            {errors.nombre && (
              <Text style={styles.errorText}>{errors.nombre}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              <FormattedMessage
                id="orderData.requiredLabel"
                defaultMessage="¿Es requerido?"
              />
              <Text style={styles.required}> *</Text>
            </Text>
            <View style={[styles.input, errors.requerido && styles.inputError]}>
              <RNPickerSelect
                value={form.requerido}
                onValueChange={(value) => handleChangeValue("requerido", value)}
                items={[
                  {
                    label: intl.formatMessage({
                      id: "common.yes",
                      defaultMessage: "Sí",
                    }),
                    value: true,
                  },
                  {
                    label: intl.formatMessage({
                      id: "common.no",
                      defaultMessage: "No",
                    }),
                    value: false,
                  },
                ]}
                placeholder={{
                  label: intl.formatMessage({
                    id: "orderData.selectRequired",
                    defaultMessage: "Selecciona una opción",
                  }),
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputAndroid: styles.inputElement,
                  inputIOS: styles.inputElement,
                  placeholder: styles.placeholderStyle,
                }}
              />
            </View>
            {errors.requerido && (
              <Text style={styles.errorText}>{errors.requerido}</Text>
            )}
          </View>

          {/* Type Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              <FormattedMessage
                id="orderData.typeLabel"
                defaultMessage="Tipo de campo"
              />
              <Text style={styles.required}> *</Text>
            </Text>
            <View style={[styles.input, errors.tipo && styles.inputError]}>
              <RNPickerSelect
                value={form.tipo}
                onValueChange={(value) => handleChangeValue("tipo", value)}
                items={[
                  {
                    label: `📝 ${intl.formatMessage({
                      id: "dateOrderTypeText",
                      defaultMessage: "Texto",
                    })}`,
                    value: "string",
                  },
                  {
                    label: `🔢 ${intl.formatMessage({
                      id: "dateOrderTypeNumber",
                      defaultMessage: "Número",
                    })}`,
                    value: "number",
                  },
                  {
                    label: `✅ ${intl.formatMessage({
                      id: "dateOrderTypeBoolean",
                      defaultMessage: "Sí/No",
                    })}`,
                    value: "boolean",
                  },
                  {
                    label: `📅 ${intl.formatMessage({
                      id: "dateOrderTypeDate",
                      defaultMessage: "Fecha",
                    })}`,
                    value: "date",
                  },
                ]}
                placeholder={{
                  label: intl.formatMessage({
                    id: "orderData.selectType",
                    defaultMessage: "Selecciona el tipo de campo",
                  }),
                  value: null,
                }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputAndroid: styles.inputElement,
                  inputIOS: styles.inputElement,
                  placeholder: styles.placeholderStyle,
                }}
              />
            </View>
            {errors.tipo && <Text style={styles.errorText}>{errors.tipo}</Text>}
          </View>

          {/* Preview Section */}
          {form.nombre && form.tipo && form.requerido !== undefined && (
            <View
              style={[
                styles.previewContainer,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <Text style={[styles.previewLabel, { color: colors.primary }]}>
                <FormattedMessage
                  id="orderData.preview"
                  defaultMessage="Vista previa del campo:"
                />
              </Text>
              <View style={styles.previewContent}>
                <Text style={styles.previewEmoji}>
                  {getFieldTypeIcon(form.tipo)}
                </Text>
                <View style={styles.previewTextContainer}>
                  <Text
                    style={[styles.previewFieldName, { color: colors.text }]}
                  >
                    {form.nombre}
                    {form.requerido && <Text style={styles.required}> *</Text>}
                  </Text>
                  <Text
                    style={[
                      styles.previewFieldType,
                      { color: colors.textSecondary },
                    ]}
                  >
                    <FormattedMessage
                      id="orderData.previewType"
                      defaultMessage="Tipo: {type} • {required}"
                      values={{
                        type: intl.formatMessage({
                          id: `dateOrderType${form.tipo.charAt(0).toUpperCase() + form.tipo.slice(1)}`,
                          defaultMessage: form.tipo,
                        }),
                        required: form.requerido
                          ? intl.formatMessage({
                              id: "required",
                              defaultMessage: "Requerido",
                            })
                          : intl.formatMessage({
                              id: "optional",
                              defaultMessage: "Opcional",
                            }),
                      }}
                    />
                  </Text>
                </View>
              </View>
            </View>
          )}

          {loadingApi && (
            <View style={styles.loadingContainer}>
              <Spinner size="sm" color={colors.primary} />
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                <FormattedMessage
                  id={data?.id ? "orderData.updating" : "orderData.creating"}
                  defaultMessage={
                    data?.id ? "Actualizando campo..." : "Creando campo..."
                  }
                />
              </Text>
            </View>
          )}
        </View>
      </View>
    </GenericModal>
  );
};

export default ModalCreateOrderDate;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  formContainer: {
    gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  required: {
    color: "#dc3545",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: "white",
  },
  inputElement: {
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.light.text,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  inputError: {
    borderColor: "#dc3545",
    borderWidth: 1,
  },
  placeholderStyle: {
    color: Colors.light.icon,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: "#dc3545",
    marginTop: 4,
  },
  previewContainer: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  previewContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  previewTextContainer: {
    flex: 1,
  },
  previewFieldName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  previewFieldType: {
    fontSize: 12,
    opacity: 0.8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
  },
});
