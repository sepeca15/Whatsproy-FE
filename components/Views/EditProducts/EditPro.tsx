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
  console.log('Params:', params);
  
  const editProProps: EditProProps = {
    id: parseInt(params.id as string, 10),
    name: params.name as string,
    price: params.price as string,
    currency: params.currency as string,
    duration: params.duration as string,
    description: params.description as string,
    image: (params.image as string) ?? '',
    onUpdateProduct: (updatedProduct) => {
      console.log('Product updated:', updatedProduct);
      // Aquí la lógica para manejar la actualización del producto
    },
  };

  return (
    <View style={styles.container}>
      <EditProduct {...editProProps} />
    </View>
  );
};

export default EditPro;