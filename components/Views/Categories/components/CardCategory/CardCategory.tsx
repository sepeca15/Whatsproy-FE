import type React from "react"
import { View, Text, TouchableOpacity, Pressable } from "react-native"
import { Image } from "native-base"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown } from "react-native-reanimated"
import { FormattedMessage } from "react-intl"
import { Colors } from "@/constants/Colors"
import { styles } from "./CardCategoryStyles"

export interface ICategoryData {
  createdAt: Date
  description: string
  name: string
  id: number
  productosCount?: number
  producto?: any[]
  image: string
}

interface ICardCategory {
  data: ICategoryData
  onPress: () => void
  handleDeleteCategory: (category: ICategoryData) => void
  index?: number
}

const CardCategory: React.FC<ICardCategory> = ({ data, onPress, handleDeleteCategory, index = 0 }) => {
  return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
        <LinearGradient colors={["#ffffff", "#f8fafc"]} style={styles.gradient}>
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDeleteCategory(data)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <LinearGradient
              colors={[Colors.light.danger, Colors.light.danger + "DD"]}
              style={styles.deleteButtonGradient}
            >
              <MaterialIcons name="close" size={14} color="white" />
            </LinearGradient>
          </Pressable>

          <View style={styles.imageContainer}>
            {data.image ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: data.image }}
                  alt={data.name}
                  style={styles.categoryImage}
                  fallbackSource={{ uri: "https://via.placeholder.com/50x50/e2e8f0/64748b?text=?" }}
                />
                <View style={styles.imageOverlay} />
              </View>
            ) : (
              <View style={styles.defaultIconContainer}>
                <LinearGradient
                  colors={[Colors.light.primary + "25", Colors.light.primary + "15"]}
                  style={styles.iconBackground}
                >
                  <MaterialIcons name="restaurant" size={24} color={Colors.light.primary} />
                </LinearGradient>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.categoryName} numberOfLines={2}>
              {data.name || <FormattedMessage id="categories.card.noName" defaultMessage="Sin nombre" />}
            </Text>

            {data.productosCount !== undefined && (
              <View style={styles.productCountContainer}>
                <View style={styles.productCountBadge}>
                  <Ionicons name="cube-outline" size={10} color={Colors.light.primary} />
                  <Text style={styles.productCount}>
                    {data.productosCount}{" "}
                    <FormattedMessage
                      id={data.productosCount === 1 ? "categories.card.product" : "categories.card.products"}
                      defaultMessage={data.productosCount === 1 ? "producto" : "productos"}
                    />
                  </Text>
                </View>
              </View>
            )}

            {data.description && (
              <Text style={styles.categoryDescription} numberOfLines={1}>
                {data.description}
              </Text>
            )}
          </View>

          <View style={styles.editIndicator}>
            <LinearGradient
              colors={[Colors.light.primary + "25", Colors.light.primary + "15"]}
              style={styles.editIndicatorGradient}
            >
              <MaterialIcons name="edit" size={10} color={Colors.light.primary} />
            </LinearGradient>
          </View>

          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: Colors.light.success }]} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
  )
}

export default CardCategory
