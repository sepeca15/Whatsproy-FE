"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from "react-native"
import * as Animatable from "react-native-animatable"
import Feather from "react-native-vector-icons/Feather"
import { FormattedMessage } from "react-intl"
import { ProductForm } from "./ProductForm"
import type { Product } from "@/constants/menu.types"

interface ProductManagerProps {
  products: Product[]
  setProducts: (products: Product[]) => void
  groupedProducts: Record<string, Product[]>
  colors: any
}

export const ProductManager: React.FC<ProductManagerProps> = ({ products, setProducts, groupedProducts, colors }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = (id: number) => {
    Alert.alert("Eliminar Producto", "¿Estás seguro de que quieres eliminar este producto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setProducts(products.filter((p) => p.id !== id))
        },
      },
    ])
  }

  const toggleProductAvailability = (id: number) => {
    const updatedProducts = products.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    setProducts(updatedProducts)
  }

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Editar producto existente
      const updatedProducts = products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
      setProducts(updatedProducts)
    } else {
      // Agregar nuevo producto
      const newProduct: Product = {
        id: Date.now(),
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || 0,
        category: productData.category || "",
        image: productData.image || "https://via.placeholder.com/300",
        available: productData.available ?? true,
      }
      setProducts([...products, newProduct])
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        categories={Object.keys(groupedProducts)}
        onSave={handleSaveProduct}
        onCancel={() => {
          setShowForm(false)
          setEditingProduct(null)
        }}
        colors={colors}
      />
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          <FormattedMessage id="productManagement" defaultMessage="Gestión de Productos" />
        </Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleAddProduct}>
          <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Products by Category */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedProducts).map(([category, categoryProducts], categoryIndex) => (
          <Animatable.View
            key={category}
            animation="fadeInUp"
            duration={600}
            delay={categoryIndex * 100}
            style={[styles.categoryCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.categoryHeader}>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>{category}</Text>
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{categoryProducts.length}</Text>
              </View>
            </View>

            {categoryProducts.map((product, productIndex) => (
              <Animatable.View
                key={product.id}
                animation="fadeInRight"
                duration={400}
                delay={productIndex * 50}
                style={[
                  styles.productCard,
                  {
                    backgroundColor: product.available ? colors.background : colors.cardDisabled,
                    opacity: product.available ? 1 : 0.7,
                  },
                ]}
              >
                <Image source={{ uri: product.image }} style={styles.productImage} />

                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
                  <Text style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {product.description}
                  </Text>
                  <Text style={[styles.productPrice, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>
                </View>

                <View style={styles.productActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => toggleProductAvailability(product.id)}>
                    <Feather
                      name={product.available ? "eye" : "eye-off"}
                      size={18}
                      color={product.available ? colors.success : colors.textSecondary}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton} onPress={() => handleEditProduct(product)}>
                    <Feather name="edit-2" size={18} color={colors.primary} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteProduct(product.id)}>
                    <Feather name="trash-2" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            ))}
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  categoryCard: {
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  productCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
})
