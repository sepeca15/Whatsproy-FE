import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  Animated,
  RefreshControl,
} from "react-native";
import { ProductCard } from "./components/CardProducts/CardProduct";
import ProductCardSkeleton from "./components/ProductCardSkeleton";
import {
  sampleProducts,
  type ProductBDD,
  monthlySalesData,
  dayslySalesData,
} from "../../../hooks/dataProduct";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "./ProductosStyles";
import api from "@/services/api/admin";
import { useLocalization } from "@/app/LocalizationContext";
import { useIntl, FormattedMessage } from "react-intl";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { Colors } from "../../../constants/Colors";
import { useToastContext } from "@/contexts/ToastContext";
import { Image, ScrollView, View } from "native-base";
import type { ICategoryData } from "../Categories/components/CardCategory/CardCategory";
import AnimatedTwo from "react-native-reanimated";
import CustomText from "@/components/CustomText";
import { globalStyles } from "@/components/globalStyles";

const Productos: React.FC = () => {
  const router = useRouter();
  const [ProductsBD, setProducts] = useState<ProductBDD[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { locale } = useLocalization();
  const intl = useIntl();
  const { showToast } = useToastContext();
  const [isDeleting, setIsDeleting] = useState(true);

  console.log("isInitialLoading", isInitialLoading)
  const [allCategories, setAllCategories] = useState<ICategoryData[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectCategory, setSelectCategory] = useState<number | null>(null);

  // New state for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );
  const deleteAnimationRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAllCategories = async () => {
    try {
      setLoadingCategories(true);
      const resp = await api.category.getAll();

      if (resp.ok) {
        setAllCategories(resp.data);
        if (resp.data.length > 0) {
          setSelectCategory(resp.data[0].id);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProductsFromCategory = async () => {
    try {
      setIsInitialLoading(true);
      if (selectCategory) {
        const resp = await api.category.getProducts({
          categoryId: selectCategory,
        });
        if (resp.ok) {
          setProducts(resp.data);
        }
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
    } finally {
      if (selectCategory) {
        setIsInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    loadAllCategories();
  }, []);

  useEffect(() => {
      loadProductsFromCategory();
  }, [selectCategory]);

  useEffect(() => {
    if (!isInitialLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isInitialLoading]);

  const handleDeleteRequest = useCallback(
    (productId: number) => {
      setDeletingProductId(productId);
      setShowDeleteModal(true);
      setIsDeleting(true);

      setTimeout(async () => {
        try {
          const resp = await api.products.delete(productId);
          if (resp.data.ok) {
            onDeleteProduct(productId);
            setIsDeleting(false);

            setTimeout(() => {
              setShowDeleteModal(false);
              setDeletingProductId(null);
            }, 1500);
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
    },
    [intl]
  );
  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;

    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.7)",
          zIndex: 50,
        }}
      >
        <Animatable.View
          animation="zoomIn"
          duration={400}
          style={{
            width: 300,
            height: 200,
            backgroundColor: "white",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
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
            source={
              isDeleting
                ? require("../../../constants/Animation-black-trash-robot.json") // Animación mientras se elimina
                : require("../../../constants/Animation-succes-deleted.json") // Animación de éxito
            }
            autoPlay
            loop={!isDeleting}
            style={{
              width: isDeleting ? 150 : 200,
              height: isDeleting ? 200 : 150,
              position: "absolute",
              top: isDeleting ? 0 : 0,
            }}
          />
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
            style={{
              marginTop: 120,
              fontWeight: "bold",
              fontSize: 12,
              color: Colors.light.primary,
              textAlign: "center",
            }}
          >
            <FormattedMessage
              id={
                isDeleting
                  ? "deletingProduct"
                  : "deletedProduct.modal.delete.card"
              }
              defaultMessage={
                isDeleting ? "Deleting product..." : "Product deleted!"
              }
            />
          </Animatable.Text>
        </Animatable.View>
      </View>
    );
  };

  const updateProduct = (newProduct: any) => {
    setProducts((prevState) => {
      const prevFilter = prevState.map((prod) => {
        if (prod.id === newProduct.id) {
          return newProduct;
        }
        return prod;
      });

      return prevFilter;
    });
  };

  const onDeleteProduct = (prodId: number) => {
    setProducts((prevState) => {
      const filter = prevState.filter((prod) => prod.id !== prodId);

      return filter;
    });
  };

  const filteredProducts = (ProductsBD ?? [])
    .filter((product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre, locale));

  return (
    <View style={styles.container}>
      <AnimatedTwo.View style={styles.header}>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel="Pedidos"
            >
              <FormattedMessage id="products" />
            </CustomText>
          </View>
        </View>
      </AnimatedTwo.View>

      <View style={{ paddingHorizontal: 6, height: "100%" }}>
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
        {allCategories.length > 0 ? (
          <View style={styles.categoryContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {allCategories.map((category, index) => {
                const isSelected = selectCategory === category.id;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectCategory(category.id)}
                    key={`button-category-${index}`}
                    style={[
                      styles.categoryButton,
                      isSelected && styles.selectedCategoryButton,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Image
                      alt={category.name}
                      style={styles.categoryImage}
                      source={{ uri: category.image }}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.selectedCategoryText,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : <View></View>}
        {/* (
          !loadingCategories && (
            <View
              w={"full"}
              display={"flex"}
              flexDir={"row"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Text>
                <FormattedMessage id="nocategories" />
              </Text>
            </View>
          )
        ) */}

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                try {
                  setRefreshing(true);
                  await loadAllCategories();
                  await loadProductsFromCategory();
                } catch (error) {
                } finally {
                  setRefreshing(false);
                }
              }}
              tintColor={Colors.light.primary}
            />
          }
        >
          {isInitialLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <ProductCardSkeleton key={`item-${index}`} />
            ))
          ) : filteredProducts.length > 0 ? (
            <Animated.View style={{ opacity: fadeAnim }}>
              {filteredProducts.map((product) => {
                return (
                  <View key={product.id} style={{ paddingHorizontal: 5 }}>
                    <ProductCard
                      key={product.id}
                      product={sampleProducts[1]}
                      productBDD={product}
                      dayslySalesData={dayslySalesData}
                      monthlySalesData={monthlySalesData}
                      onUpdateProduct={updateProduct}
                      onDeleteRequest={handleDeleteRequest}
                      isBeingDeleted={deletingProductId === product.id}
                    />
                  </View>
                );
              })}
            </Animated.View>
          ) : (
            <Animatable.View
              animation="fadeIn"
              style={styles.emptyStateContainer}
            >
              <LottieView
                source={
                  searchTerm
                    ? require("../../../constants/Animation-screach-empty.json")
                    : require("../../../constants/Animation-empty-box.json")
                }
                autoPlay
                loop
                style={styles.emptyStateAnimation}
              />
              <Text style={styles.emptyStateTitle}>
                <FormattedMessage
                  id="noProductsFound"
                  defaultMessage="No hay productos"
                />
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchTerm ? (
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
      </View>
      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity
          style={globalStyles.addButton}
          onPress={() => {
            router.push("/(tabs)/addpro");
          }}
        >
          <Text style={globalStyles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Productos;
