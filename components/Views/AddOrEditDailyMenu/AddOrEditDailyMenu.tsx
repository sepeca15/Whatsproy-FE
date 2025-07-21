import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { FormattedMessage, useIntl } from "react-intl";
import { Colors } from "@/constants/Colors";
import { useToastContext } from "@/contexts/ToastContext";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import GenericModal from "../ConfigAccount/components/GenericModal/GenericModal";
import { useUser } from "@/hooks/redux/useUser";
import SelectField from "@/hooks/SelectField/SelectField";
import useImagePicker from "@/utils/ImagePicker/useImagePicker";

export interface DailyMenuItem {
  id?: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  plazoDuracionEstimadoMinutos: number;
  currency_id: number | null;
}

interface AddOrEditDailyMenuProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: DailyMenuItem) => void;
  editingItem?: any;
  dayId: number;
  dayName: string;
}

const AddOrEditDailyMenu: React.FC<AddOrEditDailyMenuProps> = ({
  visible,
  onClose,
  onSave,
  editingItem,
  dayId,
  dayName,
}) => {
  const intl = useIntl();
  const { showToast } = useToastContext();
  const { user } = useUser();
  const currencies = user?.currencies || [];
  const [selectedImageToUpload, setSelectedImageToUpload] = useState<
    ImagePicker.ImagePickerAsset | undefined
  >();

  const [formData, setFormData] = useState<DailyMenuItem>({
    nombre: "",
    precio: 0,
    imagen: "",
    descripcion: "",
    plazoDuracionEstimadoMinutos: 0,
    currency_id: null,
  });
  const { uploadImage } = useImagePicker({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      console.log("editingItem", editingItem);
      setFormData({
        descripcion: editingItem?.description,
        precio: editingItem?.price,
        nombre: editingItem?.name,
        plazoDuracionEstimadoMinutos: editingItem?.estimatedDuration ?? 0,
        currency_id: editingItem?.currencyId,
        imagen: editingItem?.imagen,
      });
    } else {
      setFormData({
        nombre: "",
        precio: 0,
        imagen: "",
        descripcion: "",
        plazoDuracionEstimadoMinutos: 0,
        currency_id: currencies.length > 0 ? currencies[0].id : null,
      });
    }
  }, [editingItem, currencies, visible]);

  const handleInputChange = (field: keyof DailyMenuItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          intl.formatMessage({
            id: "permissionRequired",
            defaultMessage: "Permiso requerido",
          }),
          intl.formatMessage({
            id: "cameraPermissionMessage",
            defaultMessage: "Se necesita permiso para acceder a la galería",
          })
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const firstImage = result.assets[0];
        handleInputChange("imagen", result.assets[0].uri);
        setSelectedImageToUpload(firstImage);
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: "errorSelectingImage",
          defaultMessage: "Error al seleccionar imagen",
        }),
        status: "error",
      });
    }
  };

  const validateForm = (): boolean => {
    if (!formData?.nombre?.trim()) {
      showToast({
        title: intl.formatMessage({
          id: "nameRequired",
          defaultMessage: "El nombre es requerido",
        }),
        status: "error",
      });
      return false;
    }

    if (formData?.precio <= 0) {
      showToast({
        title: intl.formatMessage({
          id: "priceRequired",
          defaultMessage: "El precio debe ser mayor a 0",
        }),
        status: "error",
      });
      return false;
    }

    if (!formData?.currency_id) {
      showToast({
        title: intl.formatMessage({
          id: "currencyRequired",
          defaultMessage: "Selecciona una moneda",
        }),
        status: "error",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      let newImageUri = formData?.imagen;
      if (selectedImageToUpload) {
        newImageUri = await uploadImage(selectedImageToUpload);
        if (!newImageUri) {
          throw new Error("Unknown error uploading image");
        }
      }

      console.log("newImageUri", newImageUri)
      await onSave({ ...formData, imagen: newImageUri });
      onClose();
      showToast({
        title: intl.formatMessage({
          id: editingItem ? "itemUpdated" : "itemAdded",
          defaultMessage: editingItem
            ? "Producto actualizado"
            : "Producto agregado",
        }),
        status: "success",
      });
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: "errorSavingItem",
          defaultMessage: "Error al guardar producto",
        }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCurrency = currencies.find(
    (c: any) => c.id === formData?.currency_id
  );

  const renderCurrencyDropdown = () => (
    <View style={styles.inputContainer}>
      <Text allowFontScaling={false} style={styles.label}>
        <FormattedMessage id="currency" />
      </Text>
      <SelectField
        selectedValue={formData.currency_id}
        onValueChange={(value) => {
          setFormData({ ...formData, currency_id: value });
        }}
        placeholder={intl.formatMessage({ id: "selectCurrency" })}
        options={currencies.map(
          (c: { codigo: string; simbolo: string; id: number }) => ({
            label: `${c.codigo} (${c.simbolo})`,
            value: c.id,
          })
        )}
      />
    </View>
  );

  const renderImageSelector = () => (
    <View style={styles.inputContainer}>
      <Text allowFontScaling={false} style={styles.label}>
        <FormattedMessage id="image" defaultMessage="Imagen" />
      </Text>
      <TouchableOpacity
        style={styles.imageSelector as any}
        onPress={handleImagePicker}
      >
        {formData?.imagen ? (
          <Image
            source={{ uri: formData?.imagen }}
            style={styles.selectedImage as any}
          />
        ) : (
          <View style={styles.imagePlaceholder as any}>
            <Icon name="camera" size={24} color={Colors.light.icon} />
            <Text allowFontScaling={false} style={styles.imagePlaceholderText}>
              <FormattedMessage
                id="selectImage"
                defaultMessage="Seleccionar imagen"
              />
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      title={
        editingItem
          ? intl.formatMessage({
              id: "editMenuItem",
              defaultMessage: "Editar producto",
            })
          : intl.formatMessage({
              id: "addMenuItem",
              defaultMessage: "Agregar producto",
            })
      }
      subtitle={`${dayName}`}
      headerIcon={<Icon name="cutlery" size={20} color="white" />}
      actions={[
        {
          label: intl.formatMessage({
            id: "cancel",
            defaultMessage: "Cancelar",
          }),
          onPress: onClose,
          style: "secondary",
        },
        {
          label: intl.formatMessage({ id: "save", defaultMessage: "Guardar" }),
          onPress: handleSave,
          style: "primary",
          disabled: loading,
          icon: loading ? undefined : "check",
        },
      ]}
    >
      <View style={styles.form}>
        {renderImageSelector()}

        <View style={styles.inputContainer}>
          <Text allowFontScaling={false} style={styles.label}>
            <FormattedMessage id="name" defaultMessage="Nombre" /> *
          </Text>
          <TextInput allowFontScaling={false}
            style={styles.textInput}
            value={formData?.nombre}
            onChangeText={(text) => handleInputChange("nombre", text)}
            placeholder={intl.formatMessage({
              id: "enterName",
              defaultMessage: "Ingresa el nombre",
            })}
            placeholderTextColor={Colors.light.icon}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text allowFontScaling={false} style={styles.label}>
            <FormattedMessage id="description" defaultMessage="Descripción" />
          </Text>
          <TextInput allowFontScaling={false}
            style={[styles.textInput, styles.textArea]}
            value={formData?.descripcion}
            onChangeText={(text) => handleInputChange("descripcion", text)}
            placeholder={intl.formatMessage({
              id: "enterDescription",
              defaultMessage: "Ingresa la descripción",
            })}
            placeholderTextColor={Colors.light.icon}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text allowFontScaling={false} style={styles.label}>
              <FormattedMessage id="price" defaultMessage="Precio" /> *
            </Text>
            <TextInput allowFontScaling={false}
              style={styles.textInput}
              value={`${formData?.precio ?? 0}`}
              onChangeText={(text) =>
                handleInputChange("precio", parseFloat(text) || 0)
              }
              placeholder="0.00"
              placeholderTextColor={Colors.light.icon}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text allowFontScaling={false} style={styles.label}>
              <FormattedMessage
                id="estimatedDuration"
                defaultMessage="Duración (min)"
              />{" "}
              (min)
            </Text>
            <TextInput allowFontScaling={false}
              style={styles.textInput}
              value={`${formData?.plazoDuracionEstimadoMinutos ?? 0}`}
              onChangeText={(text) =>
                handleInputChange(
                  "plazoDuracionEstimadoMinutos",
                  parseInt(text) || 0
                )
              }
              placeholder="0"
              placeholderTextColor={Colors.light.icon}
              keyboardType="numeric"
            />
          </View>
        </View>

        {renderCurrencyDropdown()}
      </View>
    </GenericModal>
  );
};

const styles = {
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top" as const,
  },
  row: {
    flexDirection: "row" as const,
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  selectedDropdownItem: {
    backgroundColor: Colors.light.primary + "20",
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedDropdownItemText: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  imageSelector: {
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderStyle: "dashed" as const,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  imagePlaceholder: {
    alignItems: "center",
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
};

export default AddOrEditDailyMenu;
