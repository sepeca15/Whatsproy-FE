"use client"

import type React from "react"
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { FormattedMessage, useIntl } from "react-intl"
import { styles } from "./ProductPreviewCardStyles"
import { Colors } from "@/constants/Colors"

interface DetectedProductData {
  categoryIds: number[] | null
  currency_id: number
  descripcion: string
  diaSemana: number
  disponible: boolean
  imagen: string
  isMenuDiario: boolean
  nombre: string
  orderMenuDiario: boolean
  plazoDuracionEstimadoMinutos: number
  precio: number
  confidence?: number // Campo adicional para la confianza de detección
}

interface ProductPreviewProps {
  product: DetectedProductData
  isSelected: boolean
  onToggleSelection: () => void
  onChange: (field: keyof DetectedProductData, value: any) => void
}

const ProductPreviewCard: React.FC<ProductPreviewProps> = ({ product, isSelected, onToggleSelection, onChange }) => {
  const intl = useIntl()

  return (
    <View style={[styles.productCard, !isSelected && styles.productCardDisabled]}>
      <View style={styles.productHeader}>
        <TouchableOpacity style={styles.checkboxContainer} onPress={onToggleSelection}>
          <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
            {isSelected && <Icon name="check" size={12} color="#fff" />}
          </View>
        </TouchableOpacity>

        <View style={styles.productInfo}>
          <TextInput allowFontScaling={false}
            style={[styles.productName, !isSelected && styles.productNameDisabled]}
            value={product.nombre}
            onChangeText={(text) => onChange("nombre", text)}
            placeholder="Nombre del producto"
            editable={isSelected}
          />

          <View style={styles.badgeContainer}>
            {product.isMenuDiario && (
              <View style={styles.menuBadge}>
                <Icon name="calendar" size={10} color={Colors.light.primary} />
                <Text allowFontScaling={false} style={styles.menuBadgeText}>
                  <FormattedMessage id="dailyMenu" defaultMessage="Menú Diario" />
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {isSelected && (
        <View style={styles.productDetails}>
          <View style={styles.detailRow}>
            <Text allowFontScaling={false} style={styles.detailLabel}>
              <FormattedMessage id="description" defaultMessage="Descripción" />
            </Text>
            <TextInput allowFontScaling={false}
              style={styles.detailInput}
              value={product.descripcion}
              onChangeText={(text) => onChange("descripcion", text)}
              placeholder={intl.formatMessage({
                id: "descriptionPlaceholder",
                defaultMessage: "Descripción del producto...",
              })}
              multiline
            />
          </View>

          <View style={styles.detailRowHorizontal}>
            <View style={styles.halfWidth}>
              <Text allowFontScaling={false} style={styles.detailLabel}>
                <FormattedMessage id="price" defaultMessage="Precio" />
              </Text>
              <TextInput allowFontScaling={false}
                style={styles.priceInput}
                value={product.precio?.toString() || ""}
                onChangeText={(text) => onChange("precio", Number.parseFloat(text) || 0)}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.halfWidth}>
              <Text allowFontScaling={false} style={styles.detailLabel}>
                <FormattedMessage id="preparationTime" defaultMessage="Tiempo de preparación" />
              </Text>
              <View style={styles.timeInputContainer}>
                <TextInput allowFontScaling={false}
                  style={styles.timeInput}
                  value={product.plazoDuracionEstimadoMinutos?.toString() || ""}
                  onChangeText={(text) => onChange("plazoDuracionEstimadoMinutos", Number.parseInt(text) || 0)}
                  placeholder="20"
                  keyboardType="numeric"
                />
                <Text allowFontScaling={false} style={styles.timeUnit}>min</Text>
              </View>
            </View>
          </View>

          <View style={styles.configSection}>
            <Text allowFontScaling={false} style={styles.configSectionTitle}>
              <FormattedMessage id="additionalSettings" defaultMessage="Configuraciones adicionales" />
            </Text>

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Icon name="eye" size={16} color={Colors.light.text} />
                <Text allowFontScaling={false} style={styles.switchLabel}>
                  <FormattedMessage id="available" defaultMessage="Disponible" />
                </Text>
              </View>
              <Switch
                value={product.disponible}
                onValueChange={(value) => onChange("disponible", value)}
                trackColor={{ false: "#d1d5db", true: Colors.light.primary }}
                thumbColor={product.disponible ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Icon name="calendar" size={16} color={Colors.light.text} />
                <Text allowFontScaling={false} style={styles.switchLabel}>
                  <FormattedMessage id="isDailyMenu" defaultMessage="Es menú diario" />
                </Text>
              </View>
              <Switch
                value={product.isMenuDiario}
                onValueChange={(value) => onChange("isMenuDiario", value)}
                trackColor={{ false: "#d1d5db", true: Colors.light.primary }}
                thumbColor={product.isMenuDiario ? "#fff" : "#f4f3f4"}
              />
            </View>

            {product.isMenuDiario && (
              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Icon name="shopping-cart" size={16} color={Colors.light.text} />
                  <Text allowFontScaling={false} style={styles.switchLabel}>
                    <FormattedMessage id="allowDailyMenuOrder" defaultMessage="Permitir orden en menú diario" />
                  </Text>
                </View>
                <Switch
                  value={product.orderMenuDiario}
                  onValueChange={(value) => onChange("orderMenuDiario", value)}
                  trackColor={{ false: "#d1d5db", true: Colors.light.primary }}
                  thumbColor={product.orderMenuDiario ? "#fff" : "#f4f3f4"}
                />
              </View>
            )}

            {product.isMenuDiario && (
              <View style={styles.detailRow}>
                <Text allowFontScaling={false} style={styles.detailLabel}>
                  <FormattedMessage id="dayOfWeek" defaultMessage="Día de la semana" />
                </Text>
                <View style={styles.daySelector}>
                  {[
                    { value: 0, label: "Dom" },
                    { value: 1, label: "Lun" },
                    { value: 2, label: "Mar" },
                    { value: 3, label: "Mié" },
                    { value: 4, label: "Jue" },
                    { value: 5, label: "Vie" },
                    { value: 6, label: "Sáb" },
                  ].map((day) => (
                    <TouchableOpacity
                      key={day.value}
                      style={[styles.dayButton, product.diaSemana === day.value && styles.dayButtonSelected]}
                      onPress={() => onChange("diaSemana", day.value)}
                    >
                      <Text allowFontScaling={false}
                        style={[styles.dayButtonText, product.diaSemana === day.value && styles.dayButtonTextSelected]}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

export default ProductPreviewCard
export type { DetectedProductData }
