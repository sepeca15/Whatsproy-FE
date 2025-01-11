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
import { styles } from './AddProductStyle';
import { useRouter } from 'expo-router';
import { availableCurrencies } from '@/components/Views/Productos/components/dataProduct';
interface ProductFormData {
  name: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  image?: string;
}

const AddProduct: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    currency: 'USD',
    duration: '',
    description: '',
  });
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    const newProduct = { ...formData, image };
    console.log('Form submitted:', newProduct);
    // Lógica para agregar el producto a la base de datos
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
       

        <Text style={styles.title}>Añadir Producto</Text>

        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
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
            <Text style={styles.buttonText}>Crear Producto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddProduct;
