import React from 'react';
import { View, Text } from 'react-native';
import EditProduct from './components/EditProductos';
import { styles } from './components/EditProductStyle';
import { useSearchParams } from 'expo-router';

const EditPro: React.FC = () => {
  const { name, price, currency, duration, description, image } = useSearchParams();

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