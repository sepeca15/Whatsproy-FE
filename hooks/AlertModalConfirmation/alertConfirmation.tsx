"use client"

import type React from "react"
import { Modal, View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native"
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

interface AlertConfirmationModalProps {
  show: boolean
  processing: boolean
  title: string
  message: string
  cancelText: string
  confirmText: string
  onCancel: () => void
  onConfirm: () => void
}

const AlertConfirmationModal: React.FC<AlertConfirmationModalProps> = ({
  show,
  processing,
  title,
  message,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}) => {
  if (!show) return null

  return (
    <Modal transparent visible={show} animationType="fade" onRequestClose={processing ? undefined : onCancel}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={processing ? undefined : onCancel}
          disabled={processing}
        />

        <View style={styles.centeredView}>
          <Animated.View
            style={styles.modalContainer}
          >
            {/* Header con icono */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="help-circle-outline" size={32} color={Colors.light.primary} />
              </View>
              {!processing && (
                <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                  <Ionicons name="close" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>

            {/* Contenido */}
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>

            {/* Footer con botones */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={onCancel}
                style={[styles.button, styles.cancelButton]}
                disabled={processing}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirm}
                style={[styles.button, styles.confirmButton, processing && styles.confirmButtonDisabled]}
                disabled={processing}
                activeOpacity={0.7}
              >
                <View style={styles.confirmButtonContent}>
                  {processing && (
                    <View style={styles.loadingIndicator}>
                      <Ionicons name="hourglass-outline" size={16} color="#ffffff" />
                    </View>
                  )}
                  <Text style={styles.confirmButtonText}>{processing ? "Procesando..." : confirmText}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  )
}

const { width: screenWidth } = Dimensions.get("window")

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1000,
    height: "100%",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "100%",
    maxWidth: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.light.primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 28,
  },
  message: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 52,
  },
  cancelButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
  },
  confirmButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  confirmButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  loadingIndicator: {
    marginRight: 4,
  },
})

export default AlertConfirmationModal
