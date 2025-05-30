import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "./AddProductStyle";
import { useRouter } from "expo-router";
import ProductoTypes from "../../../../services/api/products/types";
import api from "@/services/api/admin";
import { FormattedMessage, useIntl } from "react-intl";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUser } from "@/hooks/redux/useUser";
import useValidateForm from "../../../../utils/validate_Products/useValidateForm";
import useImagePicker from "../../../../utils/ImagePicker/useImagePicker";
import { View } from "native-base";
import MultiSelectInput from "@/components/MultiSelectInput";
import { ICategoryData } from "../../Categories/components/CardCategory/CardCategory";

import InputField from "@/components/InputField"; // <-- importás tu InputField personalizado

const AddProduct: React.FC = () => {
  const router = useRouter();
  const intl = useIntl();
  const [formData, setFormData] = useState<ProductoTypes>({
    nombre: "",
    precio: 0,
    empresa_id: 0,
    imagen: "",
    descripcion: "",
    plazoDuracionEstimadoMinutos: 0,
    disponible: false,
    categoryIds: [],
  });

  const { user } = useUser();
  const currencies = user?.currencies ?? [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<ICategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadAllCategories();
  }, []);

  const validateForm = useValidateForm(formData);

  const { pickImage, setImageUri, imageUri } = useImagePicker({
    toastErrorMessage: "Error al seleccionar la imagen",
    onImagePicked: ({ localUri }) => {
      if (localUri) {
        setSelectedImage(localUri);
      }
    },
  });

  const loadAllCategories = async () => {
    try {
      const resp = await api.category.getAll();
      if (resp.ok) {
        setAllCategories(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImagePick = async () => {
    pickImage(setFormData);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.products.create({
        ...formData,
        precio: parseFloat(formData.precio.toString()),
        plazoDuracionEstimadoMinutos: parseFloat(
          formData.plazoDuracionEstimadoMinutos.toString()
        ),
      });
      router.push("/(tabs)/productos");
    } catch (error: any) {
      console.error(
        "Error al crear el producto:",
        error?.response?.data?.message || error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === "ios" ? 20 : 50}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          <FormattedMessage id="addProduct" />
        </Text>

        <View style={styles.switchRow}>
          <Text style={styles.label}>
            <FormattedMessage id="available" defaultMessage="Disponible" />
          </Text>
          <Switch
            value={formData.disponible}
            onValueChange={(value) =>
              setFormData({ ...formData, disponible: value })
            }
          />
        </View>

        <TouchableOpacity style={styles.imageUpload} onPress={handleImagePick}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <AntDesign name="camera" size={40} color="gray" />
              <Text style={styles.uploadText}>
                <FormattedMessage id="addImage" />
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formContainer}>
          {/* Nombre */}
          <InputField
            label={intl.formatMessage({ id: "productName" })}
            placeholder="Ej: Milanesa de pollo"
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
          />

          {/* Precio y moneda */}
          <View style={styles.row}>
            <View style={styles.column}>
              <InputField
                label={intl.formatMessage({ id: "price" })}
                placeholder="0.00"
                keyboardType="numeric"
                value={formData.precio ? formData.precio.toString() : ""}
                onChangeText={(text) => {
                  const value = parseFloat(text);
                  if (!isNaN(value)) {
                    setFormData((prev) => ({ ...prev, precio: value }));
                  } else if (text === "") {
                    setFormData((prev) => ({ ...prev, precio: 0 }));
                  }
                }}
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>
                <FormattedMessage id="currency" />
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={formData.currency_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, currency_id: value });
                  }}
                >
                  {currencies.map((currency: any, index: number) => (
                    <Picker.Item
                      key={index}
                      label={`${currency?.codigo} (${currency?.simbolo})`}
                      value={currency?.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Duración estimada */}
          <InputField
            label={intl.formatMessage({ id: "estimatedDuration" })}
            placeholder="Ej: 30 minutos"
            keyboardType="numeric"
            value={
              formData.plazoDuracionEstimadoMinutos
                ? formData.plazoDuracionEstimadoMinutos.toString()
                : ""
            }
            onChangeText={(number) =>
              setFormData({
                ...formData,
                plazoDuracionEstimadoMinutos: parseFloat(number),
              })
            }
          />

          {/* Categorías */}
          <View mb={4} style={styles.column}>
            <Text style={styles.label}>Categoria</Text>
            <MultiSelectInput
              sizeText={16}
              height={50}
              isMultiple
              placeholder="Seleccionar categorías"
              options={allCategories.map((cat) => ({
                label: cat.name,
                value: cat.id.toString(),
                placeholder: cat.name,
              }))}
              setItemsSelected={(selectedIds: number[]) => {
                setFormData((prev) => ({
                  ...prev,
                  categoryIds: selectedIds,
                }));
              }}
              onSearch={() => {}}
            />
          </View>

          {/* Descripción */}
          <InputField
            label={intl.formatMessage({ id: "description" })}
            placeholder="Describe el producto"
            value={formData.descripcion}
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            isTextArea
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                <FormattedMessage id="createProduct" />
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default AddProduct;
