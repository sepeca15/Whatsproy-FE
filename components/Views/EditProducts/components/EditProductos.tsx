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
import InputField from "@/components/InputField";
import SelectField from "@/hooks/SelectField/SelectField";
import { useEditProductValidation } from "@/hooks/productValidation/useProductValidation";



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
    currency_id: currency_id ? Number(currency_id) : null,
    plazoDuracionEstimadoMinutos: Number(duration) || 0,
    precio: Number(price) || 0,
    categoryIds: categoryIds || [],
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
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [allCategories, setAllCategories] = useState<ICategoryData[]>([]);
  const { validateForm } = useEditProductValidation();

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




  const { pickImage } = useImagePicker({
    toastErrorMessage: "Error al seleccionar la imagen",
    onImagePicked: async ({ localUri, apiUrl }) => {
      if (localUri) setSelectedImage(localUri);
      if (apiUrl) {
        setFormData(prev => ({ ...prev, imagen: apiUrl }));
      }
    }
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
     if (!validateForm(formData, selectedImage, setErrors)) return;


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
        imagen: (formData.imagen || "")
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
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 50}
    >
      {/* <ScrollView contentContainerStyle={styles.scrollContent}> */}
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
        <View style={styles.inputfile}>
          <InputField
            placeholder={intl.formatMessage({
              id: "productNamePlaceholder",
              defaultMessage: "Ej: Milanesa de pollo",
            })}
            value={formData.nombre}
            onChangeText={(text) => {
              setFormData({ ...formData, nombre: text });
              if (text.trim()) {
                setErrors((prev) => ({ ...prev, nombre: null }));
              }
            }}
            error={errors.nombre}
            style={styles.input}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>
              <FormattedMessage id="price" />
            </Text>
            <View style={styles.inputfile}>
              <InputField
                placeholder="0.00"
                keyboardType="numeric"
                value={formData.precio ? formData.precio.toString() : ""}
                onChangeText={(text) => {
                  const value = parseFloat(text);
                  setFormData({ ...formData, precio: isNaN(value) ? 0 : value });
                  if (!isNaN(value) && value > 0) {
                    setErrors((prev) => ({ ...prev, precio: null }));
                  }
                }}
                error={errors.precio}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>
              <FormattedMessage id="currency" />
            </Text>
            <SelectField

              selectedValue={formData.currency_id}
              onValueChange={(value) => {
                setFormData({ ...formData, currency_id: value });
                setErrors((prev) => ({ ...prev, currency_id: null }));
              }}
              placeholder="Seleccione una moneda"
              options={currencies.map((c: { codigo: string; simbolo: string; id: number }) => ({
                label: `${c.codigo} (${c.simbolo})`,
                value: c.id,
              }))}
              error={errors.currency_id ?? undefined}
            />
          </View>
        </View>

        <Text style={styles.label}>
          <FormattedMessage id="estimatedDuration" />
        </Text>
        <View style={styles.inputfile}>
          <InputField
            placeholder="Ej: 45"
            keyboardType="numeric"
            value={
              formData.plazoDuracionEstimadoMinutos
                ? formData.plazoDuracionEstimadoMinutos.toString()
                : ""
            }
            onChangeText={(text) => {
              const value = parseInt(text);
              setFormData({
                ...formData,
                plazoDuracionEstimadoMinutos: isNaN(value) ? 0 : value,
              });
              if (!isNaN(value) && value > 0) {
                setErrors((prev) => ({ ...prev, plazoDuracionEstimadoMinutos: null }));
              }
            }}
            error={errors.plazoDuracionEstimadoMinutos}
            style={styles.input}
          />
        </View>

        {
          <View mb={4} style={styles.column}>
            <Text style={styles.label}>
              <FormattedMessage id="category" defaultMessage="Categoría" />
            </Text>
            <View>
              <MultiSelectInput
                sizeText={16}
                height={50}
                isMultiple
                placeholder={intl.formatMessage({ id: "selectCategory", defaultMessage: "Seleccionar categoría" })}
                options={allCategories.map((cat) => ({
                  label: cat.name,
                  value: cat.id.toString(),
                  placeholder: cat.name,
                }))}
                itemsSelected={formData.categoryIds}
                setItemsSelected={(selectedIds: (number | string)[]) => {
                  setFormData((prev) => ({
                    ...prev,
                    categoryIds: selectedIds.map(String),
                  }));

                  if (selectedIds.length > 0 && errors.categoryIds) {
                    setErrors((prev) => ({
                      ...prev,
                      categoryIds: null,
                    }));
                  }
                }}

                onSearch={() => { }}
                error={errors.categoryIds}
              />
            </View>
          </View>
        }

        <Text style={styles.label}>
          <FormattedMessage id="description" />
        </Text>
        <View style={styles.inputfile}>
          <InputField
            placeholder={intl.formatMessage({
              id: "productDescriptionPlaceholder",
              defaultMessage: "Ej: Plato clásico con papas fritas",
            })}
            isTextArea
            value={formData.descripcion}
            onChangeText={(text) => {
              setFormData({ ...formData, descripcion: text });
              if (text.trim()) {
                setErrors((prev) => ({ ...prev, descripcion: null }));
              }
            }}
            error={errors.descripcion}
            style={styles.inputarea}
          />
        </View>

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
      {/* </ScrollView> */}
    </KeyboardAwareScrollView>
  );
};

export default EditProduct;
