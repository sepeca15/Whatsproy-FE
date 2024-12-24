import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { styles } from './EditProductStyle';
import { useRouter } from 'expo-router';

interface ProductFormData {
  name: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  image?: string;
}

interface EditProductProps {
  name: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  image?: string;
}

const EditProduct: React.FC<EditProductProps> = ({
  name,
  price,
  currency,
  duration,
  description,
  image,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name,
    price,
    currency,
    duration,
    description,
    image: image || '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(image || null);

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
    console.log('Form submitted:', { ...formData, image: selectedImage });
    // Add your submission logic here
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <AntDesign name="upload" size={24} color="gray" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Nombre del producto"
        />

        <View style={styles.priceContainer}>
          <View style={styles.priceInput}>
            <Text style={styles.label}>Precio:</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>

          <View style={styles.currencyPicker}>
            <Text style={styles.label}>Moneda:</Text>
            <Picker
              selectedValue={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
              style={styles.picker}
            >
              <Picker.Item label="USD" value="USD" />
              <Picker.Item label="EUR" value="EUR" />
              <Picker.Item label="GBP" value="GBP" />
            </Picker>
          </View>
        </View>

        <Text style={styles.label}>Duración (estimado):</Text>
        <TextInput
          style={styles.input}
          value={formData.duration}
          onChangeText={(text) => setFormData({ ...formData, duration: text })}
          placeholder="15mn"
        />

        <Text style={styles.label}>Información:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Descripción del producto"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProduct;