import type React from "react"
import { View, Text, ScrollView, StyleSheet, Image, Dimensions } from "react-native"
import { FormattedMessage } from "react-intl"
import type { Product, MenuSettings } from "@/constants/menu.types"

const { width } = Dimensions.get("window")

interface MenuPreviewProps {
  groupedProducts: Record<string, Product[]>
  settings: MenuSettings
  colors: any
}

export const MenuPreview: React.FC<MenuPreviewProps> = ({ groupedProducts, settings, colors }) => {
  const getTemplateStyles = () => {
    const baseStyles = {
      container: {
        backgroundColor: colors.background,
        padding: 20,
        borderRadius: 16,
        margin: 16,
      },
      header: {
        alignItems: "center" as const,
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
      },
      restaurantName: {
        fontSize: 28,
        fontWeight: "bold" as const,
        color: settings.primaryColor,
        textAlign: "center" as const,
        marginBottom: 8,
      },
      categoryTitle: {
        fontSize: 22,
        fontWeight: "600" as const,
        color: settings.primaryColor,
        marginBottom: 16,
        marginTop: 24,
      },
      productContainer: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.card,
      },
      productName: {
        fontSize: 18,
        fontWeight: "600" as const,
        color: colors.text,
        marginBottom: 4,
      },
      productDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
        lineHeight: 20,
      },
      productPrice: {
        fontSize: 16,
        fontWeight: "bold" as const,
        color: settings.primaryColor,
      },
    }

    switch (settings.template) {
      case "classic":
        return {
          ...baseStyles,
          container: {
            ...baseStyles.container,
            backgroundColor: "#FEF7ED",
            borderWidth: 2,
            borderColor: "#D97706",
          },
          restaurantName: {
            ...baseStyles.restaurantName,
            fontFamily: "serif",
            color: "#92400E",
          },
          categoryTitle: {
            ...baseStyles.categoryTitle,
            fontFamily: "serif",
            color: "#92400E",
            borderBottomWidth: 1,
            borderBottomColor: "#D97706",
            paddingBottom: 8,
          },
        }

      case "minimalist":
        return {
          ...baseStyles,
          container: {
            ...baseStyles.container,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#E5E7EB",
          },
          restaurantName: {
            ...baseStyles.restaurantName,
            fontWeight: "300",
            fontSize: 24,
          },
          categoryTitle: {
            ...baseStyles.categoryTitle,
            fontWeight: "300",
            fontSize: 18,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
            paddingBottom: 4,
          },
        }

      case "elegant":
        return {
          ...baseStyles,
          container: {
            ...baseStyles.container,
            backgroundColor: "#F8FAFC",
            borderWidth: 1,
            borderColor: "#CBD5E1",
          },
          restaurantName: {
            ...baseStyles.restaurantName,
            fontSize: 26,
            letterSpacing: 2,
          },
          categoryTitle: {
            ...baseStyles.categoryTitle,
            fontSize: 20,
            letterSpacing: 1,
          },
        }

      default: // modern
        return baseStyles
    }
  }

  const styles = getTemplateStyles()
  const orderedCategories = settings.categoryOrder.filter((cat) => groupedProducts[cat])

  return (
    <ScrollView style={containerStyles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {settings.logoUrl && (
            <Image source={{ uri: settings.logoUrl }} style={containerStyles.logo} resizeMode="contain" />
          )}
          <Text style={styles.restaurantName}>{settings.restaurantName}</Text>
          <View style={[containerStyles.divider, { backgroundColor: settings.primaryColor }]} />
        </View>

        {/* Menu Content */}
        {orderedCategories.map((category) => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>

            {groupedProducts[category]
              .filter((product) => product.available)
              .map((product) => (
                <View key={product.id} style={styles.productContainer}>
                  <View style={containerStyles.productContent}>
                    {settings.showImages && (
                      <Image source={{ uri: product.image }} style={containerStyles.productImage} resizeMode="cover" />
                    )}

                    <View style={containerStyles.productInfo}>
                      <View style={containerStyles.productHeader}>
                        <Text style={styles.productName}>{product.name}</Text>
                        {settings.showPrices && <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>}
                      </View>

                      {settings.showDescriptions && product.description && (
                        <Text style={styles.productDescription}>{product.description}</Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
          </View>
        ))}

        {/* Footer */}
        <View style={containerStyles.footer}>
          <Text style={[containerStyles.footerText, { color: colors.textSecondary }]}>
            <FormattedMessage id="menuGeneratedAutomatically" defaultMessage="Menú generado automáticamente" />
            {" • "}
            {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  divider: {
    width: 60,
    height: 2,
    marginTop: 8,
  },
  productContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
})
