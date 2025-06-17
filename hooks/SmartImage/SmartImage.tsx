"use client"

import type React from "react"
import { useState } from "react"
import { Image, View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { useColorScheme } from "react-native"
import { Colors } from "@/constants/Colors"
import Feather from "react-native-vector-icons/Feather"

interface SmartImageProps {
  src: string | number // Puede ser URL o require()
  style?: any
  fallbackText?: string
  title?: string
}

const SmartImage: React.FC<SmartImageProps> = ({ src, style, fallbackText = "Imagen no disponible", title }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const colorScheme = useColorScheme()
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light

  const handleLoadStart = () => {
    setLoading(true)
    setError(false)
  }

  const handleLoadEnd = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  if (error) {
    return (
      <View style={[styles.fallbackContainer, style, { backgroundColor: colors.background }]}>
        <Feather name="image" size={40} color={colors.icon} />
        <Text style={[styles.fallbackText, { color: colors.text }]}>{fallbackText}</Text>
      </View>
    )
  }

  return (
    <View style={style}>
      <Image
        source={typeof src === "string" ? { uri: src } : src}
        style={[style, { position: "absolute" }]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        resizeMode="contain"
      />

      {loading && (
        <View style={[styles.loadingContainer, style]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Cargando imagen...</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  fallbackContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fallbackText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
  },
})

export default SmartImage
