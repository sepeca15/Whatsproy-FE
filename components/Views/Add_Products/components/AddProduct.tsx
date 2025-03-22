import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "./AddProductStyle";
import { useRouter } from "expo-router";
import ProductoTypes from "../../../../services/api/products/types";
import api from "@/services/api/admin";
import { FormattedMessage, useIntl } from "react-intl";
import { useToastContext, } from "@/contexts/ToastContext";
import { useUser } from "@/hooks/redux/useUser";
import useValidateForm from "../../../../utils/validate_Products/useValidateForm";
import useImagePicker from "../../../../utils/ImagePicker/useImagePicker";

const AddProduct: React.FC = () => {
  const { showToast } = useToastContext();
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
  });

  const { user } = useUser();
  const currencies = user?.currencies;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false); 

  const handleImagePicked = (uri: string) => {
    setSelectedImage(uri);
  };

  const validateForm = useValidateForm(formData);


  const { pickImage, setImageUri, imageUri } = useImagePicker({
    toastErrorMessage: "Error al seleccionar la imagen",
    toastSuccessMessage: "Imagen seleccionada exitosamente",
    onImagePicked: handleImagePicked, // Aquí pasamos la función handleImagePicked
  });

 

 const handleImagePick = async () => {
  pickImage(setFormData);
 
};


  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);



    try {
      const response = await api.products.create({
        ...formData,
        precio: parseFloat(formData.precio.toString()),
        plazoDuracionEstimadoMinutos: parseFloat(formData.plazoDuracionEstimadoMinutos.toString()),
      });

      showToast({ title: "Producto creado con éxito", status: "success" });
      router.push("/(tabs)/productos");
    } catch (error) {
      console.error("Error al crear el producto:", error);
      if (error instanceof Error && (error as any)?.response?.data?.message) {
        showToast({ title: (error as any).response.data.message, status: "error" });
      } else {
        showToast({ title: "Error al crear el producto", status: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          <FormattedMessage id="addProduct" />
        </Text>

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
          <Text style={styles.label}>
            <FormattedMessage id="productName" />
          </Text>
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            placeholder="Ej: Milanesa de pollo"
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>
                <FormattedMessage id="price" />
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  const value = parseFloat(text);
                  if (!isNaN(value)) {
                    setFormData((prev) => ({ ...prev, precio: value }));
                  }
                }}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>
                <FormattedMessage id="currency" />
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  onValueChange={(value) => {
                    setFormData({ ...formData, currency_id: value });
                  }}
                >
                  {currencies.map((currency: any) => (
                    <Picker.Item
                      key={currency?.codigo}
                      label={`${currency?.codigo} (${currency?.simbolo})`}
                      value={currency?.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <Text style={styles.label}>
            <FormattedMessage id="estimatedDuration" />
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(number) =>
              setFormData({
                ...formData,
                plazoDuracionEstimadoMinutos: parseFloat(number),
              })
            }
            keyboardAppearance="dark"
            keyboardType="numeric"
            placeholder="Ej: 30 minutos"
          />

          <Text style={styles.label}>
            <FormattedMessage id="description" />
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            onChangeText={(text) =>
              setFormData({ ...formData, descripcion: text })
            }
            placeholder="Describe el producto"
            multiline
            numberOfLines={4}
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
    </KeyboardAvoidingView>
  );
};

export default AddProduct;
