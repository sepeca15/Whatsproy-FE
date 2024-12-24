import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { ProductCard } from "./components/CarProduct";
import { sampleProducts } from "./components/dataProduct";
import { useRouter } from 'expo-router'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './ProductosStyles';

const Productos: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {sampleProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
            imageUrl={product.imageUrl}
          />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.graficButton} onPress={() => {}}>
          <Icon name="line-chart" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => { router.push("/(tabs)/addpro") }}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Productos;