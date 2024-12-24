import React from 'react';
import { View, Text } from 'react-native';
import EditProduct from './components/EditProductos';
import { styles } from './components/EditProductStyle';
import { useLocalSearchParams } from "expo-router";


interface EditProProps {
  name: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  image: string;
}

const EditPro: React.FC = () => {
  const { name, description, duration, currency, price, image}:any  = useLocalSearchParams();
  console.log(name, description, duration, currency, price, image);

 
  return (
    <View style={styles.container}>
      <Text>Editar Producto</Text>
      <EditProduct
        name={name}
        price={price}
        currency={currency}
        duration={duration}
        description={description}
        image={image}
      />
    </View>
  );
};

export default EditPro;