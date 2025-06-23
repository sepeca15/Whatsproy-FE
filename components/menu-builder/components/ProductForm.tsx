"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from "react-native"
import { FormattedMessage } from "react-intl"
import Feather from "react-native-vector-icons/Feather"
import type { Product } from "@/constants/menu.types"

interface ProductFormProps {
  product: Product | null
  categories: string[]
  onSave: (product: Partial<Product>) => void
  onCancel: () => void
  colors: any
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onSave, onCancel, colors }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category: product?.category || categories[0] || "",
    image: product?.image || "",
    available: product?.available ?? true,
  })

  const [showCategoryPicker, setShowCategoryPicker] = useState(false)

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "El nombre del producto es requerido")
      return
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      Alert.alert("Error", "El precio debe ser un número válido")
      return
    }

    if (!formData.category) {
      Alert.alert("Error", "La categoría es requerida")
      return
    }

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category,
      image: formData.image || "https://via.placeholder.com/300",
      available: formData.available,
    })
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{product ? "Editar Producto" : "Nuevo Producto"}</Text>
        <TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Nombre */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>
            <FormattedMessage id="productName" defaultMessage="Nombre del Producto" />
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Ej: Café Americano"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Descripción */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>
            <FormattedMessage id="description" defaultMessage="Descripción" />
          </Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Descripción del producto..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Precio */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>
            <FormattedMessage id="price" defaultMessage="Precio" />
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        {/* Categoría */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>
            <FormattedMessage id="category" defaultMessage="Categoría" />
          </Text>
          <TouchableOpacity
            style={[styles.picker, { backgroundColor: colors.card }]}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={[styles.pickerText, { color: colors.text }]}>
              {formData.category || "Seleccionar categoría"}
            </Text>
            <Feather name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {showCategoryPicker && (
            <View style={[styles.categoryList, { backgroundColor: colors.card }]}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryItem}
                  onPress={() => {
                    setFormData({ ...formData, category })
                    setShowCategoryPicker(false)
                  }}
                >
                  <Text style={[styles.categoryText, { color: colors.text }]}>{category}</Text>
                  {formData.category === category && <Feather name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* URL de Imagen */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>
            <FormattedMessage id="imageUrl" defaultMessage="URL de Imagen" />
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={formData.image}
            onChangeText={(text) => setFormData({ ...formData, image: text })}
            placeholder="https://ejemplo.com/imagen.jpg"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Disponibilidad */}
        <View style={styles.switchField}>
          <Text style={[styles.label, { color: colors.text }]}>
            <FormattedMessage id="available" defaultMessage="Producto disponible" />
          </Text>
          <Switch
            value={formData.available}
            onValueChange={(value) => setFormData({ ...formData, available: value })}
            trackColor={{ false: colors.textSecondary, true: colors.primary }}
            thumbColor={formData.available ? colors.primary : colors.textSecondary}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  textArea: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    minHeight: 80,
    textAlignVertical: "top",
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  pickerText: {
    fontSize: 16,
  },
  categoryList: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    maxHeight: 200,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  categoryText: {
    fontSize: 16,
  },
  switchField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
})
