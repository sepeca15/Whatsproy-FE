import React, { useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated, Modal, Pressable, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import { styles } from "./CardProdStyle";
import api from "@/services/api/admin";
import { useLocalization } from "@/app/LocalizationContext"; // Importa el contexto de localización
import { FormattedMessage, useIntl } from 'react-intl'; // Importa FormattedMessage y useIntl
import type {
  Product,
  SatisfactionData,
  ProductBDD,
  CategoryData,
  SalesData,
  DayslySalesData,
  MonthlySalesData,
} from "../../../../../hooks/dataProduct";

interface ProductCardProps {
  product: Product;
  productBDD: ProductBDD;
  salesData: SalesData;
  categoryData: CategoryData;
  satisfactionData: SatisfactionData;
  monthlySalesData: MonthlySalesData;
  dayslySalesData: DayslySalesData;
  onUpdateProduct: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  salesData,
  productBDD,
  categoryData,
  satisfactionData,
  monthlySalesData,
  dayslySalesData,
  onUpdateProduct,
}) => {
  const router = useRouter();
  const { locale } = useLocalization();
  const intl = useIntl(); // Usa useIntl para obtener el objeto intl
  const [isFlipped, setIsFlipped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [localDisponible, setLocalDisponible] = useState(productBDD.disponible);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    if (isFlipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsFlipped(false));
    } else {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsFlipped(true));
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handleEdit = () => {
    router.push({
      pathname: "/(tabs)/editprod",
      params: {
        id: productBDD.id.toString(),
        title: productBDD.nombre,
        price: productBDD.precio.toString(),
        currency: product.currency,
        duration: productBDD.plazoDuracionEstimadoMinutos.toString(),
        description: productBDD.descripcion,
        imageUrl: product.imageUrl,
        disponible: productBDD.disponible.toString(),
        empresa_id: productBDD.empresa_id,
      },
    });
  };

  const handleView = () => {
    router.push({
      pathname: "/(tabs)/graficprod",
      params: {
        id: productBDD.id.toString(),
        title: productBDD.nombre,
        price: productBDD.precio.toString(),
        currency: product.currency,
        duration: productBDD.plazoDuracionEstimadoMinutos.toString(),
        description: productBDD.descripcion,
        imageUrl: product.imageUrl,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        tags: product.tags,
        daydata: JSON.stringify(dayslySalesData),
        monthdata: JSON.stringify(monthlySalesData),
        disponible: productBDD.disponible.toString(),
        empresa_id: productBDD.empresa_id.toString(),
      },
    });
  };

  const handleModify = () => {
    console.log("Modificar");
  };

  const toggleAvailability = async () => {
    setModalVisible(false);
    const newDisponible = !localDisponible;
    setLocalDisponible(newDisponible);
    try {
      const updatedProduct = { ...productBDD, disponible: newDisponible };
      await api.products.update(productBDD.id, updatedProduct);
      console.log("Producto actualizado");
      onUpdateProduct();
    } catch (error) {
      console.error("Error al actualizar el producto", error);
      setLocalDisponible(!newDisponible);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      intl.formatMessage({ id: "confirmDelete", defaultMessage: "Confirm deletion" }),
      intl.formatMessage({ id: "confirmDeleteMessage", defaultMessage: "Are you sure you want to delete this product?" }),
      [
        {
          text: intl.formatMessage({ id: "cancel", defaultMessage: "Cancel" }),
          style: "cancel",
        },
        {
          text: intl.formatMessage({ id: "delete", defaultMessage: "Delete" }),
          onPress: () => {
            setModalVisible(false);
            api.products.delete(productBDD.id).then(() => {
              console.log("Producto eliminado");
              onUpdateProduct();
            });
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.containerFatehr}>
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        onPress={handleView}
      >
        {localDisponible === false && (
          <View style={styles.categoryLabel}>
            <Text style={styles.categoryText}>
              <FormattedMessage id="notAvailable" defaultMessage="Not available" />
            </Text>
          </View>
        )}
        <Animated.View style={[styles.card, frontAnimatedStyle, { backfaceVisibility: "hidden" }]}>
          <Pressable
            style={({ pressed }) => [styles.imageContainer]}
            onLongPress={flipCard}
          >
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
          </Pressable>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titlePriceContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {productBDD.nombre}
                </Text>
                <Text style={styles.price}>
                  ${productBDD.precio.toFixed(2)} {product.currency}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.moreButton}>
                <Icon name="more-vertical" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.description} numberOfLines={3}>
              {productBDD.descripcion}
            </Text>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            backAnimatedStyle,
            { backfaceVisibility: "hidden", position: "absolute", top: 0 },
          ]}
          pointerEvents={isFlipped ? "auto" : "none"}
        >
          <View style={styles.cardBackContent}>
            <Text style={styles.title}>
              <FormattedMessage id="somethingHere" defaultMessage="Here we might put something" />
            </Text>
            <TouchableOpacity onPress={flipCard} style={[styles.cardBackButton, styles.flipBackButton]}>
              <View style={styles.buttonContent}>
                <Icon name="rotate-ccw" size={20} color="white" style={styles.backIcon} />
                <Text style={styles.cardBackButtonText}>
                  <FormattedMessage id="back" defaultMessage="Back" />
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={[styles.modalOption, styles.editButton]} onPress={handleEdit}>
                <Icon name="edit" size={20} style={styles.modalIcon} />
                <Text style={styles.modalOptionText}>
                  <FormattedMessage id="edit" defaultMessage="Edit" />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleAvailability} style={[styles.modalOption, styles.archiveButton]}>
                <Icon name="archive" size={20} color={""} style={styles.modalIcon} />
                <Text style={styles.modalOptionText}>
                  {localDisponible ? <FormattedMessage id="disable" defaultMessage="Disable" /> : <FormattedMessage id="enable" defaultMessage="Enable" />}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={[styles.modalOption, styles.deleteButton]}>
                <Icon name="trash-2" size={20} color={""} style={styles.modalIcon} />
                <Text style={styles.modalOptionText}>
                  <FormattedMessage id="delete" defaultMessage="Delete" />
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </Pressable>
    </View>
  );
};

export default ProductCard;