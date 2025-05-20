// components/SettingCard.tsx
import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import CustomText from "@/components/CustomText"
import Animated, { FadeInDown } from "react-native-reanimated"
import { Shadow } from "react-native-shadow-2"

type Props = {
  item: {
    title: string
    description: string
    icon: React.ReactNode
    href: string
  }
  index: number
  isDark: boolean
  colors: any
  onNavigate: (href: string) => void
}

const SettingCard: React.FC<Props> = ({ item, index, isDark, colors, onNavigate }) => {
  return (
    <Shadow
          distance={5}
          startColor={'rgba(0, 0, 0, 0.05)'}
          endColor={'rgba(0, 0, 0, 0.01)'}
          offset={[0, 2]}
          style={{ width: '100%', marginBottom: 12, borderRadius: 16 }}
        >
    <Animated.View entering={FadeInDown.delay(100 * index).duration(400)}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: isDark ? "#1E2022" : "white" }]}
        onPress={() => item.href && onNavigate(item.href)}
        disabled={!item.href}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: index % 2 === 0 ? colors.primary : colors.secondary,
              shadowColor: colors.primary,
            },
          ]}
        >
          {item.icon}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <CustomText style={[styles.description, { color: isDark ? "#9BA1A6" : "#687076" }]}>
            {item.description}
          </CustomText>
        </View>

        <AntDesign name="right" size={16} color={isDark ? "#9BA1A6" : "#687076"} style={styles.chevron} />
      </TouchableOpacity>
    </Animated.View>
    </Shadow>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "white", // Mismo color que el fondo
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
   
    // Efecto neumórfico
    shadowColor: "#5656f",
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    // Segunda sombra para el efecto completo
    // Nota: React Native no soporta múltiples sombras, así que esto es una aproximación
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    marginTop: 4,
  },
  chevron: {
    marginLeft: 8,
  },
})

export default SettingCard
