"use client";

import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Input, Switch, Text, Spinner } from "native-base";
import api from "@/services/api/admin";
import { useUser } from "@/hooks/redux/useUser";
import type { IEstado } from "../../Status";
import { useIntl, FormattedMessage } from "react-intl";
import GenericModal from "@/components/Views/ConfigAccount/components/GenericModal/GenericModal";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

interface IModalCreateOrEditStatus {
  isOpen: boolean;
  onClose: () => void;
  addOrEditNewStatus: (status: any, shouldEdit: boolean) => void;
  selectedItem: IEstado | null;
}

interface ICreateStatus {
  nombre: string;
  es_defecto: boolean;
  finalizador: boolean;
  order: number;
  mensaje?: string;
}

const initialState: ICreateStatus = {
  nombre: "",
  es_defecto: false,
  finalizador: false,
  order: 0,
  mensaje: "",
};

export const ModalCreateOrEditStatus = ({
  isOpen,
  onClose,
  addOrEditNewStatus,
  selectedItem,
}: IModalCreateOrEditStatus) => {
  const [status, setStatus] = React.useState<ICreateStatus>(initialState);
  const [error, setError] = React.useState<any>({});
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  const { user } = useUser();
  const intl = useIntl();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  React.useEffect(() => {
    if (isOpen && selectedItem) {
      setStatus({
        nombre: selectedItem.nombre,
        es_defecto: selectedItem.es_defecto,
        finalizador: selectedItem.finalizador,
        order: selectedItem.order ?? 0,
        mensaje: selectedItem?.mensaje || "",
      });
      setError({});
    } else if (isOpen && !selectedItem) {
      setStatus(initialState);
      setError({});
    }
  }, [isOpen, selectedItem]);

  const handleChange = (key: keyof ICreateStatus, value: any) => {
    setStatus((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (error[key]) {
      setError((prev: any) => ({ ...prev, [key]: null }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!status.nombre.trim()) {
      newErrors.nombre = intl.formatMessage({
        id: "status.nameRequired",
        defaultMessage: "El nombre es obligatorio",
      });
    }

    if (isNaN(status.order) || status.order < 0) {
      newErrors.order = intl.formatMessage({
        id: "status.orderInvalid",
        defaultMessage: "El orden debe ser un número válido",
      });
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrUpdateStatus = async () => {
    if (!validateForm()) return;

    try {
      setLoadingApi(true);
      setError({});

      const payload = { ...status };
      const resp = selectedItem
        ? await api.status.update(selectedItem.id, payload)
        : await api.status.create(payload);

      if (resp) {
        addOrEditNewStatus(resp.data, !!selectedItem);
        setStatus(initialState);
        setError({});
        onClose();
      }
    } catch (error: any) {
      console.log(error);
      const newError: any = {};
      newError.generalError =
        error.response?.data?.message ||
        intl.formatMessage({
          id: "status.saveError",
          defaultMessage: "Error al guardar el estado",
        });
      setError(newError);
    } finally {
      setLoadingApi(false);
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
            id: selectedItem ? "common.save" : "common.create",
            defaultMessage: selectedItem ? "Guardar" : "Crear",
          }),
      onPress: createOrUpdateStatus,
      style: "primary" as const,
      disabled: loadingApi,
    },
  ];

  return (
    <GenericModal
      visible={isOpen}
      onClose={onClose}
      title={
        selectedItem
          ? intl.formatMessage({
              id: "status.editTitle",
              defaultMessage: "Editar estado",
            })
          : intl.formatMessage({
              id: "status.createTitle",
              defaultMessage: "Crear estado",
            })
      }
      subtitle={intl.formatMessage({
        id: "status.modalSubtitle",
        defaultMessage: "Configura los estados de las órdenes",
      })}
      actions={modalActions}
      scrollable={true}
    >
      <View style={styles.container}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          <FormattedMessage
            id="status.description"
            defaultMessage="Los estados permiten hacer seguimiento del progreso de las órdenes"
          />
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.nameContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                <FormattedMessage
                  id="status.nameLabel"
                  defaultMessage="Nombre"
                />
                <Text style={styles.required}> *</Text>
              </Text>
              <Input
                borderRadius={12}
                backgroundColor={"white"}
                placeholder={intl.formatMessage({
                  id: "status.namePlaceholder",
                  defaultMessage: "Ej: En preparación",
                })}
                value={status.nombre}
                onChangeText={(text) => handleChange("nombre", text)}
                style={[styles.input, error.nombre && styles.inputError]}
                _focus={{
                  borderColor: colors.primary,
                  backgroundColor: "white",
                }}
              />
              {error.nombre && (
                <Text style={styles.errorText}>{error.nombre}</Text>
              )}
            </View>

            <View style={styles.orderContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                <FormattedMessage
                  id="status.orderLabel"
                  defaultMessage="Orden"
                />
                <Text style={styles.required}> *</Text>
              </Text>
              <Input
                borderRadius={12}
                backgroundColor={"white"}
                placeholder="1"
                keyboardType="numeric"
                value={status.order.toString()}
                onChangeText={(text) =>
                  handleChange("order", Number.parseInt(text) || 0)
                }
                style={[styles.input, error.order && styles.inputError]}
                _focus={{
                  borderColor: colors.primary,
                  backgroundColor: "white",
                }}
              />
              {error.order && (
                <Text style={styles.errorText}>{error.order}</Text>
              )}
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              <FormattedMessage
                id="status.messageLabel"
                defaultMessage="Mensaje"
              />
            </Text>
            <Input
              backgroundColor={"white"}
              borderRadius={12}
              placeholder={intl.formatMessage({
                id: "status.messagePlaceholder",
                defaultMessage: "Mensaje para el cliente (opcional)",
              })}
              value={status.mensaje}
              onChangeText={(text) => handleChange("mensaje", text)}
              multiline
              numberOfLines={3}
              style={[styles.textArea]}
              _focus={{
                borderColor: colors.primary,
                backgroundColor: "white",
              }}
            />
          </View>
          <View
            style={[
              styles.noteContainer,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Text style={[styles.noteText, { color: colors.primary }]}>
              <FormattedMessage
                id="status.messageNote"
                defaultMessage="Este mensaje se enviará al usuario cuando el estado cambie"
              />
            </Text>
          </View>

          <View style={styles.switchesContainer}>
            <View
              style={[styles.switchRow, { borderBottomColor: colors.border }]}
            >
              <View style={styles.switchInfo}>
                <Text style={[styles.switchLabel, { color: colors.text }]}>
                  <FormattedMessage
                    id="status.isFinalLabel"
                    defaultMessage="Es finalizador"
                  />
                </Text>
                <Text
                  style={[
                    styles.switchDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  <FormattedMessage
                    id="status.isFinalDescription"
                    defaultMessage="Marca la orden como completada"
                  />
                </Text>
              </View>
              <Switch
                isChecked={status.finalizador}
                onToggle={() =>
                  handleChange("finalizador", !status.finalizador)
                }
                size="md"
                colorScheme="primary"
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={[styles.switchLabel, { color: colors.text }]}>
                  <FormattedMessage
                    id="status.isDefaultLabel"
                    defaultMessage="Estado por defecto"
                  />
                </Text>
                <Text
                  style={[
                    styles.switchDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  <FormattedMessage
                    id="status.isDefaultDescription"
                    defaultMessage="Se asigna automáticamente a nuevas órdenes"
                  />
                </Text>
              </View>
              <Switch
                isChecked={status.es_defecto}
                onToggle={() => handleChange("es_defecto", !status.es_defecto)}
                size="md"
                colorScheme="primary"
              />
            </View>
          </View>

          {error.generalError && (
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: colors.danger + "15" },
              ]}
            >
              <Text style={[styles.generalErrorText, { color: colors.danger }]}>
                {error.generalError}
              </Text>
            </View>
          )}

          {loadingApi && (
            <View style={styles.loadingContainer}>
              <Spinner size="sm" color={colors.primary} />
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                <FormattedMessage
                  id={selectedItem ? "status.updating" : "status.creating"}
                  defaultMessage={
                    selectedItem
                      ? "Actualizando estado..."
                      : "Creando estado..."
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
  rowContainer: {
    flexDirection: "row",
    gap: 12,
  },
  nameContainer: {
    flex: 2,
  },
  orderContainer: {
    flex: 1,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#dc3545",
  },
  input: {
    fontSize: 16,
  },
  textArea: {
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#dc3545",
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    color: "#dc3545",
    marginTop: 4,
  },
  noteContainer: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 16,
  },
  switchesContainer: {
    borderRadius: 8,
    backgroundColor: "white",
    overflow: "hidden",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#dc3545",
  },
  generalErrorText: {
    fontSize: 14,
    fontWeight: "500",
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
