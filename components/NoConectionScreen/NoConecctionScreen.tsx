import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { useColorScheme } from "react-native"
import { useIntl } from "react-intl"
import { Colors } from "@/constants/Colors"

interface NoConnectionScreenProps {
  onRetry: () => void
  networkType?: string
}

const { width, height } = Dimensions.get("window")

export const NoConnectionScreen: React.FC<NoConnectionScreenProps> = ({ onRetry, networkType }) => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? "light"]
  const intl = useIntl()

  const getDescriptionText = () => {
    let baseText = intl.formatMessage({ id: "noConnection.description" })

    if (networkType) {
      const networkTypeText = intl.formatMessage(
        { id: "noConnection.networkTypeDetected" },
        { networkType }
      )
      baseText += `\n\n${networkTypeText}`
    }

    return baseText
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Icono principal */}
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
          <AntDesign name="disconnect" size={80} color={colors.primary} />
        </View>

        <Text allowFontScaling={false} style={[styles.title, { color: colors.text }]}>
          {intl.formatMessage({ id: "noConnection.title" })}
        </Text>

        <Text allowFontScaling={false} style={[styles.description, { color: colors.textSecondary }]}>{getDescriptionText()}</Text>

        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <AntDesign name="reload1" size={20} color="#fff" style={styles.retryIcon} />
          <Text allowFontScaling={false} style={styles.retryText}>{intl.formatMessage({ id: "noConnection.retryButton" })}</Text>
        </TouchableOpacity>

        <View style={styles.decorativeIcons}>
          <AntDesign name="wifi" size={24} color={colors.border} style={styles.decorativeIcon} />
          <AntDesign name="mobile1" size={24} color={colors.border} style={styles.decorativeIcon} />
          <AntDesign name="earth" size={24} color={colors.border} style={styles.decorativeIcon} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: width * 0.8,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    opacity: 0.8,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  decorativeIcons: {
    flexDirection: "row",
    marginTop: 40,
    gap: 20,
  },
  decorativeIcon: {
    opacity: 0.3,
  },
})