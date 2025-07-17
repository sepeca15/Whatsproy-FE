"use client";

import type React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import Feather from "react-native-vector-icons/Feather";
import { Spinner } from "native-base";

interface ModalAction {
  label: string;
  onPress: () => void;
  style?: "primary" | "secondary" | "danger" | "success";
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
}

interface DynamicModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  headerIcon?: React.ReactNode;
  headerRightContent?: React.ReactNode;
  showCloseButton?: boolean;
  scrollable?: boolean;
  actions?: ModalAction[];
  footerContent?: React.ReactNode;
  backgroundColor?: string;
  headerBackgroundColor?: string;
  statusBarStyle?: "light-content" | "dark-content";
}

const GenericModal: React.FC<DynamicModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  headerIcon,
  headerRightContent,
  showCloseButton = true,
  scrollable = true,
  actions = [],
  footerContent,
  backgroundColor,
  headerBackgroundColor,
  statusBarStyle,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;

  const getActionButtonStyle = (actionStyle = "primary") => {
    const baseStyle = {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      minWidth: 80,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexDirection: "row" as const,
    };

    switch (actionStyle) {
      case "primary":
        return [baseStyle, { backgroundColor: colors.primary || "#075e54" }];
      case "secondary":
        return [
          baseStyle,
          {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: colors.border || "#e1e1e1",
          },
        ];
      case "danger":
        return [baseStyle, { backgroundColor: "#dc3545" }];
      case "success":
        return [baseStyle, { backgroundColor: "#28a745" }];
      default:
        return [baseStyle, { backgroundColor: colors.primary || "#075e54" }];
    }
  };

  const getActionButtonTextStyle = (actionStyle = "primary") => {
    switch (actionStyle) {
      case "secondary":
        return {
          color: colors.text || "#000",
          fontWeight: "600" as const,
          marginLeft: 5,
        };
      default:
        return { color: "#fff", fontWeight: "600" as const, marginLeft: 5 };
    }
  };

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: backgroundColor || colors.background },
        ]}
      >
        <StatusBar
          barStyle={
            statusBarStyle || (isDark ? "light-content" : "dark-content")
          }
        />

        <View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor || colors.primary },
          ]}
        >
          {showCloseButton && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          )}

          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {headerIcon && (
                <View style={styles.headerIcon}>{headerIcon}</View>
              )}
              <View style={styles.headerText}>
                {title && <Text allowFontScaling={false} style={styles.headerTitle}>{title}</Text>}
                {subtitle && (
                  <Text allowFontScaling={false} style={styles.headerSubtitle}>{subtitle}</Text>
                )}
              </View>
            </View>
          </View>

          {headerRightContent && (
            <View style={styles.headerRight}>{headerRightContent}</View>
          )}
        </View>

        <ContentWrapper
          style={[
            styles.contentContainer,
            !scrollable && styles.nonScrollableContent,
          ]}
          contentContainerStyle={scrollable ? styles.scrollContent : undefined}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ContentWrapper>

        {(actions.length > 0 || footerContent) && (
          <View
            style={[
              styles.footer,
              { backgroundColor: backgroundColor || colors.background },
            ]}
          >
            {footerContent}

            {actions.length > 0 && (
              <View style={styles.actionsContainer}>
                {actions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      getActionButtonStyle(action.style),
                      action.disabled && styles.disabledButton,
                      index > 0 && styles.actionSpacing,
                    ]}
                    onPress={action.onPress}
                    disabled={action.disabled}
                    activeOpacity={0.7}
                  >
                    {action.loading ? (
                      <Spinner color="white" size="sm" />
                    ) : (
                      <>
                        {" "}
                        {action.icon && (
                          <Feather
                            name={action.icon as any}
                            size={16}
                            color={action.style === "secondary" ? "black": "#fff"}
                          />
                        )}
                        <Text allowFontScaling={false}
                          style={[
                            getActionButtonTextStyle(action.style),
                            action.disabled && styles.disabledButtonText,
                          ]}
                        >
                          {action.label}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButton: {
    padding: 5,
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  headerRight: {
    marginLeft: 15,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  nonScrollableContent: {
    padding: 15,
  },
  scrollContent: {
    padding: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10,
  },
  actionSpacing: {
    marginLeft: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    opacity: 0.5,
  },
});

export default GenericModal;
