"use client"

import React, { createContext, useContext, useState, type ReactNode, useCallback } from "react"
import { Modal, View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  SlideInDown,
  SlideOutUp,
} from "react-native-reanimated"
import { useIntl } from "react-intl"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const primaryColor = "#075e54"
const secondaryColor = "#128c7e"

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    primary: primaryColor,
    secondary: secondaryColor,
    warning: "#F39C12",
    border: "#e1e1e1",
    success: "#2ECC71",
    textSecondary: "#000",
    danger: "#E74C3C",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: primaryColor,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    primary: primaryColor,
    border: "#e1e1e1",
    textSecondary: "#FFF",
    secondary: secondaryColor,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryColor,
  },
}

type ToastStatus = "success" | "error" | "info" | "warning"

interface ShowToastParams {
  title: string | React.ReactNode
  description?: string | React.ReactNode
  status?: ToastStatus
  duration?: number
}

interface ToastData {
  id: string
  title: string
  description?: string
  status: ToastStatus
  duration: number
}

const ToastContext = createContext<{
  showToast: (args: ShowToastParams) => void
} | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const intl = useIntl()
  const [toasts, setToasts] = useState<ToastData[]>([])
  const insets = useSafeAreaInsets()

  const resolveToString = (value: any): string => {
    if (typeof value === "string") return value

    if (value?.props?.id && value?.props?.defaultMessage) {
      return intl.formatMessage({
        id: value.props.id,
        defaultMessage: value.props.defaultMessage,
      })
    }

    return ""
  }

  const showToast = useCallback(
    ({ title, description, status = "info", duration = 4000 }: ShowToastParams) => {
      const titleText = resolveToString(title)
      const descriptionText = description ? resolveToString(description) : undefined

      const newToast: ToastData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: titleText,
        description: descriptionText,
        status,
        duration,
      }

      setToasts((prev) => [...prev, newToast])

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id))
      }, duration)
    },
    [intl],
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const getStatusConfig = (status: ToastStatus) => {
    switch (status) {
      case "success":
        return {
          backgroundColor: "#ffffff",
          borderColor: Colors.light.success,
          icon: "checkmark-circle",
          iconColor: Colors.light.success,
          titleColor: "#1f2937",
          descriptionColor: "#6b7280",
        }
      case "error":
        return {
          backgroundColor: "#ffffff",
          borderColor: Colors.light.danger,
          icon: "close-circle",
          iconColor: Colors.light.danger,
          titleColor: "#1f2937",
          descriptionColor: "#6b7280",
        }
      case "warning":
        return {
          backgroundColor: "#ffffff",
          borderColor: Colors.light.warning,
          icon: "warning",
          iconColor: Colors.light.warning,
          titleColor: "#1f2937",
          descriptionColor: "#6b7280",
        }
      case "info":
      default:
        return {
          backgroundColor: "#ffffff",
          borderColor: Colors.light.primary,
          icon: "information-circle",
          iconColor: Colors.light.primary,
          titleColor: "#1f2937",
          descriptionColor: "#6b7280",
        }
    }
  }

  if (toasts.length === 0) return <ToastContext.Provider value={{ showToast }}>{children}</ToastContext.Provider>

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Modal transparent animationType="none" visible={toasts.length > 0}>
        <View style={[styles.modalContainer, { paddingTop: insets.top + 20 }]} pointerEvents="box-none">
          {toasts.map((toast, index) => {
            const statusConfig = getStatusConfig(toast.status)

            return (
              <Animated.View
                key={toast.id}
                entering={SlideInDown.springify()
                  .damping(15)
                  .stiffness(100)
                  .delay(index * 100)}
                exiting={SlideOutUp.springify().damping(15).stiffness(100)}
                style={[
                  styles.toastContainer,
                  {
                    marginTop: index * 12,
                    zIndex: 999999 - index,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toastBox,
                    {
                      backgroundColor: statusConfig.backgroundColor,
                      borderLeftColor: statusConfig.borderColor,
                    },
                  ]}
                >
                  <View style={styles.contentContainer}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={statusConfig.icon as any} size={22} color={statusConfig.iconColor} />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={[styles.title, { color: statusConfig.titleColor }]} numberOfLines={2}>
                        {toast.title}
                      </Text>
                      {toast.description && (
                        <Text style={[styles.description, { color: statusConfig.descriptionColor }]} numberOfLines={3}>
                          {toast.description}
                        </Text>
                      )}
                    </View>

                     <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => removeToast(toast.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={18} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>

                  {/* Progress Bar */}
                  {/* <ProgressBar duration={toast.duration} color={statusConfig.borderColor} /> */}
                </View>
              </Animated.View>
            )
          })}
        </View>
      </Modal>
    </ToastContext.Provider>
  )
}

const ProgressBar: React.FC<{ duration: number; color: string }> = ({ duration, color }) => {
  const progress = useSharedValue(1)

  React.useEffect(() => {
    progress.value = withTiming(0, { duration })
  }, [duration])

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }))

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, { backgroundColor: color }, progressStyle]} />
    </View>
  )
}

export const useToastContext = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToastContext debe usarse dentro de ToastProvider")
  return ctx
}

const { width: screenWidth } = Dimensions.get("window")

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    paddingHorizontal: 16,
    pointerEvents: "box-none",
  },
  toastContainer: {
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  toastBox: {
    borderRadius: 12,
    overflow: "hidden",
    width: screenWidth - 32,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    minHeight: 60,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: "#f3f4f6",
  },
  progressBar: {
    height: "100%",
  },
})
