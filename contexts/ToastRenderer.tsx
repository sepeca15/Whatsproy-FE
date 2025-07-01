import React from "react";
import {
  View,
  Text,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Animated, { SlideOutUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

const Colors = {
  light: {
    success: "#2ECC71",
    danger: "#E74C3C",
    warning: "#F39C12",
    primary: "#075e54",
  },
};

const getStatusConfig = (status: "success" | "error" | "info" | "warning") => {
  switch (status) {
    case "success":
      return {
        backgroundColor: "#fff",
        borderColor: Colors.light.success,
        icon: "checkmark-circle",
        iconColor: Colors.light.success,
      };
    case "error":
      return {
        backgroundColor: "#fff",
        borderColor: Colors.light.danger,
        icon: "close-circle",
        iconColor: Colors.light.danger,
      };
    case "warning":
      return {
        backgroundColor: "#fff",
        borderColor: Colors.light.warning,
        icon: "warning",
        iconColor: Colors.light.warning,
      };
    default:
      return {
        backgroundColor: "#fff",
        borderColor: Colors.light.primary,
        icon: "information-circle",
        iconColor: Colors.light.primary,
      };
  }
};

export const ToastRenderer = ({
  toasts,
  removeToast,
  insets,
}: {
  toasts: any[];
  removeToast: (id: string) => void;
  insets: { top: number };
}) => {
  if (toasts.length === 0) return null;

  return (
    <Modal transparent animationType="none" visible>
      <View
        style={[
          styles.modalContainer,
          { paddingTop: insets.top + 20 },
        ]}
        pointerEvents="box-none"
      >
        {toasts.map((toast, index) => {
          const config = getStatusConfig(toast.status);
          return (
            <Animated.View
              key={toast.id}
              exiting={SlideOutUp.springify().damping(15).stiffness(100)}
              style={[
                styles.toastContainer,
                { marginTop: index * 12, zIndex: 999999 - index },
              ]}
            >
              <View
                style={[
                  styles.toastBox,
                  {
                    backgroundColor: config.backgroundColor,
                    borderLeftColor: config.borderColor,
                  },
                ]}
              >
                <View style={styles.contentContainer}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={config.icon as any}
                      size={22}
                      color={config.iconColor}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={[styles.title]} numberOfLines={2}>
                      {toast.title}
                    </Text>
                    {toast.descripcion && (
                      <Text style={styles.description} numberOfLines={3}>
                        {toast.descripcion}
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
              </View>
            </Animated.View>
          );
        })}
      </View>
    </Modal>
  );
};

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
    shadowOffset: { width: 0, height: 4 },
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
    borderColor: "#e0e0e0",
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
    color: "#1f2937",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
    color: "#6b7280",
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
});
