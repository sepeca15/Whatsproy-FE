"use client"

import * as React from "react"
import { Text, View, TouchableOpacity } from "react-native"
import { Image } from "native-base"
import { FormattedMessage } from "react-intl"
import type { IProductoInfo } from "../../OrderDetailsTypes"
import { styles } from "./ProductOrderCardStyles."
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Colors } from "@/constants/Colors"

interface IProductOrderCard {
  data: IProductoInfo
  cantidad: number
}

const ProductOrderCard = ({ data, cantidad }: IProductOrderCard) => {
  const [expanded, setExpanded] = React.useState(false)

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.imageContainer}>
          {data?.imagen ? (
            <Image
              alt={`Imagen de ${data.nombre}`}
              source={{ uri: data.imagen }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialIcons name="image-not-supported" size={24} color={Colors.light.icon} />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={expanded ? undefined : 1}>
            {data.nombre}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.unitPrice}>
              ${data.precio} <Text style={styles.unitLabel}>/ unidad</Text>
            </Text>
            <Text style={styles.quantity}>x{cantidad}</Text>
          </View>

          {expanded && data.descripcion && <Text style={styles.description}>{data.descripcion}</Text>}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
          <Text style={styles.expandButtonText}>
            {expanded ? (
              <FormattedMessage id="showLess" defaultMessage="Mostrar menos" />
            ) : (
              <FormattedMessage id="showMore" defaultMessage="Mostrar más" />
            )}
          </Text>
          <MaterialIcons
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={16}
            color={Colors.light.primary}
          />
        </TouchableOpacity>

        <Text style={styles.totalPrice}>${(cantidad * data.precio).toFixed(2)}</Text>
      </View>
    </View>
  )
}

export default ProductOrderCard
