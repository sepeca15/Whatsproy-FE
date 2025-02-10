"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { View, ScrollView, TouchableOpacity, Text, TextInput, Animated } from "react-native"
import { ProductCard } from "./components/CardProducts/CardProduct"
import ProductCardSkeleton from "./components/ProductCardSkeleton"
import {
  sampleProducts,
  type ProductBDD,
  salesData,
  categoryData,
  satisfactionData,
  monthlySalesData,
  dayslySalesData,
} from "../../../hooks/dataProduct"
import { useRouter } from "expo-router"
import Icon from "react-native-vector-icons/FontAwesome"
import { styles } from "./ProductosStyles"
import api from "@/services/api/admin"
import { useLocalization } from "@/app/LocalizationContext"
import { useIntl } from "react-intl"

const Productos: React.FC = () => {
  const router = useRouter()
  const [ProductsBD, setProducts] = useState<ProductBDD[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const fadeAnim = useState(new Animated.Value(0))[0]
  const { locale } = useLocalization()
  const intl = useIntl()

  const allProduct = useCallback(
    async (isInitial = false) => {
      if (isInitial) {
        setIsInitialLoading(true)
      } else {
        setIsUpdating(true)
      }
      try {
        const response = await api.products.getAll()
        const productData: ProductBDD[] = response.data
        setProducts(productData)
        console.log("productData", productData)
      } catch (error) {
        console.error(error)
      } finally {
        if (isInitial) {
          setIsInitialLoading(false)
        } else {
          setIsUpdating(false)
        }
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start()
      }
    },
    [fadeAnim],
  )

  useEffect(() => {
    allProduct(true)
  }, [allProduct])

  const handleUpdateProduct = useCallback(() => {
    allProduct(false)
  }, [allProduct])

  const filteredProducts = ProductsBD.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  ).sort((a, b) => a.nombre.localeCompare(b.nombre, locale))

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder={intl.formatMessage({ id: "searchPlaceholder", defaultMessage: "Search by name" })}
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
        {isInitialLoading ? (
          Array.from({ length: 5 }).map((_, index) => <ProductCardSkeleton key={index} />)
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
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>
      {/* {isUpdating && (
        <View style={styles.updatingOverlay}>
          <Text>Updating...</Text>
        </View>
      )} */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            router.push("/(tabs)/addpro")
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Productos

