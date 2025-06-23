"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { useColorScheme } from "react-native"
import { FormattedMessage, useIntl } from "react-intl"
import Animated, { FadeInDown } from "react-native-reanimated"
import * as Animatable from "react-native-animatable"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Feather from "react-native-vector-icons/Feather"
import { Colors } from "@/constants/Colors"
import { MenuBuilderTabs } from "@/components/menu-builder/components/MenuBuilderTabs"
import type { Product, MenuSettings } from "@/constants/menu.types"

const { width } = Dimensions.get("window")

// Mock data - reemplaza con tu integración de base de datos
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Café Americano",
    description: "Café negro tradicional con notas intensas",
    price: 2.5,
    category: "Bebidas Calientes",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
    available: true,
  },
  {
    id: 2,
    name: "Cappuccino",
    description: "Espresso con leche vaporizada y espuma cremosa",
    price: 3.75,
    category: "Bebidas Calientes",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300",
    available: true,
  },
  {
    id: 3,
    name: "Hamburguesa Clásica",
    description: "Carne de res, lechuga, tomate, cebolla y salsa especial",
    price: 12.99,
    category: "Comidas",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
    available: true,
  },
  {
    id: 4,
    name: "Pizza Margherita",
    description: "Salsa de tomate, mozzarella fresca y albahaca",
    price: 15.5,
    category: "Comidas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300",
    available: true,
  },
  {
    id: 5,
    name: "Tiramisu",
    description: "Postre italiano con café, mascarpone y cacao",
    price: 6.25,
    category: "Postres",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300",
    available: true,
  },
  {
    id: 6,
    name: "Limonada Natural",
    description: "Refrescante bebida de limón natural",
    price: 2.25,
    category: "Bebidas Frías",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300",
    available: true,
  },
]

const MenuBuilder: React.FC = () => {
  const intl = useIntl()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = isDark ? Colors.dark : Colors.light

  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [settings, setSettings] = useState<MenuSettings>({
    template: "modern",
    showPrices: true,
    showDescriptions: true,
    showImages: true,
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    fontFamily: "System",
    logoUrl: "",
    restaurantName: "Mi Restaurante",
    categoryOrder: ["Bebidas Calientes", "Bebidas Frías", "Comidas", "Postres"],
    columns: 1,
  })

  // Agrupar productos por categoría
  const groupedProducts = products.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = []
      }
      acc[product.category].push(product)
      return acc
    },
    {} as Record<string, Product[]>,
  )

  // Simulación de actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Aquí se conectaría con listeners de base de datos en tiempo real
      console.log("Verificando actualizaciones de productos...")
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  const totalProducts = products.length
  const availableProducts = products.filter((p) => p.available).length
  const totalCategories = Object.keys(groupedProducts).length

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600)} style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            <FormattedMessage id="dynamicMenu" defaultMessage="Constructor de Menú" />
          </Text>
          <View style={styles.headerRight} />
        </View>
        <Text style={styles.headerSubtitle}>
          <FormattedMessage id="menuBuilderSubtitle" defaultMessage="Crea y personaliza tu menú dinámico" />
        </Text>
      </Animated.View>

      {/* Stats Cards */}
      <Animatable.View animation="fadeInUp" duration={800} delay={200}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
          contentContainerStyle={styles.statsContent}
        >
          <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
            <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#3B82F6" />
            <Text style={[styles.statNumber, { color: colors.text }]}>{totalCategories}</Text>
            <Text style={[styles.statLabel, { color: colors.secondary }]}>
              <FormattedMessage id="categories" defaultMessage="Categorías" />
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
            <Text style={[styles.statNumber, { color: colors.text }]}>{availableProducts}</Text>
            <Text style={[styles.statLabel, { color: colors.secondary }]}>
              <FormattedMessage id="available" defaultMessage="Disponibles" />
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
            <MaterialCommunityIcons name="food" size={24} color="#F59E0B" />
            <Text style={[styles.statNumber, { color: colors.text }]}>{totalProducts}</Text>
            <Text style={[styles.statLabel, { color: colors.secondary }]}>
              <FormattedMessage id="totalProducts" defaultMessage="Total" />
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
            <MaterialCommunityIcons name="palette" size={24} color="#8B5CF6" />
            <Text style={[styles.statNumber, { color: colors.text }]}>{settings.template}</Text>
            <Text style={[styles.statLabel, { color: colors.secondary }]}>
              <FormattedMessage id="template" defaultMessage="Plantilla" />
            </Text>
          </View>
        </ScrollView>
      </Animatable.View>

      {/* Main Content */}
      <MenuBuilderTabs
        products={products}
        setProducts={setProducts}
        groupedProducts={groupedProducts}
        settings={settings}
        setSettings={setSettings}
        colors={colors}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 4,
  },
  statsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  statsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: width * 0.28,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
})

export default MenuBuilder
