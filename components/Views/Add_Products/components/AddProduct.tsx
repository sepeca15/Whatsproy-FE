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
import { availableCurrencies } from '@/hooks/dataProduct';
import ProductoTypes from '../../../../services/api/products/types';
import api from "@/services/api/admin";


const AddProduct: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductoTypes>({
    nombre: '',
    precio: 0,
    empresa_id: 0,
    descripcion: '',
    plazoDuracionEstimadoMinutos: 0,
    disponible: false,
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
    const newProduct = { ...formData };

  api.products.create(newProduct)
    .then(response => {
      console.log('Producto creado exitosamente:', response.data);
      router.push("/(tabs)/productos");
    })
    .catch(error => {
      console.error('Error al crear el producto:', error.response.data.message);
      console.log ("error al crear", newProduct )
    });



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
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            placeholder="Ej: Milanesa de pollo"
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
               
                onChangeText={(text) => setFormData({ ...formData, precio: parseFloat(text) })}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Moneda</Text>
              <View style={styles.pickerContainer}>
                <Picker
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
           
            onChangeText={(number) => setFormData({ ...formData, plazoDuracionEstimadoMinutos: parseFloat(number) })}
            placeholder="Ej: 30 minutos"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            
            onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
            placeholder="Describe el producto"
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
