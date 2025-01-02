import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { styles } from './EditProductStyle';
import { useRouter } from 'expo-router';
import { availableCurrencies } from '../../Productos/Components/dataProduct'; 

interface ProductFormData {
  id: number;
  name: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  image?: string;
}

interface EditProductProps {
  id: number;
  name: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  image?: string;
  onUpdateProduct: (updatedProduct: ProductFormData) => void;
}

const EditProduct: React.FC<EditProductProps> = ({
  id,
  name,
  price,
  currency,
  duration,
  description,
  image,
  onUpdateProduct
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    id,
    name,
    price,
    currency,
    duration,
    description,
    image: image || '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(image ?? null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    const updatedProduct = { ...formData, image: selectedImage || undefined };
    console.log('Form submitted:', updatedProduct);
    onUpdateProduct(updatedProduct);
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Ej: Corte de Cabello"
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Moneda</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  style={styles.picker}
                >
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
            value={formData.duration}
            onChangeText={(text) => setFormData({ ...formData, duration: text })}
            placeholder="Ej: 30 minutos"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Describe el producto o servicio"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProduct;