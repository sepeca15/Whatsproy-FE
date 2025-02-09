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
  imageUrl?: string; 
  disponible: boolean;
  empresa_id: number;
}


interface EditProProps {
  id: number;
  name: string;
  price: string;
  // currency: string;
  duration: string;
  description: string;
  imageUrl: string;
  disponible: string;
  empresa_id: number;
 
}



const EditPro: React.FC = () => {
  const params = useLocalSearchParams();

  const editProProps: EditProProps = {
    id: parseInt(params.id as string, 10) || 0,
    name: params.title as string || '',
    price: params.price as string || '',
    // currency: params.currency as string || '',
    duration: params.duration as string || '',
    description: params.description as string || '',
    imageUrl: (params.imageUrl as string) ?? '',
    disponible: (params.disponible as string),
    empresa_id: parseInt(params.empresa_id as string, 10) || 0,
    
  };

  

  return (
    <View style={styles.container}>
      <EditProduct {...editProProps} />
    </View>
  );
};

export default EditPro;
