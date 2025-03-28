// Modified Productos.tsx parent component

"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { ProductCard } from "./components/CardProducts/CardProduct";
import ProductCardSkeleton from "./components/ProductCardSkeleton";
import {
  sampleProducts,
  type ProductBDD,
  salesData,
  categoryData,
  satisfactionData,
  monthlySalesData,
  dayslySalesData,
} from "../../../hooks/dataProduct";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "./ProductosStyles";
import api from "@/services/api/admin";
import { useLocalization } from "@/app/LocalizationContext";
import { useIntl, FormattedMessage } from "react-intl";
import * as Animatable from 'react-native-animatable';
import LottieView from "lottie-react-native";
import { Colors } from "../../../constants/Colors";
import { useToastContext } from "@/contexts/ToastContext";

const Productos: React.FC = () => {
  const router = useRouter();
  const [ProductsBD, setProducts] = useState<ProductBDD[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { locale } = useLocalization();
  const intl = useIntl();
  const { showToast } = useToastContext();
  
  // New state for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const deleteAnimationRef = useRef(null);

  const allProduct = useCallback(
    async (isInitial = false) => {
      if (isInitial) {
        setIsInitialLoading(true);
      } else {
        setIsUpdating(true);
      }
      try {
        const response = await api.products.getAll();
        const productData: ProductBDD[] = response;
        setProducts(productData);
      } catch (error) {
        console.error(error);
      } finally {
        if (isInitial) {
          setIsInitialLoading(false);
        } else {
          setIsUpdating(false);
        }
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    },
    [fadeAnim],
  );

  useEffect(() => {
    allProduct(true);
  }, [allProduct]);

  // Handle product deletion request from child component
  const handleDeleteRequest = useCallback((productId: number) => {
    setDeletingProductId(productId);
    setShowDeleteModal(true);
    
    // Perform the actual deletion after animation delay
    setTimeout(async () => {
      try {
        const resp = await api.products.delete(productId);
        if (resp.data.ok) {
          // Keep the animation visible for a moment after successful deletion
          setTimeout(() => {
            setShowDeleteModal(false);
            setDeletingProductId(null);
           
            allProduct(false);
          }, 100);
          
         
        }
      } catch (error: any) {
        setShowDeleteModal(false);
        setDeletingProductId(null);
        
        showToast({
          title: error.response?.data?.message || "Error deleting product",
          status: "error",
        });
      }
    }, 1500);
  }, [allProduct, intl, showToast]);

  // Render the delete modal
  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;
    
    return (
      <View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 50,
        }}
      >
        <Animatable.View 
          animation="zoomIn" 
          duration={400}
          style={{
            width: 300,
            height: 200,
            backgroundColor: 'white',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <LottieView
            ref={deleteAnimationRef}
            source={require("../../../constants/Animation-3-trash-robot.json")}
            autoPlay
            loop={true}
            style={{ width: 150, height: 200, position: 'absolute' }}
          />
          <Animatable.Text 
            animation="pulse" 
            iterationCount="infinite" 
            duration={1500}
            style={{ 
              marginTop: 120, 
              fontWeight: 'bold', 
              fontSize: 12,
              color: Colors.light.primary,
              textAlign: 'center' 
            }}
          >
            <FormattedMessage id="deletingProduct" defaultMessage="Deleting product..." />
          </Animatable.Text>
        </Animatable.View>
      </View>
    );
  };

  const handleUpdateProduct = useCallback(() => {
    allProduct(false);
  }, [allProduct]);

  const filteredProducts = (ProductsBD ?? [])
    .filter((product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre, locale));

  return (
    <View style={styles.container}>
      {renderDeleteModal()}
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder={intl.formatMessage({
            id: "searchPlaceholder",
            defaultMessage: "Search by name",
          })}
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {isInitialLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={sampleProducts[1]}
                productBDD={product}
                salesData={salesData}
                satisfactionData={satisfactionData}
                categoryData={categoryData}
                dayslySalesData={dayslySalesData}
                monthlySalesData={monthlySalesData}
                onUpdateProduct={handleUpdateProduct}
                onDeleteRequest={handleDeleteRequest}
                isBeingDeleted={deletingProductId === product.id}
              />
            ))}
          </Animated.View>
        )}
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