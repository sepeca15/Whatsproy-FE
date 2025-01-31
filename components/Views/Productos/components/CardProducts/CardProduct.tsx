import type React from "react"
import { useRef, useState } from "react"
import { View, Text, Image, TouchableOpacity, Animated, Modal, Pressable } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useRouter } from "expo-router"
import { styles } from "./CardProdStyle"
import type {
  Product,
  SatisfactionData,
  ProductBDD,
  CategoryData,
  SalesData,
  DayslySalesData,
  MonthlySalesData,
} from "../../../../../hooks/dataProduct"

interface ProductCardProps {
  product: Product
  productBDD: ProductBDD
  salesData: SalesData
  categoryData: CategoryData
  satisfactionData: SatisfactionData
  monthlySalesData: MonthlySalesData
  dayslySalesData: DayslySalesData
  onUpdateProduct: (updatedProduct: Product) => void
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
  const router = useRouter()
  const [isFlipped, setIsFlipped] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const flipAnim = useRef(new Animated.Value(0)).current

  const flipCard = () => {
    if (isFlipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsFlipped(false))
    } else {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsFlipped(true))
    }
  }

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  })

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  })

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  }

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  }

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
    })
  }

  const handleModify = () => {
    console.log("Modificar")
  }

  const handleDelete = () => {
    console.log("Eliminar")
  }

  return (
    <View style={styles.containerFatehr}>
      <Animated.View style={[styles.card, frontAnimatedStyle, { backfaceVisibility: "hidden" }]}>
        {product.category === "Vegetariana" && (
          <View style={styles.categoryLabel}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        )}
        <Pressable
          style={({ pressed }) => [styles.imageContainer, { opacity: pressed ? 0.8 : 1 }]}
          onLongPress={flipCard}
        >
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        </Pressable>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titlePriceContainer}>
              <Text style={styles.title} numberOfLines={1}>
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
        <Text style={styles.title}>aqui puede que pongamos algo</Text>
          <TouchableOpacity onPress={flipCard} style={[styles.cardBackButton, styles.flipBackButton]}>
            <View style={styles.buttonContent}>
              <Icon name="rotate-ccw" size={20} color="white" style={styles.backIcon} />
              <Text style={styles.cardBackButtonText}>Volver</Text>
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
              <Icon name="edit" size={20}  style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalOption, styles.archiveButton]}>
              <Icon name="archive" size={20} color={''} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Deshabilitar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalOption, styles.deleteButton]}>
              <Icon name="trash-2" size={20} color={''} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalOption, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Icon name="rotate-ccw" size={20} color={''} style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default ProductCard

