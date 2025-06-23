"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch } from "react-native"
import { FormattedMessage } from "react-intl"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import type { MenuSettings } from "@/constants/menu.types"

interface CustomizationPanelProps {
  settings: MenuSettings
  setSettings: (settings: MenuSettings) => void
  categories: string[]
  colors: any
}

const templates = [
  { id: "classic", name: "Clásico", description: "Estilo tradicional" },
  { id: "modern", name: "Moderno", description: "Diseño contemporáneo" },
  { id: "minimalist", name: "Minimalista", description: "Simplicidad elegante" },
  { id: "elegant", name: "Elegante", description: "Sofisticado y refinado" },
]

const predefinedColors = [
  { name: "Azul", primary: "#2563eb", secondary: "#64748b" },
  { name: "Verde", primary: "#059669", secondary: "#6b7280" },
  { name: "Rojo", primary: "#dc2626", secondary: "#6b7280" },
  { name: "Púrpura", primary: "#7c3aed", secondary: "#6b7280" },
  { name: "Naranja", primary: "#ea580c", secondary: "#6b7280" },
  { name: "Dorado", primary: "#d97706", secondary: "#78716c" },
]

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  settings,
  setSettings,
  categories,
  colors,
}) => {
  const [activeSection, setActiveSection] = useState<string>("template")

  const sections = [
    { id: "template", name: "Plantilla", icon: "palette" },
    { id: "display", name: "Visualización", icon: "eye" },
    { id: "branding", name: "Marca", icon: "store" },
    { id: "colors", name: "Colores", icon: "format-color-fill" },
  ]

  const renderTemplateSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        <FormattedMessage id="designTemplate" defaultMessage="Plantilla de Diseño" />
      </Text>
      <View style={styles.templateGrid}>
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              {
                backgroundColor: colors.card,
                borderColor: settings.template === template.id ? colors.primary : "transparent",
                borderWidth: 2,
              },
            ]}
            onPress={() => setSettings({ ...settings, template: template.id as any })}
          >
            <Text style={[styles.templateName, { color: colors.text }]}>{template.name}</Text>
            <Text style={[styles.templateDescription, { color: colors.textSecondary }]}>{template.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderDisplaySection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        <FormattedMessage id="displayOptions" defaultMessage="Opciones de Visualización" />
      </Text>

      <View style={styles.switchContainer}>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            <FormattedMessage id="showPrices" defaultMessage="Mostrar precios" />
          </Text>
          <Switch
            value={settings.showPrices}
            onValueChange={(value) => setSettings({ ...settings, showPrices: value })}
            trackColor={{ false: colors.textSecondary, true: colors.primary }}
            thumbColor={settings.showPrices ? colors.primary : colors.textSecondary}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            <FormattedMessage id="showDescriptions" defaultMessage="Mostrar descripciones" />
          </Text>
          <Switch
            value={settings.showDescriptions}
            onValueChange={(value) => setSettings({ ...settings, showDescriptions: value })}
            trackColor={{ false: colors.textSecondary, true: colors.primary }}
            thumbColor={settings.showDescriptions ? colors.primary : colors.textSecondary}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            <FormattedMessage id="showImages" defaultMessage="Mostrar imágenes" />
          </Text>
          <Switch
            value={settings.showImages}
            onValueChange={(value) => setSettings({ ...settings, showImages: value })}
            trackColor={{ false: colors.textSecondary, true: colors.primary }}
            thumbColor={settings.showImages ? colors.primary : colors.textSecondary}
          />
        </View>
      </View>
    </View>
  )

  const renderBrandingSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        <FormattedMessage id="restaurantInfo" defaultMessage="Información del Restaurante" />
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          <FormattedMessage id="restaurantName" defaultMessage="Nombre del restaurante" />
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          value={settings.restaurantName}
          onChangeText={(text) => setSettings({ ...settings, restaurantName: text })}
          placeholder="Mi Restaurante"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          <FormattedMessage id="logoUrl" defaultMessage="URL del logo" />
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          value={settings.logoUrl}
          onChangeText={(text) => setSettings({ ...settings, logoUrl: text })}
          placeholder="https://ejemplo.com/logo.png"
          placeholderTextColor={colors.textSecondary}
        />
      </View>
    </View>
  )

  const renderColorsSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        <FormattedMessage id="colorsAndTypography" defaultMessage="Colores y Tipografía" />
      </Text>

      <Text style={[styles.subsectionTitle, { color: colors.text }]}>
        <FormattedMessage id="predefinedPalettes" defaultMessage="Paletas predefinidas" />
      </Text>
      <View style={styles.colorGrid}>
        {predefinedColors.map((colorSet) => (
          <TouchableOpacity
            key={colorSet.name}
            style={[styles.colorCard, { backgroundColor: colors.card }]}
            onPress={() =>
              setSettings({
                ...settings,
                primaryColor: colorSet.primary,
                secondaryColor: colorSet.secondary,
              })
            }
          >
            <View style={styles.colorPreview}>
              <View style={[styles.colorCircle, { backgroundColor: colorSet.primary }]} />
              <View style={[styles.colorCircle, { backgroundColor: colorSet.secondary }]} />
            </View>
            <Text style={[styles.colorName, { color: colors.text }]}>{colorSet.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "template":
        return renderTemplateSection()
      case "display":
        return renderDisplaySection()
      case "branding":
        return renderBrandingSection()
      case "colors":
        return renderColorsSection()
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      {/* Section Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.tab,
              {
                backgroundColor: activeSection === section.id ? colors.primary : colors.card,
              },
            ]}
            onPress={() => setActiveSection(section.id)}
          >
            <MaterialCommunityIcons
              name={section.icon as any}
              size={20}
              color={activeSection === section.id ? "white" : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeSection === section.id ? "white" : colors.textSecondary,
                },
              ]}
            >
              {section.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  templateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  templateCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  templateName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 12,
    textAlign: "center",
  },
  switchContainer: {
    gap: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
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
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorCard: {
    flex: 1,
    minWidth: "30%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  colorPreview: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  colorName: {
    fontSize: 12,
    fontWeight: "600",
  },
})
