import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../../../../constants/Colors";
import { Switch, Animated } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "./EditProductStyle";
import { useRouter } from "expo-router";
import { availableCurrencies } from "@/hooks/dataProduct";
import api from "@/services/api/admin";
import { FormattedMessage, useIntl } from "react-intl";
import { useToastContext } from "@/contexts/ToastContext";
import { useUser } from "@/hooks/redux/useUser";
import useValidateForm from "../../../../utils/validate_Products/useValidateForm";
import useImagePicker from "../../../../utils/ImagePicker/useImagePicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ICategoryData } from "../../Categories/components/CardCategory/CardCategory";
import MultiSelectInput from "@/components/MultiSelectInput";
import { View } from "native-base";

interface ProductFormData {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
  disponible: boolean;
  empresa_id: number;
  plazoDuracionEstimadoMinutos: number;
  precio: number;
  currency_id?: any;
  categoryIds: any[]
}

interface EditProductProps {
  id: number;
  name: string;
  price: string;
  currency_id?: string;
  duration: string;
  description: string;
  imageUrl?: string;
  disponible?: string;
  empresa_id?: number;
  categoryIds: any[]
}

const EditProduct = ({
  id,
  name,
  price,
  currency_id,
  duration,
  description,
  imageUrl,
  disponible,
  empresa_id,
  categoryIds,


}: EditProductProps) => {
  const router = useRouter();
  const intl = useIntl();
  const [formData, setFormData] = useState<ProductFormData>({
    id,
    nombre: name,
    descripcion: description,
    disponible: disponible === "true",
    imagen: imageUrl || "https://via.placeholder.com/150", 
    empresa_id: empresa_id ?? 0,
    currency_id: currency_id ?? null, 
    plazoDuracionEstimadoMinutos: Number(duration) || 0,
    precio: Number(price) || 0,
    categoryIds: categoryIds
  });
  const { user } = useUser();
  const currencies = user?.currencies;
  const [selectedImage, setSelectedImage] = useState<string | null>(
    imageUrl ?? null,
  );
  const [loadingimage, setLoadingimage] = useState(false);
  const [uri, setUri] = useState("");
  const { showToast } = useToastContext();
  const [loading, setLoading] = useState(false);

  const [allCategories, setAllCategories] = useState<ICategoryData[]>([]);

  React.useEffect(() => {
    loadAllCategories()
  }, [])
  const loadAllCategories = async () => {
    try {
      const resp = await api.category.getAll()

      if (resp.ok) {
        setAllCategories(resp.data)
      }

    } catch (error) {
      console.log(error);
    }
  }

  const validateForm = useValidateForm({
    ...formData,
    imagen: formData.imagen || "",
  }
  );


  const { pickImage } = useImagePicker({
    toastErrorMessage: "Error al seleccionar la imagen",
    onImagePicked: async ({ localUri, apiUrl }) => {
      if (localUri) {
        setSelectedImage(localUri.toString());
      }
      if (apiUrl) {
        setFormData((prevData) => ({
          ...prevData,
          imagen: apiUrl,
        }));
      }
    },
  });  

  const handleImagePick = async () => {
    try {
      setLoadingimage(true);
      // Await the pickImage function to ensure it completes
      await pickImage(setFormData);
    } catch (error) {
      console.error("Error selecting image:", error);
      showToast({
        title: intl.formatMessage({ id: "errorSelectingImage" }),
        status: "error",
      });
    } finally {
      // Ensure loadingimage is set to false when the process completes
      setLoadingimage(false);
    }
  };




  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (loadingimage) {
      showToast({
        title: intl.formatMessage({ id: "waitForImageUpload" }),
        status: "warning",
      });
      return;
    }
    setLoading(true);



    try {
      const updatedFormData = {
        ...formData,
        imagen: (formData.imagen || "") // Ensure imagen is always a string
      };

      const res = await api.products.update(formData.id, updatedFormData);

      if (res.data?.ok) {
        showToast({
          title: intl.formatMessage({ id: "productEditedSuccess" }),
          status: "success",
        });
        router.back();
      } else {
        throw new Error(res.data?.message || intl.formatMessage({ id: "errorOccurred" }));
      }
    } catch (error: any) {
      console.error("Error al actualizar producto:", error);
      showToast({
        title: error.message || intl.formatMessage({ id: "errorOccurred" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      enableOnAndroid={true} // Específico para Android
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 50} // Ajuste fino en el desplazamiento
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          <FormattedMessage id="editProduct" />
        </Text>

        <TouchableOpacity style={styles.imageUpload} onPress={handleImagePick}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage || imageUrl }}
              style={styles.uploadedImage}
            />
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
            placeholder={intl.formatMessage({ id: "enterName" })}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>
                <FormattedMessage id="price" />
              </Text>
              <TextInput
                style={styles.input}
                value={formData.precio === 0 ? "" : formData.precio.toString()}
                onChangeText={(text) => {
                  const parsedValue = Number.parseFloat(text);
                  setFormData({
                    ...formData,
                    precio: isNaN(parsedValue) ? 0 : parsedValue,
                  });
                }}
                keyboardType="numeric"
                placeholder={intl.formatMessage({ id: "enterPriceProd" })} // Convierte FormattedMessage a cadena
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>
                <FormattedMessage id="currency" />
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={Number(currency_id)}
                  onValueChange={(value) => {
                    setFormData({ ...formData, currency_id: value });
                  }}
                  style={styles.picker}
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
            value={
              formData.plazoDuracionEstimadoMinutos === 0
                ? ""
                : formData.plazoDuracionEstimadoMinutos.toString()
            }
            onChangeText={(text) => {
              const parsedValue = Number.parseFloat(text);
              setFormData({
                ...formData,
                plazoDuracionEstimadoMinutos: isNaN(parsedValue)
                  ? 0
                  : parsedValue,
              });
            }}
            keyboardType="numeric"
            placeholder={intl.formatMessage({ id: "enterDurationProd" })}
          />

          {
            <View mb={4} style={styles.column}>
              <Text style={styles.label}>
                Categoria
              </Text>
              <View color={'red.100'} >
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
                  itemsSelected={formData.categoryIds}
                  setItemsSelected={(selectedIds: any[]) => {
                    setFormData((prev) => ({
                      ...prev,
                      categoryIds: selectedIds,
                    }));
                  }}

                  onSearch={(query: string) => {
                  }}
                />
              </View>
            </View>
          }

          <Text style={styles.label}>
            <FormattedMessage id="description" />
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(text) =>
              setFormData({ ...formData, descripcion: text })
            }
            placeholder={intl.formatMessage({ id: "enterDescriptionProd" })}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>
            <FormattedMessage id="available" />
          </Text>
          <View style={styles.switchContainer}>
            <Switch
              value={formData.disponible}
              onValueChange={(value) =>
                setFormData({ ...formData, disponible: value })
              }
              trackColor={{ false: "#767577", true: Colors.light.primary }}
              thumbColor={formData.disponible ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
            />
            <View style={styles.switchIconContainer}>
              {formData.disponible ? (
                <AntDesign name="checkcircle" size={24} color="#4CAF50" />
              ) : (
                <AntDesign name="closecircle" size={24} color="#F44336" />
              )}
            </View>
            <Text
              style={[
                styles.switchText,
                { color: formData.disponible ? "#4CAF50" : "#F44336" },
              ]}
            >
              {formData.disponible ? (
                <FormattedMessage id="available" />
              ) : (
                <FormattedMessage id="notAvailable" />
              )}
            </Text>
          </View>


          <TouchableOpacity
            style={[styles.button, (loading || loadingimage) && styles.disabled]}
            onPress={handleSubmit}
            disabled={loading || loadingimage}
          >
            {loading || loadingimage ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                <FormattedMessage id="update" />
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default EditProduct;
