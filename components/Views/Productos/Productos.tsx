import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";

import {
  sampleProducts,
  Product,
} from "@/components/Views/Productos/components/dataProduct";

import { ProductCard } from "@/components/Views/Productos/components/CardProduct/CarProduct";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "./ProductosStyles";

const Productos: React.FC = () => {
  const router = useRouter();

  const handleUpdateProduct = (updatedProduct: Product) => {
    // Aquí puedes manejar la actualización del producto
    console.log("Product updated:", updatedProduct);
    // Lógica para actualizar el producto en la base de datos
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {sampleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onUpdateProduct={handleUpdateProduct}
          />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            router.push("/(tabs)/addpro");
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Productos;
