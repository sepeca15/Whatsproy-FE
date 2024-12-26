import React from 'react';
import { View } from 'react-native';
import EditProduct from './components/EditProductos';
import { styles } from './components/EditProductStyle';
import { useLocalSearchParams } from "expo-router";

interface ProductFormData {
  id: number;
  name: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  image?: string;
}

interface EditProProps {
  id: number;
  name: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  image: string;
  onUpdateProduct: (updatedProduct: ProductFormData) => void;
}

const EditPro: React.FC = () => {
  const params = useLocalSearchParams();
  const { id, name, description, duration, currency, price, image } = params;

  // Asegúrate de que los parámetros sean de tipo string
  const idNum = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
  const nameStr = Array.isArray(name) ? name[0] : name;
  const descriptionStr = Array.isArray(description) ? description[0] : description;
  const durationStr = Array.isArray(duration) ? duration[0] : duration;
  const currencyStr = Array.isArray(currency) ? currency[0] : currency;
  const priceStr = Array.isArray(price) ? price[0] : price;
  const imageStr = Array.isArray(image) ? image[0] : image;

  // Crear un objeto que cumpla con la interfaz EditProProps
  const editProProps: EditProProps = {
    id: idNum,
    name: nameStr,
    price: priceStr,
    currency: currencyStr,
    duration: durationStr,
    description: descriptionStr,
    image: imageStr ?? '',
    onUpdateProduct: (updatedProduct) => {
      console.log('Product updated:', updatedProduct);
      // Aquí puedes agregar la lógica para manejar la actualización del producto
    },
  };

  return (
    <View style={styles.container}>
      <EditProduct {...editProProps} />
    </View>
  );
};

export default EditPro;