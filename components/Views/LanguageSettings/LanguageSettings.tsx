"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, Alert, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { FormattedMessage, useIntl } from "react-intl"
import { useColorScheme } from "react-native"
import { Colors } from "@/constants/Colors"
import Animated from "react-native-reanimated"
import * as Animatable from "react-native-animatable"
import Feather from "react-native-vector-icons/Feather"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useLocalization } from "../../../app/LocalizationContext" // Usa tu contexto existente

const primaryColor = "#075e54"
const secondaryColor = "#128c7e"

interface Language {
  code: "en" | "es" | "pt"
  name: string
  nativeName: string
  flag: string
  region: string
}

const LanguageSettings = () => {
  const intl = useIntl()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = isDark ? Colors.dark : Colors.light

  const { locale, setLocale } = useLocalization()
  const [isLoading, setIsLoading] = useState(false)
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(true)

  // Lista de idiomas disponibles (basada en tu sistema actual)
  const availableLanguages: Language[] = [
    {
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      flag: "🇪🇸",
      region: "Español",
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      region: "English",
    },
    {
      code: "pt",
      name: "Portuguese",
      nativeName: "Português",
      flag: "🇵🇹",
      region: "Português",
    },
  ]

  useEffect(() => {
    loadLanguageSettings()
  }, [])

  const loadLanguageSettings = async () => {
    try {
      const autoDetect = await AsyncStorage.getItem("auto_detect_language")
      setAutoDetectEnabled(autoDetect !== "false")
    } catch (error) {
      console.error("Error loading language settings:", error)
    }
  }

  const handleLanguageChange = async (languageCode: "en" | "es" | "pt") => {
    setIsLoading(true)

    try {
      // Usar el setLocale de tu contexto existente
      await setLocale(languageCode)

      // Marcar que se seleccionó manualmente
      await AsyncStorage.setItem("manual_language_override", languageCode)
      await AsyncStorage.setItem("auto_detect_language", "false")

      setAutoDetectEnabled(false)

      // Mostrar confirmación
      Alert.alert(
        intl.formatMessage({
          id: "languageChanged",
          defaultMessage: "Idioma cambiado",
        }),
        intl.formatMessage({
          id: "languageChangedDesc",
          defaultMessage: "El idioma se ha cambiado correctamente.",
        }),
        [
          {
            text: intl.formatMessage({
              id: "ok",
              defaultMessage: "OK",
            }),
            onPress: () => {
              router.back()
            },
          },
        ],
      )
    } catch (error) {
      console.error("Error saving language:", error)
      Alert.alert(
        intl.formatMessage({
          id: "error",
          defaultMessage: "Error",
        }),
        intl.formatMessage({
          id: "languageChangeError",
          defaultMessage: "No se pudo cambiar el idioma. Inténtalo de nuevo.",
        }),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutoDetectToggle = async () => {
    try {
      const newAutoDetectState = !autoDetectEnabled
      await AsyncStorage.setItem("auto_detect_language", newAutoDetectState.toString())
      setAutoDetectEnabled(newAutoDetectState)

      if (newAutoDetectState) {
        // Si se activa la detección automática, limpiar la selección manual
        await AsyncStorage.removeItem("manual_language_override")

        // Detectar idioma del sistema y aplicarlo usando tu lógica existente
        const sysLocale = Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0]
        const detectedLocale = ["en", "es", "pt"].includes(sysLocale) ? (sysLocale as "en" | "es" | "pt") : "en"

        await setLocale(detectedLocale)

        Alert.alert(
          intl.formatMessage({
            id: "autoDetectEnabled",
            defaultMessage: "Detección automática activada",
          }),
          intl.formatMessage({
            id: "autoDetectEnabledDesc",
            defaultMessage: "El idioma se detectará automáticamente según la configuración de tu dispositivo.",
          }),
        )
      }
    } catch (error) {
      console.error("Error toggling auto detect:", error)
    }
  }

  const renderLanguageItem = ({ item, index }: { item: Language; index: number }) => {
    const isSelected = locale === item.code

    return (
      <Animatable.View animation="fadeInUp" duration={600} delay={100 + index * 50}>
        <TouchableOpacity
          style={[
            styles.languageItem,
            {
              backgroundColor: isDark ? "#1e1e1e" : "#fff",
              borderColor: isSelected ? colors.primary : "transparent",
            },
            isSelected && styles.selectedLanguageItem,
          ]}
          onPress={() => handleLanguageChange(item.code)}
          activeOpacity={0.7}
          disabled={isLoading || autoDetectEnabled}
        >
          <View style={[styles.languageContent, { opacity: autoDetectEnabled ? 0.6 : 1 }]}>
            <Text style={styles.flagEmoji}>{item.flag}</Text>
            <View style={styles.languageInfo}>
              <Text style={[styles.languageName, { color: colors.text }]}>{item.nativeName}</Text>
              <Text style={[styles.languageRegion, { color: colors.icon }]}>
                {item.name} • {item.region}
              </Text>
            </View>
            <View style={styles.languageActions}>
              {isSelected && (
                <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                  <Feather name="check" size={16} color="white" />
                </View>
              )}
              {isLoading && locale === item.code && <ActivityIndicator size="small" color={colors.primary} />}
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            <FormattedMessage id="languageSettings" defaultMessage="Configuración de Idioma" />
          </Text>
        </View>
      </Animated.View>

      <FlatList
        data={availableLanguages}
        keyExtractor={(item) => item.code}
        renderItem={renderLanguageItem}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            {/* Current Language Display */}
            <Animatable.View
              animation="fadeInDown"
              duration={800}
              style={[styles.currentLanguageContainer, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
            >
              <View style={styles.currentLanguageContent}>
                <MaterialIcons name="language" size={24} color={colors.primary} />
                <View style={styles.currentLanguageInfo}>
                  <Text style={[styles.currentLanguageTitle, { color: colors.text }]}>
                    <FormattedMessage id="currentLanguage" defaultMessage="Idioma Actual" />
                  </Text>
                  <Text style={[styles.currentLanguageValue, { color: colors.primary }]}>
                    {availableLanguages.find((lang) => lang.code === locale)?.nativeName || locale.toUpperCase()}
                  </Text>
                </View>
              </View>
            </Animatable.View>

            {/* Auto Detect Section */}
            <Animatable.View
              animation="fadeInDown"
              duration={800}
              delay={100}
              style={[styles.autoDetectContainer, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
            >
              <View style={styles.autoDetectContent}>
                <View style={styles.autoDetectInfo}>
                  <Feather name="smartphone" size={24} color={colors.secondary} />
                  <View style={styles.autoDetectText}>
                    <Text style={[styles.autoDetectTitle, { color: colors.text }]}>
                      <FormattedMessage id="autoDetectLanguage" defaultMessage="Detección Automática" />
                    </Text>
                    <Text style={[styles.autoDetectDescription, { color: colors.icon }]}>
                      <FormattedMessage id="autoDetectLanguageDesc" defaultMessage="Usar idioma del dispositivo" />
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    {
                      backgroundColor: autoDetectEnabled ? colors.primary : colors.icon + "30",
                    },
                  ]}
                  onPress={handleAutoDetectToggle}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.toggleIndicator,
                      {
                        backgroundColor: "white",
                        transform: [{ translateX: autoDetectEnabled ? 20 : 2 }],
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </Animatable.View>

            {/* Section Title */}
            <Animatable.View animation="fadeInUp" duration={800} delay={200}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                <FormattedMessage id="availableLanguages" defaultMessage="Idiomas Disponibles" />
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.icon }]}>
                {autoDetectEnabled ? (
                  <FormattedMessage
                    id="autoDetectActive"
                    defaultMessage="La detección automática está activa. Desactívala para seleccionar manualmente."
                  />
                ) : (
                  <FormattedMessage id="selectLanguageManually" defaultMessage="Selecciona tu idioma preferido" />
                )}
              </Text>
            </Animatable.View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  currentLanguageContainer: {
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentLanguageContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentLanguageInfo: {
    marginLeft: 12,
    flex: 1,
  },
  currentLanguageTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  currentLanguageValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  autoDetectContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  autoDetectContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  autoDetectInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  autoDetectText: {
    marginLeft: 12,
    flex: 1,
  },
  autoDetectTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  autoDetectDescription: {
    fontSize: 14,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    position: "relative",
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: "absolute",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  languageItem: {
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  selectedLanguageItem: {
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  languageContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  flagEmoji: {
    fontSize: 28,
    marginRight: 15,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  languageRegion: {
    fontSize: 14,
  },
  languageActions: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 30,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default LanguageSettings
