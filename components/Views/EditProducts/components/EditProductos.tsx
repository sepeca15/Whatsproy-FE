import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Colors } from "../../../../constants/Colors"
import { Switch } from "react-native"
import { Picker } from "@react-native-picker/picker"
import * as ImagePicker from "expo-image-picker"
import { AntDesign } from "@expo/vector-icons"
import { styles } from "./EditProductStyle"
import { useRouter } from "expo-router"
import { availableCurrencies } from "@/hooks/dataProduct"
import api from "@/services/api/admin"

interface ProductFormData {
  id: number
  nombre: string
  descripcion: string
  disponible: boolean
  empresa_id: number
  plazoDuracionEstimadoMinutos: number
  precio: number
}

interface EditProductProps {
  id: number
  name: string
  price: string
  // currency: string;
  duration: string
  description: string
  imageUrl?: string
  disponible?: string
  empresa_id?: number
}

const EditProduct = ({
  id,
  name,
  price,
  // currency,
  duration,
  description,
  imageUrl,
  disponible,
  empresa_id,
}: EditProductProps) => {
  console.log("disponible", disponible)
  const router = useRouter()
  const [formData, setFormData] = useState<ProductFormData>({
    id,
    nombre: name,
    descripcion: description,
    disponible: disponible === "true" ? true : false,
    empresa_id: empresa_id ?? 0,
    plazoDuracionEstimadoMinutos: Number.parseInt(duration, 10) || 0,
    precio: Number.parseFloat(price) || 0,
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(imageUrl ?? null)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    const Prodnew = { ...formData }
    const UpdateProd = async () => {
      await api.products.update(Prodnew.id, Prodnew)
    }
    UpdateProd()

    router.back()
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Editar Producto</Text>

        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <AntDesign name="camera" size={40} color="gray" />
              <Text style={styles.uploadText}>Añadir Imagen</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre del Producto</Text>
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            placeholder="Ej: Milanesa"
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                value={formData.precio === 0 ? "" : formData.precio.toString()}
                onChangeText={(text) => {
                  const parsedValue = Number.parseFloat(text)
                  setFormData({ ...formData, precio: isNaN(parsedValue) ? 0 : parsedValue })
                }}
                keyboardType="numeric"
                placeholder="'Ej: 1000'"
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Moneda</Text>
              <View style={styles.pickerContainer}>
                <Picker style={styles.picker}>
                  {availableCurrencies.map((currency) => (
                    <Picker.Item key={currency} label={currency} value={currency} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <Text style={styles.label}>Duración Estimada</Text>
          <TextInput
            style={styles.input}
            value={formData.plazoDuracionEstimadoMinutos === 0 ? "" : formData.plazoDuracionEstimadoMinutos.toString()}
            onChangeText={(text) => {
              const parsedValue = Number.parseFloat(text)
              setFormData({ ...formData, plazoDuracionEstimadoMinutos: isNaN(parsedValue) ? 0 : parsedValue })
            }}
            keyboardType="numeric"
            placeholder="Ej: 30 minutos"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            placeholder="Describe el producto o servicio"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Disponible</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={formData.disponible}
              onValueChange={(value) => setFormData({ ...formData, disponible: value })}
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
            <Text style={[styles.switchText, { color: formData.disponible ? "#4CAF50" : "#F44336" }]}>
              {formData.disponible ? "Disponible" : "No Disponible"}
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default EditProduct

