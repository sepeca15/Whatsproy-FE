"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, Share, ScrollView } from "react-native"
import { FormattedMessage } from "react-intl"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Feather from "react-native-vector-icons/Feather"
import * as Print from "expo-print"
import * as Sharing from "expo-sharing"
import type { Product, MenuSettings, ExportOptions } from "@/constants/menu.types"

interface ExportPanelProps {
  groupedProducts: Record<string, Product[]>
  settings: MenuSettings
  colors: any
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ groupedProducts, settings, colors }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "pdf",
    quality: "high",
    size: "A4",
  })

  const totalProducts = Object.values(groupedProducts).reduce((sum, products) => sum + products.length, 0)
  const availableProducts = Object.values(groupedProducts).reduce(
    (sum, products) => sum + products.filter((p) => p.available).length,
    0,
  )

  const exportFormats = [
    {
      id: "pdf",
      name: "PDF",
      description: "Ideal para impresión",
      icon: "file-pdf-box",
    },
    {
      id: "png",
      name: "PNG",
      description: "Imagen con transparencia",
      icon: "file-image",
    },
    {
      id: "jpeg",
      name: "JPEG",
      description: "Imagen optimizada",
      icon: "file-image",
    },
  ]

  const qualityOptions = [
    { id: "standard", name: "Estándar", description: "72 DPI" },
    { id: "high", name: "Alta", description: "150 DPI" },
    { id: "ultra", name: "Ultra", description: "300 DPI" },
  ]

  const generateMenuHTML = () => {
    const orderedCategories = settings.categoryOrder.filter((cat) => groupedProducts[cat])

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${settings.restaurantName} - Menú</title>
          <style>
            body {
              font-family: ${settings.fontFamily}, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #ffffff;
            }
            .menu-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid ${settings.primaryColor};
            }
            .restaurant-name {
              font-size: 32px;
              font-weight: bold;
              color: ${settings.primaryColor};
              margin-bottom: 10px;
            }
            .category-title {
              font-size: 24px;
              font-weight: 600;
              color: ${settings.primaryColor};
              margin: 30px 0 20px 0;
              padding-bottom: 10px;
              border-bottom: 1px solid ${settings.primaryColor};
            }
            .product {
              display: flex;
              align-items: flex-start;
              margin-bottom: 20px;
              padding: 16px;
              border-radius: 12px;
              background-color: #f8f9fa;
            }
            .product-image {
              width: 80px;
              height: 80px;
              border-radius: 12px;
              margin-right: 16px;
              object-fit: cover;
            }
            .product-info {
              flex: 1;
            }
            .product-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 8px;
            }
            .product-name {
              font-size: 18px;
              font-weight: 600;
              color: #333;
            }
            .product-price {
              font-size: 18px;
              font-weight: bold;
              color: ${settings.primaryColor};
            }
            .product-description {
              font-size: 14px;
              color: #666;
              line-height: 1.4;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="menu-container">
            <div class="header">
              ${settings.logoUrl ? `<img src="${settings.logoUrl}" alt="Logo" style="width: 80px; height: 80px; margin-bottom: 16px;">` : ""}
              <div class="restaurant-name">${settings.restaurantName}</div>
            </div>
            
            ${orderedCategories
              .map(
                (category) => `
              <div class="category-title">${category}</div>
              ${groupedProducts[category]
                .filter((product) => product.available)
                .map(
                  (product) => `
                  <div class="product">
                    ${settings.showImages ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : ""}
                    <div class="product-info">
                      <div class="product-header">
                        <div class="product-name">${product.name}</div>
                        ${settings.showPrices ? `<div class="product-price">$${product.price.toFixed(2)}</div>` : ""}
                      </div>
                      ${settings.showDescriptions && product.description ? `<div class="product-description">${product.description}</div>` : ""}
                    </div>
                  </div>
                `,
                )
                .join("")}
            `,
              )
              .join("")}
            
            <div class="footer">
              Menú generado automáticamente • ${new Date().toLocaleDateString()}
            </div>
          </div>
        </body>
      </html>
    `
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const html = generateMenuHTML()
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      })

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: `${settings.restaurantName} - Menú`,
        })
      }

      Alert.alert("Éxito", "Menú exportado como PDF exitosamente")
    } catch (error) {
      console.error("Error exporting PDF:", error)
      Alert.alert("Error", "No se pudo exportar el menú como PDF")
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Echa un vistazo al menú de ${settings.restaurantName}`,
        title: `Menú - ${settings.restaurantName}`,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handlePrint = async () => {
    try {
      const html = generateMenuHTML()
      await Print.printAsync({
        html,
      })
    } catch (error) {
      console.error("Error printing:", error)
      Alert.alert("Error", "No se pudo imprimir el menú")
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Statistics */}
      <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          <FormattedMessage id="menuSummary" defaultMessage="Resumen del Menú" />
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{Object.keys(groupedProducts).length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              <FormattedMessage id="categories" defaultMessage="Categorías" />
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#10B981" }]}>{availableProducts}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              <FormattedMessage id="available" defaultMessage="Disponibles" />
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.textSecondary }]}>{totalProducts}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              <FormattedMessage id="total" defaultMessage="Total" />
            </Text>
          </View>
        </View>
      </View>

      {/* Export Format */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          <FormattedMessage id="exportFormat" defaultMessage="Formato de Exportación" />
        </Text>

        <View style={styles.formatGrid}>
          {exportFormats.map((format) => (
            <TouchableOpacity
              key={format.id}
              style={[
                styles.formatCard,
                {
                  backgroundColor: exportOptions.format === format.id ? colors.primary : colors.background,
                  borderColor: exportOptions.format === format.id ? colors.primary : "transparent",
                },
              ]}
              onPress={() => setExportOptions({ ...exportOptions, format: format.id as any })}
            >
              <MaterialCommunityIcons
                name={format.icon as any}
                size={24}
                color={exportOptions.format === format.id ? "white" : colors.primary}
              />
              <Text
                style={[
                  styles.formatName,
                  {
                    color: exportOptions.format === format.id ? "white" : colors.text,
                  },
                ]}
              >
                {format.name}
              </Text>
              <Text
                style={[
                  styles.formatDescription,
                  {
                    color: exportOptions.format === format.id ? "rgba(255,255,255,0.8)" : colors.textSecondary,
                  },
                ]}
              >
                {format.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quality Settings */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          <FormattedMessage id="qualitySettings" defaultMessage="Configuración de Calidad" />
        </Text>

        <View style={styles.qualityList}>
          {qualityOptions.map((quality) => (
            <TouchableOpacity
              key={quality.id}
              style={[
                styles.qualityItem,
                {
                  backgroundColor: exportOptions.quality === quality.id ? colors.primary : "transparent",
                },
              ]}
              onPress={() => setExportOptions({ ...exportOptions, quality: quality.id as any })}
            >
              <View style={styles.qualityInfo}>
                <Text
                  style={[
                    styles.qualityName,
                    {
                      color: exportOptions.quality === quality.id ? "white" : colors.text,
                    },
                  ]}
                >
                  {quality.name}
                </Text>
                <Text
                  style={[
                    styles.qualityDescription,
                    {
                      color: exportOptions.quality === quality.id ? "rgba(255,255,255,0.8)" : colors.textSecondary,
                    },
                  ]}
                >
                  {quality.description}
                </Text>
              </View>
              {exportOptions.quality === quality.id && <Feather name="check" size={20} color="white" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Export Actions */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          <FormattedMessage id="exportActions" defaultMessage="Acciones de Exportación" />
        </Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleExportPDF}
            disabled={isExporting}
          >
            <MaterialCommunityIcons name="download" size={24} color="white" />
            <Text style={styles.actionButtonText}>{isExporting ? "Exportando..." : "Descargar PDF"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success || "#10B981" }]}
            onPress={handleShare}
          >
            <Feather name="share-2" size={24} color="white" />
            <Text style={styles.actionButtonText}>
              <FormattedMessage id="share" defaultMessage="Compartir" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.warning || "#F59E0B" }]}
            onPress={handlePrint}
          >
            <Feather name="printer" size={24} color="white" />
            <Text style={styles.actionButtonText}>
              <FormattedMessage id="print" defaultMessage="Imprimir" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tips */}
      <View style={[styles.tipsCard, { backgroundColor: colors.info || "#3B82F6" }]}>
        <MaterialCommunityIcons name="lightbulb" size={24} color="white" />
        <Text style={styles.tipsTitle}>
          <FormattedMessage id="exportTips" defaultMessage="Consejos para la exportación" />
        </Text>
        <Text style={styles.tipsText}>
          • Para impresión profesional, usa calidad Ultra{"\n"}• PDF mantiene la mejor calidad para compartir{"\n"}• PNG
          conserva transparencias para diseños{"\n"}• JPEG es más ligero para redes sociales
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  formatGrid: {
    flexDirection: "row",
    gap: 12,
  },
  formatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
  },
  formatName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
  },
  formatDescription: {
    fontSize: 12,
    textAlign: "center",
  },
  qualityList: {
    gap: 8,
  },
  qualityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
  },
  qualityInfo: {
    flex: 1,
  },
  qualityName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  qualityDescription: {
    fontSize: 14,
  },
  actionGrid: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  tipsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  tipsTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 12,
  },
  tipsText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
})
