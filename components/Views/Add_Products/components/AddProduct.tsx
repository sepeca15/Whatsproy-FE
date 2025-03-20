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
  ActivityIndicator, // Importa ActivityIndicator
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "./AddProductStyle";
import { useRouter } from "expo-router";
import { availableCurrencies } from "@/hooks/dataProduct";
import ProductoTypes from "../../../../services/api/products/types";
import api from "@/services/api/admin";
import { FormattedMessage } from "react-intl";
import { useToastContext } from "@/contexts/ToastContext";
import { useUser } from "@/hooks/redux/useUser";

const AddProduct: React.FC = () => {
  const { showToast } = useToastContext();
  const router = useRouter();
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
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado para el spinner
  const [uri, setUri] = useState("");
  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //   }
  // };
  const pickImage = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];

    if (!asset?.uri) {
      console.error("Error: No se pudo obtener la URI de la imagen.");
      return;
    }
    console.error("se seleccionó bien la imagen...:", asset);
    setImage(asset.uri);

    const file = {
      uri: result.assets[0].uri,
      type: result.assets[0].mimeType || "image/png", 
      name: asset.fileName || `image_${Date.now()}.png`,
    };

    const uploadResponse = await api.image.upload(file);

    if (uploadResponse?.url) {
      setFormData((prevData) => ({ ...prevData, imagen: uploadResponse.url }));
    } else {
      console.log("Error al subir la imagen: No se recibió una URL.");
    }

  };


  console.log("formData_add_Prod", formData.imagen);

  const handleSubmit = () => {
    setLoading(true);
    const newProduct = { ...formData };

    api.products
      .create(newProduct)
      .then((response) => {
        showToast({
          title: "Porudct created successfully",
          status: "success",
        });
        setLoading(false);
        router.push("/(tabs)/productos");
      })
      .catch((error) => {
        showToast({
          title: error.response.data.message || "Error creating product",
          status: "error",
        });
        console.error(
          "Error al crear el producto:",
          error.response.data.message,
        );
        setLoading(false);
      });
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

        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
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
                onChangeText={(text) =>
                  setFormData({ ...formData, precio: parseFloat(text) })
                }
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
