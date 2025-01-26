import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text, TextInput } from "react-native";
import { ProductCard } from "./components/CardProducts/CardProduct";
import { sampleProducts, Product, ProductBDD, salesData, categoryData, satisfactionData, monthlySalesData, dayslySalesData } from "../../../hooks/dataProduct";
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './ProductosStyles';
import api from "@/services/api/admin";

const Productos: React.FC = () => {
  const router = useRouter();
  const [ProductsBD, setProducts] = useState<ProductBDD[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const allProduct = async () => {
    try {
      const response = await api.products.getAll();
      const productData: ProductBDD[] = response.data;
      setProducts(productData);
     console.log('productData', productData)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    allProduct();
  }, []);



  const filteredProducts = ProductsBD.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={sampleProducts[2]}
            productBDD={product}
            salesData={salesData}
            satisfactionData={satisfactionData}
            categoryData={categoryData}
            dayslySalesData={dayslySalesData}
            monthlySalesData={monthlySalesData}
            onUpdateProduct={() => {}}
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