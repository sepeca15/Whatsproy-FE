import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  Animated,
  RefreshControl,
} from "react-native";
import ProductCard from "./components/CardProducts/CardProduct";
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
import AddButton from "..../../hooks/add_Button/Add_button";
import { useUser } from "@/hooks/redux/useUser";
import {
  ID_TIPOSERVICIO_DELIVERY,
  ID_TIPOSERVICIO_RESERVA,
  ID_TIPOSERVICIO_RESERVA_ESPACIO
} from "@/services/api/tiposervicio/tiposervicio.type";
import DailyMenuTab from "./DailyMenuTab";
import MenusUpload from "./components/MenusUpload";
import EspaciosTab from "./components/EspaciosTab";

const Productos: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();

  const [ProductsBD, setProducts] = useState<ProductBDD[]>([]);
  const isReserva = user.tipo_servicio === ID_TIPOSERVICIO_RESERVA
  const [searchTerm, setSearchTerm] = useState<string>("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const { locale } = useLocalization();
  const intl = useIntl();
  const { showToast } = useToastContext();
  const [isDeleting, setIsDeleting] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "products" | "dailyMenu" | "uploadMenu" | "espacios"
  >("products");

  const [allCategories, setAllCategories] = useState<ICategoryData[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectCategory, setSelectCategory] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAllCategories = async () => {
    try {
      setLoadingCategories(true);
      const resp = await api.category.getAll();

      if (resp.ok) {
        setAllCategories([
          {
            id: 0,
            name: "Sin categoría",
            image: "",
            description: "Empty category",
            producto: [],
            productosCount: 0,
            createdAt: new Date(),
          },
          ...resp.data,
        ]);
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
      setLoadingProducts(true);
      if (selectCategory !== null) {
        let resp;
        if (selectCategory === 0) {
          resp = await api.category.getProductsWithoutCategores();
        } else {
          resp = await api.category.getProducts({
            categoryId: selectCategory,
          });
        }

        if (resp.ok) {
          console.log("resp.data", resp.data);
          setProducts(resp.data);
        }
      }
    } catch (error: any) {
      console.log("xdxd", error.response?.data?.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const isInitialLoading = loadingCategories || loadingProducts;

  useEffect(() => {
    if (activeTab === "products") {
      loadAllCategories();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "products") {
      loadProductsFromCategory();
    }
  }, [selectCategory, activeTab]);

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
            }, 500);
          }
        } catch (error: any) {
          setShowDeleteModal(false);
          setDeletingProductId(null);

          showToast({
            title:
              error.response?.data?.message ||
              intl.formatMessage({
                id: "errorDeletingProduct",
                defaultMessage: "Error deleting product",
              }),
            status: "error",
          });
        }
      }, 1000);
    },
    [intl]
  );

  useEffect(()=> {
    if( user.tipo_servicio === ID_TIPOSERVICIO_RESERVA_ESPACIO ) {
      setActiveTab('espacios')
    }
  },[])

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

  const renderTabButton = (
    tabKey: "products" | "dailyMenu" | "uploadMenu" | "espacios",
    labelId: string,
    defaultLabel: string
  ) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor:
            activeTab === tabKey ? Colors.light.primary : "transparent",
        },
      ]}
      onPress={() => setActiveTab(tabKey)}
      activeOpacity={0.7}
    >
      <Text
        allowFontScaling={false}
        style={[
          styles.tabButtonText,
          {
            color: activeTab === tabKey ? "#fff" : Colors.light.text,
            fontWeight: activeTab === tabKey ? "bold" : "normal",
          },
        ]}
      >
        <FormattedMessage id={labelId} defaultMessage={defaultLabel} />
      </Text>
    </TouchableOpacity>
  );

  const renderProductsTab = () => (
    <>
      <View style={{ paddingHorizontal: 6, paddingBottom: 80, height: "100%" }}>
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
                    {category.image !== "" && (
                      <Image
                        alt={""}
                        style={styles.categoryImage}
                        source={{ uri: category.image }}
                      />
                    )}
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.categoryText,
                        isSelected && styles.selectedCategoryText,
                        { textAlign: "center" },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View></View>
        )}

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
          {loadingCategories || loadingProducts ? (
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
              <Text allowFontScaling={false} style={styles.emptyStateTitle}>
                <FormattedMessage
                  id="noProductsFound"
                  defaultMessage="No hay productos"
                />
              </Text>
              <Text allowFontScaling={false} style={styles.emptyStateSubtitle}>
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
      <AddButton route="/(tabs)/addpro" />
    </>
  );

  const renderDailyMenuTab = () => <DailyMenuTab />;

  return (
    <View style={styles.container}>
      <AnimatedTwo.View style={styles.header}>
        <View style={globalStyles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel={intl.formatMessage({
                id: isReserva ? "servicesAndProduct" : "products",
                defaultMessage: isReserva
                  ? "Servicios y Productos"
                  : "Productos",
              })}
            >
              {isReserva ? (
                <FormattedMessage
                  id="servicesAndProduct"
                  defaultMessage="Servicios y Productos"
                />
              ) : (
                <FormattedMessage id="products" defaultMessage="Productos" />
              )}
            </CustomText>
          </View>
        </View>
      </AnimatedTwo.View>

      {!isReserva && (
        <View style={styles.tabContainer}>

          {
            user.tipo_servicio !== ID_TIPOSERVICIO_RESERVA_ESPACIO &&
            renderTabButton("products", "products", "Productos")}
          {user.tipo_servicio === ID_TIPOSERVICIO_DELIVERY &&
            renderTabButton("dailyMenu", "dailyMenu", "Menú Diario")}
          {user.tipo_servicio === ID_TIPOSERVICIO_DELIVERY &&
            renderTabButton("uploadMenu", "uploadMenu", "Subir Menú")}
        </View>
      )}

      {activeTab === "products" && renderProductsTab()}
      {activeTab === "dailyMenu" && renderDailyMenuTab()}
      {activeTab === "uploadMenu" && <MenusUpload />}
      {activeTab === "espacios" && <EspaciosTab />}
    </View>
  );
};

export default Productos;
