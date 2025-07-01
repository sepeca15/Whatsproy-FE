"use client";

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Spinner } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { FormattedMessage, useIntl } from "react-intl";

import DateTimeInputField from "@/components/DateTimePickerField";
import GenericModal from "@/components/Views/ConfigAccount/components/GenericModal/GenericModal";
import { Colors } from "@/constants/Colors";

interface IModalCreateCierre {
  open: boolean;
  onClose: () => void;
  onCreate: (inicio: Date, fin: Date) => void;
  loading: boolean;
}

const ModalCreateCierre = ({
  open,
  onClose,
  onCreate,
  loading,
}: IModalCreateCierre) => {
  const intl = useIntl();
  const colors = Colors["light"];

  const [formValues, setFormValues] = React.useState({
    inicio: new Date(),
    fin: new Date(),
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formValues.inicio >= formValues.fin) {
      newErrors.general = intl.formatMessage({
        id: "cierre.modal.validation.invalidDates",
        defaultMessage:
          "La fecha de inicio debe ser anterior a la fecha de fin",
      });
    }

    const now = new Date();
    if (formValues.inicio < now) {
      newErrors.inicio = intl.formatMessage({
        id: "cierre.modal.validation.pastDate",
        defaultMessage: "La fecha de inicio no puede ser en el pasado",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreate(formValues.inicio, formValues.fin);
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
      disabled: loading,
    },
    {
      label: loading
        ? intl.formatMessage({
            id: "common.creating",
            defaultMessage: "Creando...",
          })
        : intl.formatMessage({ id: "common.create", defaultMessage: "Crear" }),
      onPress: handleSubmit,
      style: "primary" as const,
      disabled: loading,
    },
  ];

  return (
    <GenericModal
      visible={open}
      onClose={onClose}
      title={intl.formatMessage({
        id: "cierre.modal.title",
        defaultMessage: "Crear cierre provisional",
      })}
      subtitle={intl.formatMessage({
        id: "cierre.modal.subtitle",
        defaultMessage: "Programa un cierre temporal de tu negocio",
      })}
      actions={modalActions}
      scrollable={true}
    >
      <View style={styles.container}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          <FormattedMessage
            id="cierre.modal.description"
            defaultMessage="Define el período durante el cual tu negocio estará temporalmente cerrado"
          />
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <MaterialIcons name="event" size={20} color={colors.success} />
              <Text style={[styles.label, { color: colors.text }]}>
                <FormattedMessage
                  id="cierre.modal.startDate"
                  defaultMessage="Fecha y hora de inicio"
                />
                <Text style={styles.required}> *</Text>
              </Text>
            </View>
            <View
              style={[
                styles.datePickerContainer,
                errors.inicio && styles.datePickerError,
              ]}
            >
              <DateTimeInputField
                direction="row"
                date={formValues.inicio}
                display="default"
                setDate={(val: any) => handleChange("inicio", val)}
              />
            </View>
            {errors.inicio && (
              <Text style={styles.errorText}>{errors.inicio}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <MaterialIcons
                name="event-busy"
                size={20}
                color={colors.danger}
              />
              <Text style={[styles.label, { color: colors.text }]}>
                <FormattedMessage
                  id="cierre.modal.endDate"
                  defaultMessage="Fecha y hora de fin"
                />
                <Text style={styles.required}> *</Text>
              </Text>
            </View>
            <View
              style={[
                styles.datePickerContainer,
                errors.fin && styles.datePickerError,
              ]}
            >
              <DateTimeInputField
                direction="row"
                date={formValues.fin}
                display="default"
                setDate={(val: any) => handleChange("fin", val)}
              />
            </View>
            {errors.fin && <Text style={styles.errorText}>{errors.fin}</Text>}
          </View>
        </View>

        {errors.general && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: colors.danger + "15" },
            ]}
          >
            <MaterialIcons
              name="error-outline"
              size={20}
              color={colors.danger}
            />
            <Text style={[styles.generalErrorText, { color: colors.danger }]}>
              {errors.general}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.infoBanner,
            { backgroundColor: colors.primary + "15" },
          ]}
        >
          <MaterialIcons name="info-outline" size={20} color={colors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoTitle, { color: colors.primary }]}>
              <FormattedMessage
                id="cierre.modal.info.title"
                defaultMessage="Información importante"
              />
            </Text>
            <Text style={[styles.infoDescription, { color: colors.primary }]}>
              <FormattedMessage
                id="cierre.modal.info.description"
                defaultMessage="Durante este período, tu negocio aparecerá como cerrado y no se podrán realizar pedidos"
              />
            </Text>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <Spinner size="sm" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              <FormattedMessage
                id="cierre.modal.creating"
                defaultMessage="Creando cierre provisional..."
              />
            </Text>
          </View>
        )}
      </View>
    </GenericModal>
  );
};

export default ModalCreateCierre;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  formContainer: {
    gap: 24,
    marginBottom: 20,
  },
  fieldContainer: {
    gap: 12,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  required: {
    color: "#dc3545",
  },
  datePickerContainer: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 8,
    backgroundColor: "white",
    overflow: "hidden",
  },
  datePickerError: {
    borderColor: "#dc3545",
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: "#dc3545",
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
    marginBottom: 16,
    gap: 8,
  },
  generalErrorText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  infoBanner: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    gap: 12,
    marginBottom: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.9,
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
