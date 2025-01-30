import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, TouchableOpacity, Text, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProductCard } from "./components/CardProducts/CardProduct";
import { sampleProducts, ProductBDD, salesData, categoryData, satisfactionData, monthlySalesData, dayslySalesData } from "../../../hooks/dataProduct";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './ProductosStyles';
import api from "@/services/api/admin";
import { Colors } from "../../../constants/Colors"; // Asegúrate de importar los colores desde el archivo correcto

const Productos: React.FC = () => {
  const router = useRouter();
  const [ProductsBD, setProducts] = useState<ProductBDD[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const trashZoneRef = useRef<View>(null);

  const allProduct = async () => {
    try {
      const response = await api.products.getAll();
      const productData: ProductBDD[] = response.data;
      setProducts(productData);
      console.log('productData', productData);
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

  const checkIfOverTrash = (gestureState: any) => {
    if (trashZoneRef.current) {
      trashZoneRef.current.measure((fx, fy, width, height, px, py) => {
        const isOver = gestureState.moveY > py && gestureState.moveY < py + height &&
                       gestureState.moveX > px && gestureState.moveX < px + width;
        setIsOverTrash(isOver);
      });
    }
  };

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
            setIsDragging={setIsDragging}
            checkIfOverTrash={checkIfOverTrash}
          />
        ))}
      </ScrollView>
      {isDragging && (
        <View style={styles.trashZoneContainer} ref={trashZoneRef}>
          <LinearGradient
            colors={['rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 0.5)', 'rgba(255, 0, 0, 0)']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={styles.trashZone}
          >
            <Text style={styles.trashZoneText}>{isOverTrash ? "SOLTAR PARA ELIMINAR" : "ELIMINAR"}</Text>
          </LinearGradient>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => { router.push("/(tabs)/addpro") }}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Productos;