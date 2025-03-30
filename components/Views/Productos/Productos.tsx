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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(true);

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
    // Extract unique categories from products
    if (ProductsBD.length > 0) {
      const uniqueCategories = Array.from(
        new Set(ProductsBD.map((product) => product.categoria ? product.categoria : 'food')),
      );
      setCategories(uniqueCategories);
    }
  }, [ProductsBD]);


  useEffect(() => {
    allProduct(true);
  }, [allProduct]);

  const handleDeleteRequest = useCallback((productId: number) => {
    setDeletingProductId(productId);
    setShowDeleteModal(true);
    setIsDeleting(true); // Al iniciar, muestra la animación de "eliminando"

    setTimeout(async () => {
      try {
        const resp = await api.products.delete(productId);
        if (resp.data.ok) {

          setIsDeleting(false); // Cambia la animación a "eliminado con éxito"

          setTimeout(() => {
            setShowDeleteModal(false);
            setDeletingProductId(null);
            allProduct(false);
          }, 1500); // Espera 1.5s con la animación de éxito antes de cerrar
        }
      } catch (error: any) {
        setShowDeleteModal(false);
        setDeletingProductId(null);

        showToast({
          title: error.response?.data?.message || "Error deleting product",
          status: "error",
        });
      }
    }, 2700);
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
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
        >
          <LottieView
            ref={deleteAnimationRef}
            source={isDeleting
              ? require("../../../constants/Animation-black-trash-robot.json") // Animación mientras se elimina
              : require("../../../constants/Animation-succes-deleted.json") // Animación de éxito
            }
            autoPlay
            loop={!isDeleting} // Solo se repite si está eliminando
            style={{
              width: isDeleting ? 150 : 200,
              height: isDeleting ? 200 : 150,
              position: 'absolute',
              top: isDeleting ? 0 : 0,
            }}
          />
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
            style={{
              marginTop: 120,
              fontWeight: 'bold',
              fontSize: 12,
              color: Colors.light.primary,
              textAlign: 'center'
            }}
          >
            <FormattedMessage
              id={isDeleting ? "deletingProduct" : "deletedProduct.modal.delete.card"}
              defaultMessage={isDeleting ? "Deleting product..." : "Product deleted!"}
            />
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
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.categoria === selectedCategory : true
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
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !selectedCategory && styles.selectedCategoryChip
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryText,
              !selectedCategory && styles.selectedCategoryText
            ]}
          >
            <FormattedMessage id="allCategories" defaultMessage="All" />
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {isInitialLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : filteredProducts.length > 0 ? (
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
        ) : (
          <Animatable.View animation="fadeIn" style={styles.emptyStateContainer}>
            <LottieView
              source={
                selectedCategory
                  ? require("../../../constants/Animation-fantasma-empty.json") // Para categoría vacía
                  : searchTerm
                    ? require("../../../constants/Animation-screach-empty.json") // Para búsqueda vacía
                    : require("../../../constants/Animation-empty-box.json") // Para sin productos
              }
              autoPlay
              loop
              style={styles.emptyStateAnimation}
            />
            <Text style={styles.emptyStateTitle}>
              <FormattedMessage id="noProductsFound" defaultMessage="No hay productos" />
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {selectedCategory ? (
                <FormattedMessage
                  id="noProductsInCategory"
                  defaultMessage="No products in this category"
                />
              ) : searchTerm ? (
                <FormattedMessage
                  id="noProductsMatchSearch"
                  defaultMessage="No products match your search"
                />
              ) : (
                <FormattedMessage
                  id="addYourFirstProduct"
                  defaultMessage="Add your first product by clicking the + button"
                />
              )}
            </Text>
          </Animatable.View>
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