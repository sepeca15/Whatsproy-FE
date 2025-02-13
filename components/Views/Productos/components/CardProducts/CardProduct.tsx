"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, Image, TouchableOpacity, Modal, Alert } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useRouter } from "expo-router"
import { styles } from "./CardProdStyle"
import api from "@/services/api/admin"
import { useLocalization } from "@/app/LocalizationContext"
import { FormattedMessage, useIntl } from "react-intl"


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
export const ProductCard: React.FC<ProductCardProps> = ({ product, productBDD, categoryData, satisfactionData, monthlySalesData, dayslySalesData, salesData, onUpdateProduct }) => {
  const router = useRouter()
  const { locale } = useLocalization()
  const intl = useIntl()
  const [modalVisible, setModalVisible] = useState(false)
  const [localDisponible, setLocalDisponible] = useState(productBDD.disponible)

  const handleEdit = () => {
    router.push({
      pathname: "/(tabs)/editprod",
      params: {
        id: productBDD.id.toString(),
        title: productBDD.nombre,
        price: productBDD.precio.toString(),
        currency: product.currency,
        description: productBDD.descripcion,
        imageUrl: product.imageUrl,
        disponible: productBDD.disponible.toString(),
      },
    })
  }

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

  const toggleAvailability = async () => {
    setModalVisible(false)
    if (localDisponible) {
      Alert.alert(
        intl.formatMessage({ id: "confirmDisable", defaultMessage: "Confirm disable" }),
        intl.formatMessage({
          id: "confirmDisableMessage",
          defaultMessage: "Are you sure you want to disable this product?",
        }),
        [
          {
            text: intl.formatMessage({ id: "cancel", defaultMessage: "Cancel" }),
            style: "cancel",
          },
          {
            text: intl.formatMessage({ id: "disable", defaultMessage: "Disable" }),
            onPress: async () => {
              const newDisponible = false
              setLocalDisponible(newDisponible)
              try {
                const updatedProduct = { ...productBDD, disponible: newDisponible }
                await api.products.update(productBDD.id, updatedProduct)
                onUpdateProduct()
              } catch (error) {
                console.error("Error al actualizar el producto", error)
                setLocalDisponible(!newDisponible)
              }
            },
          },
        ],
        { cancelable: true },
      )
    } else {
      const newDisponible = true
      setLocalDisponible(newDisponible)
      try {
        const updatedProduct = { ...productBDD, disponible: newDisponible }
        await api.products.update(productBDD.id, updatedProduct)
        onUpdateProduct()
      } catch (error) {
        console.error("Error al actualizar el producto", error)
        setLocalDisponible(!newDisponible)
      }
    }
  }

  const handleDelete = () => {
    Alert.alert(
      intl.formatMessage({ id: "confirmDelete", defaultMessage: "Confirm deletion" }),
      intl.formatMessage({
        id: "confirmDeleteMessage",
        defaultMessage: "Are you sure you want to delete this product?",
      }),
      [
        {
          text: intl.formatMessage({ id: "cancel", defaultMessage: "Cancel" }),
          style: "cancel",
        },
        {
          text: intl.formatMessage({ id: "delete", defaultMessage: "Delete" }),
          onPress: () => {
            setModalVisible(false)
            api.products.delete(productBDD.id).then(() => {
              onUpdateProduct()
            })
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <View style={styles.container}>
      {!localDisponible && (
        <View style={styles.disabledLabel}>
          <Text style={styles.disabledText}>
            <FormattedMessage id="disabled" defaultMessage="Disabled" />
          </Text>
        </View>
      )}
      <View style={styles.card} >
       
        <Image source={{ uri: product.imageUrl }} style={styles.image} />

      
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {productBDD.nombre}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.moreButton}>
              <Icon name="more-vertical" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.price}>
            ${productBDD.precio.toFixed(2)} {product.currency}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {productBDD.descripcion}
          </Text>
        </View>
      </View>

     
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOption} onPress={handleView}>
            <Icon name="eye" size={20} style={styles.modalIcon} />
            <Text style={styles.modalOptionText}>
            <FormattedMessage id="viewModal" defaultMessage="View" />
            </Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
              <Icon name="edit" size={20} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>
                <FormattedMessage id="edit" defaultMessage="Edit" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={toggleAvailability}>
              <Icon name="archive" size={20} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>
                {localDisponible ? (
                  <FormattedMessage id="disable" defaultMessage="Disable" />
                ) : (
                  <FormattedMessage id="enable" defaultMessage="Enable" />
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
              <Icon name="trash-2" size={20} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>
                <FormattedMessage id="delete" defaultMessage="Delete" />
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default ProductCard

