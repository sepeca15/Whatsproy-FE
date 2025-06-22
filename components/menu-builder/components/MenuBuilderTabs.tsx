"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { ProductManager } from "./ProductManager"
import { MenuPreview } from "./MenuPreview"
import { CustomizationPanel } from "./CustomizationPanel"
import { ExportPanel } from "./ExportPanel"
import type { Product, MenuSettings } from "@/constants/menu.types"
import {Colors} from "@/constants/Colors"
const { width } = Dimensions.get("window")

interface MenuBuilderTabsProps {
  products: Product[]
  setProducts: (products: Product[]) => void
  groupedProducts: Record<string, Product[]>
  settings: MenuSettings
  setSettings: (settings: MenuSettings) => void
  colors: any
}

const tabs = [
  { id: "products", name: "Productos", icon: "food" },
  { id: "preview", name: "Vista Previa", icon: "eye" },
  { id: "customize", name: "Personalizar", icon: "palette" },
  { id: "export", name: "Exportar", icon: "download" },
]

export const MenuBuilderTabs: React.FC<MenuBuilderTabsProps> = ({
  products,
  setProducts,
  groupedProducts,
  settings,
  setSettings,
  colors,
}) => {
  const [activeTab, setActiveTab] = useState("products")
  const indicatorPosition = useSharedValue(0)

  const handleTabPress = (tabId: string, index: number) => {
    setActiveTab(tabId)
    indicatorPosition.value = withTiming(index * (width / tabs.length), {
      duration: 300,
    })
  }

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
    }
  })

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <ProductManager
            products={products}
            setProducts={setProducts}
            groupedProducts={groupedProducts}
            colors={colors}
          />
        )
      case "preview":
        return <MenuPreview groupedProducts={groupedProducts} settings={settings} colors={colors} />
      case "customize":
        return (
          <CustomizationPanel
            settings={settings}
            setSettings={setSettings}
            categories={Object.keys(groupedProducts)}
            colors={colors}
          />
        )
      case "export":
        return <ExportPanel groupedProducts={groupedProducts} settings={settings} colors={colors} />
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.card }]}>
        <Animated.View style={[styles.indicator, { backgroundColor: colors.primary }, indicatorStyle]} />
        {tabs.map((tab, index) => (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => handleTabPress(tab.id, index)}>
            <MaterialCommunityIcons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.id ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab.id ? colors.primary : colors.textSecondary,
                },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 4,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  indicator: {
    position: "absolute",
    top: 4,
    left: 4,
    width: width / tabs.length - 8,
    height: "100%",
    borderRadius: 12,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    zIndex: 1,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
})
