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
import { styles } from './AddProductStyle';

interface ProductFormData {
  name: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  image?: string;
}

const AddProduct: React.FC = () => {
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
    console.log('Form submitted:', { ...formData, image });
    // Add your submission logic here
  };

  return (
    <ScrollView style={styles.container}>
     

      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
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
            <View style={styles.pickerContainer}>
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
          <Text style={styles.buttonText}>Crear</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddProduct;