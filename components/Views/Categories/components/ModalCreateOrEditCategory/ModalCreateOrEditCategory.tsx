"use client";

import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image, Spinner } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FormattedMessage, useIntl } from "react-intl";
import { useColorScheme } from "react-native";

import InputField from "@/components/InputField";
import GenericModal from "@/components/Views/ConfigAccount/components/GenericModal/GenericModal";
import useImagePicker from "@/utils/ImagePicker/useImagePicker";
import { Colors } from "@/constants/Colors";
import { ICategoryData } from "../CardCategory/CardCategory";

interface IModalCreateCategory {
  onClose: () => void;
  isOpen: boolean;
  categorySelected: ICategoryData | null;
  editCategorie: (editedCategory: ICategoryData) => void;
  createCategory: (createdCategory: ICategoryData) => void;
}

const initialState = {
  name: "",
  description: "",
  image: "",
};

const ModalCreateOrEditCategory = ({
  isOpen,
  onClose,
  categorySelected,
  editCategorie,
  createCategory,
}: IModalCreateCategory) => {
  const intl = useIntl();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [formData, setFormData] = React.useState<Partial<ICategoryData>>(
    categorySelected ? { ...categorySelected } : initialState
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);

  const { pickImage, imageUri, setImageUri } = useImagePicker({
    toastErrorMessage: intl.formatMessage({
      id: "categories.modal.imagePickerError",
      defaultMessage: "Error al seleccionar la imagen",
    }),
    onImagePicked: (data) => {
      if (data.apiUrl) {
        handleChangeValue("image", data.apiUrl);
      }
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (categorySelected) {
        setFormData({ ...categorySelected });
        setImageUri(categorySelected.image || null);
      } else {
        setFormData(initialState);
        setImageUri(null);
      }
      setErrors({});
    }
  }, [isOpen, categorySelected, setImageUri]);

  const handleChangeValue = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = intl.formatMessage({
        id: "categories.modal.validation.nameRequired",
        defaultMessage: "El nombre es requerido",
      });
    }

    if (!formData.description?.trim()) {
      newErrors.description = intl.formatMessage({
        id: "categories.modal.validation.descriptionRequired",
        defaultMessage: "La descripción es requerida",
      });
    }

    if (!formData.image?.trim()) {
      newErrors.image = intl.formatMessage({
        id: "categories.modal.validation.imageRequired",
        defaultMessage: "La imagen es requerida",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    setLoadingApi(true);
    try {
      if (categorySelected) {
        await editCategorie(formData as ICategoryData);
      } else {
        await createCategory(formData as ICategoryData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false);
    }
  };

  const handleImagePick = () => {
    pickImage(setFormData);
  };

  const currentImageUri = imageUri || formData.image;

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
            id: categorySelected ? "common.save" : "common.create",
            defaultMessage: categorySelected ? "Guardar" : "Crear",
          }),
      onPress: onSubmit,
      style: "primary" as const,
      disabled: loadingApi,
    },
  ];

  return (
    <GenericModal
      visible={isOpen}
      onClose={onClose}
      title={intl.formatMessage({
        id: categorySelected
          ? "categories.modal.editTitle"
          : "categories.modal.createTitle",
        defaultMessage: categorySelected
          ? "Editar categoría"
          : "Crear categoría",
      })}
      subtitle={intl.formatMessage({
        id: "categories.modal.subtitle",
        defaultMessage: "Organiza tus productos en categorías",
      })}
      actions={modalActions}
      scrollable={true}
    >
      <View style={styles.container}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          <FormattedMessage
            id="categories.modal.description"
            defaultMessage="Las categorías te ayudan a organizar tus productos y facilitan la navegación para tus clientes"
          />
        </Text>

        <View style={styles.imageSection}>
          <Text style={[styles.label, { color: colors.text, textAlign: "center" }]}>
            <FormattedMessage
              id="categories.modal.imageLabel"
              defaultMessage="Imagen de la categoría"
            />
            <Text style={styles.required}> *</Text>
          </Text>

          <View style={styles.imageContainer}>
            <View
              style={[styles.imageWrapper, errors.image && styles.imageError]}
            >
              {currentImageUri ? (
                <Image
                  source={{ uri: currentImageUri }}
                  alt="Category image"
                  style={styles.categoryImage}
                  fallbackSource={{
                    uri: "https://via.placeholder.com/120x120/e2e8f0/64748b?text=?",
                  }}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <LinearGradient
                    colors={[colors.primary + "20", colors.primary + "10"]}
                    style={styles.placeholderGradient}
                  >
                    <MaterialIcons
                      name="image"
                      size={40}
                      color={colors.primary}
                    />
                  </LinearGradient>
                </View>
              )}

              <TouchableOpacity
                style={styles.imageButton}
                onPress={handleImagePick}
                activeOpacity={0.8}
                disabled={loadingApi}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primary + "DD"]}
                  style={styles.imageButtonGradient}
                >
                  <MaterialIcons name="camera-alt" size={16} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImagePick}
              activeOpacity={0.7}
              disabled={loadingApi}
            >
              <MaterialIcons
                name="cloud-upload"
                size={20}
                color={colors.primary}
              />
              <Text
                style={[styles.uploadButtonText, { color: colors.primary }]}
              >
                <FormattedMessage
                  id="categories.modal.uploadImage"
                  defaultMessage={
                    currentImageUri ? "Cambiar imagen" : "Subir imagen"
                  }
                />
              </Text>
            </TouchableOpacity>

            {errors.image && (
              <Text style={styles.errorText}>{errors.image}</Text>
            )}
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              <FormattedMessage
                id="categories.modal.nameLabel"
                defaultMessage="Nombre de la categoría"
              />
              <Text style={styles.required}> *</Text>
            </Text>
            <InputField
              value={formData.name || ""}
              onChangeText={(text) => handleChangeValue("name", text)}
              placeholder={intl.formatMessage({
                id: "categories.modal.namePlaceholder",
                defaultMessage: "Ej: Comidas, Bebidas, Postres",
              })}
              style={[errors.name && styles.inputError]}
              editable={!loadingApi}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              <FormattedMessage
                id="categories.modal.descriptionLabel"
                defaultMessage="Descripción"
              />
              <Text style={styles.required}> *</Text>
            </Text>
            <InputField
              value={formData.description || ""}
              onChangeText={(text) => handleChangeValue("description", text)}
              placeholder={intl.formatMessage({
                id: "categories.modal.descriptionPlaceholder",
                defaultMessage: "Describe brevemente esta categoría",
              })}
              multiline
              numberOfLines={3}
              style={[styles.textArea, errors.description && styles.inputError]}
              editable={!loadingApi}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>
        </View>

        {formData.name && formData.description && currentImageUri && (
          <View
            style={[
              styles.previewContainer,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Text style={[styles.previewLabel, { color: colors.primary }]}>
              <FormattedMessage
                id="categories.modal.preview"
                defaultMessage="Vista previa:"
              />
            </Text>
            <View style={styles.previewContent}>
              <Image
                source={{ uri: currentImageUri }}
                alt="Preview"
                style={styles.previewImage}
              />
              <View style={styles.previewTextContainer}>
                <Text style={[styles.previewName, { color: colors.text }]}>
                  {formData.name}
                </Text>
                <Text
                  style={[
                    styles.previewDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {formData.description}
                </Text>
              </View>
            </View>
          </View>
        )}

        {loadingApi && (
          <View style={styles.loadingContainer}>
            <Spinner size="sm" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              <FormattedMessage
                id={
                  categorySelected
                    ? "categories.modal.updating"
                    : "categories.modal.creating"
                }
                defaultMessage={
                  categorySelected
                    ? "Actualizando categoría..."
                    : "Creando categoría..."
                }
              />
            </Text>
          </View>
        )}
      </View>
    </GenericModal>
  );
};

export default ModalCreateOrEditCategory;

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
  imageSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#dc3545",
  },
  imageContainer: {
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.light.border,
  },
  imageError: {
    borderColor: "#dc3545",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    overflow: "hidden",
  },
  placeholderGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + "15",
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  formContainer: {
    gap: 20,
    marginBottom: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  inputError: {
    borderColor: "#dc3545",
    borderWidth: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
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
    marginBottom: 16,
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
  previewImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  previewTextContainer: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  previewDescription: {
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
