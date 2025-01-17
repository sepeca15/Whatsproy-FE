import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";

import { ProductCard } from "./components/CardProduct/CardProduct";
import { useRouter } from 'expo-router';
import { styles } from './ProductosStyles';
import api from "@/services/api/admin";
import { categoryData, monthlySalesData, Product, ProductBDD, salesData, sampleProducts, satisfactionData, weeklySalesData } from "@/hooks/dataProduct";

const Productos: React.FC = () => {
  const router = useRouter();
  const [ProductsBD, setProducts] = React.useState<ProductBDD[]>([]);



  const allProduct = async () => {
    try {
      const response = await api.products.getAll();
      const productData: ProductBDD[] = response.data;
      setProducts(productData);

    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    allProduct();

  }, []);

  console.log("productsBD", ProductsBD);


  const handleUpdateProduct = (updatedProduct: Product) => {

  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {ProductsBD.map((product) => (
          <ProductCard
            key={product.id}
            product={sampleProducts[0]}
            salesData={salesData}
            satisfactionData={satisfactionData}
            categoryData={categoryData}
            weeklySalesData={weeklySalesData}
            monthlySalesData={monthlySalesData}
            onUpdateProduct={handleUpdateProduct}
          />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => { router.push("/(tabs)/addpro") }}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Productos;
