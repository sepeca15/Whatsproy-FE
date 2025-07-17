"use client"

import { useEffect, useState, useCallback } from "react"
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native"
import { Switch, Spinner } from "native-base"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { FormattedMessage, useIntl } from "react-intl"
import { router } from "expo-router"

import GenericModal from "@/components/Views/ConfigAccount/components/GenericModal/GenericModal"
import InputField from "@/components/InputField"
import { useToastContext } from "@/contexts/ToastContext"
import api from "@/services/api/admin"
import { Colors } from "@/constants/Colors"
import { styles } from "./PaymentMethodStyles"
import CustomHeader from "@/components/CustomHeader/CustomHeader"

interface PaymentMethod {
  id: string
  name: string
  description: string
  specifications: string
  enabled: boolean
  icon?: string
}

const PaymentMethodsView = () => {
  const intl = useIntl()
  const { showToast } = useToastContext()

  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [editModal, setEditModal] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [viewText, setViewText] = useState<string | null>(null)
  const [updatingMethod, setUpdatingMethod] = useState<string | null>(null)

  const fetchPaymentMethods = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const resp = await api.paymentMethods.getPaymentMethods()
      setMethods(resp ?? [])
    } catch (error) {
      console.error(error)
      showToast({
        title: intl.formatMessage({
          id: "paymentMethods.error.loading",
          defaultMessage: "Error al cargar métodos de pago",
        }),
        status: "error",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [intl, showToast])

  const handleEdit = async (id: string, data: PaymentMethod) => {
    setUpdatingMethod(id)
    try {
      const resp = await api.paymentMethods.editPaymentMethod(id, data)
      
      if (resp?.id) {
        await fetchPaymentMethods()
        showToast({
          title: intl.formatMessage({
            id: "paymentMethods.success.updated",
            defaultMessage: "Método de pago actualizado correctamente",
          }),
          status: "success",
        })
        setEditModal(false)
        setSelectedMethod(null)
      } else {
        throw new Error("Error updating payment method")
      }
    } catch (error) {
      console.error(error)
      showToast({
        title: intl.formatMessage({
          id: "paymentMethods.error.updating",
          defaultMessage: "Error al actualizar método de pago",
        }),
        status: "error",
      })
    } finally {
      setUpdatingMethod(null)
    }
  }

  const handleToggle = async (id: string, currentValue: boolean) => {
    const method = methods.find((m) => m.id === id)
    if (method) {
      await handleEdit(id, { ...method, enabled: !currentValue })
    }
  }

  const onRefresh = useCallback(() => {
    fetchPaymentMethods(true)
  }, [fetchPaymentMethods])

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  const getMethodIcon = (methodName: string) => {
    const name = methodName.toLowerCase()
    if (name.includes("card") || name.includes("tarjeta")) return "credit-card"
    if (name.includes("cash") || name.includes("efectivo")) return "payments"
    if (name.includes("transfer") || name.includes("transferencia")) return "account-balance"
    if (name.includes("paypal")) return "account-balance-wallet"
    return "payment"
  }

  const getMethodColor = (methodName: string) => {
    const name = methodName.toLowerCase()
    if (name.includes("card") || name.includes("tarjeta")) return Colors.light.primary
    if (name.includes("cash") || name.includes("efectivo")) return Colors.light.success
    if (name.includes("transfer") || name.includes("transferencia")) return Colors.light.secondary
    if (name.includes("paypal")) return Colors.light.warning
    return Colors.light.primary
  }

  const renderMethodCard = (method: PaymentMethod, index: number) => {
    const methodColor = getMethodColor(method.name)
    const isUpdating = updatingMethod === method.id

    return (
      <View key={method.id}>
        <View style={styles.methodCard}>
          <LinearGradient colors={["#ffffff", "#f8fafc"]} style={styles.cardGradient}>
            <View style={styles.statusBadgeContainer}>
              <View style={[styles.statusBadge, { backgroundColor: method.enabled ? Colors.light.success + "20" : Colors.light.textSecondary + "20" }]}>
                <MaterialIcons 
                  name={method.enabled ? "check-circle" : "pause-circle"} 
                  size={12} 
                  color={method.enabled ? Colors.light.success : Colors.light.textSecondary} 
                />
                <Text allowFontScaling={false} style={[styles.statusText, { color: method.enabled ? Colors.light.success : Colors.light.textSecondary }]}>
                  <FormattedMessage 
                    id={method.enabled ? "paymentMethods.status.enabled" : "paymentMethods.status.disabled"}
                    defaultMessage={method.enabled ? "Activo" : "Inactivo"}
                  />
                </Text>
              </View>
            </View>

            <View style={styles.methodHeader}>
              <View style={styles.methodIconContainer}>
                <LinearGradient
                  colors={[methodColor + "25", methodColor + "15"]}
                  style={styles.methodIcon}
                >
                  <MaterialIcons name={getMethodIcon(method.name) as any} size={24} color={methodColor} />
                </LinearGradient>
              </View>

              <View style={styles.methodInfo}>
                <Text allowFontScaling={false} style={styles.methodName} numberOfLines={1}>
                  {method.name}
                </Text>
                <Text allowFontScaling={false} style={styles.methodDescription} numberOfLines={2}>
                  {method.description || (
                    <FormattedMessage 
                      id="paymentMethods.noDescription" 
                      defaultMessage="Sin descripción disponible" 
                    />
                  )}
                </Text>
              </View>

              <View style={styles.toggleContainer}>
                {isUpdating ? (
                  <View style={styles.loadingToggle}>
                    <Spinner size="sm" color={methodColor} />
                  </View>
                ) : (
                  <Switch
                    isChecked={method.enabled}
                    onToggle={() => handleToggle(method.id, method.enabled)}
                    size="md"
                    colorScheme="primary"
                  />
                )}
              </View>
            </View>

            <View style={styles.methodActions}>
              {method.specifications && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setViewText(method.specifications)
                    setViewModal(true)
                  }}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[Colors.light.secondary + "25", Colors.light.secondary + "15"]}
                    style={styles.actionButtonGradient}
                  >
                    <MaterialIcons name="visibility" size={16} color={Colors.light.secondary} />
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setSelectedMethod(method)
                  setEditModal(true)
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[Colors.light.primary + "25", Colors.light.primary + "15"]}
                  style={styles.actionButtonGradient}
                >
                  <MaterialIcons name="edit" size={16} color={Colors.light.primary} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    )
  }

  const renderHeader = () => (
    <CustomHeader
      title={<FormattedMessage id="paymentMethods.title" defaultMessage="Métodos de Pago" />}
      subtitle={<FormattedMessage id="paymentMethods.subtitle" defaultMessage="Gestiona las opciones de pago" />}
      onBack={() => router.back()}
    />
  )

  const renderInfoBanner = () => (
    <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.infoBanner}>
      <View style={styles.infoIconContainer}>
        <MaterialIcons name="info-outline" size={20} color={Colors.light.primary} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text allowFontScaling={false} style={styles.infoTitle}>
          <FormattedMessage id="paymentMethods.info.title" defaultMessage="Métodos de pago" />
        </Text>
        <Text allowFontScaling={false} style={styles.infoDescription}>
          <FormattedMessage
            id="paymentMethods.info.description"
            defaultMessage="Configura y gestiona las opciones de pago disponibles para tus clientes"
          />
        </Text>
      </View>
    </Animated.View>
  )

  const renderEmptyState = () => (
    <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={[Colors.light.primary + "25", Colors.light.primary + "15"]}
          style={styles.emptyIconBackground}
        >
          <MaterialIcons name="payment" size={64} color={Colors.light.primary} />
        </LinearGradient>
      </View>
      <Text allowFontScaling={false} style={styles.emptyTitle}>
        <FormattedMessage id="paymentMethods.empty.title" defaultMessage="No hay métodos de pago" />
      </Text>
      <Text allowFontScaling={false} style={styles.emptySubtitle}>
        <FormattedMessage
          id="paymentMethods.empty.subtitle"
          defaultMessage="Los métodos de pago se configurarán automáticamente según tu plan"
        />
      </Text>
    </Animated.View>
  )

  const editModalActions = [
    {
      label: intl.formatMessage({ id: "common.cancel", defaultMessage: "Cancelar" }),
      onPress: () => {
        setEditModal(false)
        setSelectedMethod(null)
      },
      style: "secondary" as const,
      disabled: !!updatingMethod,
    },
    {
      label: updatingMethod
        ? intl.formatMessage({ id: "common.saving", defaultMessage: "Guardando..." })
        : intl.formatMessage({ id: "common.save", defaultMessage: "Guardar" }),
      onPress: () => {
        if (selectedMethod) {
          handleEdit(selectedMethod.id, selectedMethod)
        }
      },
      style: "primary" as const,
      disabled: !!updatingMethod,
    },
  ]

  const viewModalActions = [
    {
      label: intl.formatMessage({ id: "common.close", defaultMessage: "Cerrar" }),
      onPress: () => {
        setViewModal(false)
        setViewText(null)
      },
      style: "primary" as const,
    },
  ]

  return (
    <View style={styles.container}>
      {renderHeader()}

      {loading ? (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.loadingContainer}>
            <Spinner size="large" color={Colors.light.primary} />
            <Text allowFontScaling={false} style={styles.loadingText}>
              <FormattedMessage id="paymentMethods.loading" defaultMessage="Cargando métodos de pago..." />
            </Text>
        </Animated.View>
      ) : (
        <View style={styles.content}>
          {methods.length > 0 ? (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.light.primary]}
                  tintColor={Colors.light.primary}
                />
              }
            >
              {renderInfoBanner()}
              {methods.map((method, index) => renderMethodCard(method, index))}
            </ScrollView>
          ) : (
            renderEmptyState()
          )}
        </View>
      )}

      {editModal && selectedMethod && (
        <GenericModal
          visible={editModal}
          onClose={() => {
            setEditModal(false)
            setSelectedMethod(null)
          }}
          title={intl.formatMessage({
            id: "paymentMethods.modal.editTitle",
            defaultMessage: "Editar método de pago",
          })}
          subtitle={intl.formatMessage({
            id: "paymentMethods.modal.editSubtitle",
            defaultMessage: "Modifica la configuración del método de pago",
          })}
          actions={editModalActions}
          scrollable={true}
        >
          <View style={styles.modalContent}>
            <View style={styles.fieldContainer}>
              <Text allowFontScaling={false} style={styles.fieldLabel}>
                <FormattedMessage id="paymentMethods.modal.name" defaultMessage="Nombre" />
                <Text allowFontScaling={false} style={styles.required}> *</Text>
              </Text>
              <InputField
                value={selectedMethod.name}
                onChangeText={(text) => setSelectedMethod({ ...selectedMethod, name: text })}
                placeholder={intl.formatMessage({
                  id: "paymentMethods.modal.namePlaceholder",
                  defaultMessage: "Nombre del método de pago",
                })}
                editable={!updatingMethod}
              />
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.switchInfo}>
                <Text allowFontScaling={false} style={styles.switchLabel}>
                  <FormattedMessage id="paymentMethods.modal.enabled" defaultMessage="Habilitado" />
                </Text>
                <Text allowFontScaling={false} style={styles.switchDescription}>
                  <FormattedMessage
                    id="paymentMethods.modal.enabledDescription"
                    defaultMessage="Los clientes podrán usar este método de pago"
                  />
                </Text>
              </View>
              <Switch
                isChecked={selectedMethod.enabled}
                onToggle={(value) => setSelectedMethod({ ...selectedMethod, enabled: value })}
                size="md"
                colorScheme="primary"
                isDisabled={!!updatingMethod}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text allowFontScaling={false} style={styles.fieldLabel}>
                <FormattedMessage id="paymentMethods.modal.description" defaultMessage="Descripción" />
              </Text>
              <InputField
                value={selectedMethod.description}
                onChangeText={(text) => setSelectedMethod({ ...selectedMethod, description: text })}
                placeholder={intl.formatMessage({
                  id: "paymentMethods.modal.descriptionPlaceholder",
                  defaultMessage: "Descripción del método de pago",
                })}
                multiline
                numberOfLines={3}
                style={styles.textArea}
                editable={!updatingMethod}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text allowFontScaling={false} style={styles.fieldLabel}>
                <FormattedMessage id="paymentMethods.modal.specifications" defaultMessage="Especificaciones" />
              </Text>
              <InputField
                value={selectedMethod.specifications}
                onChangeText={(text) => setSelectedMethod({ ...selectedMethod, specifications: text })}
                placeholder={intl.formatMessage({
                  id: "paymentMethods.modal.specificationsPlaceholder",
                  defaultMessage: "Detalles técnicos o instrucciones especiales",
                })}
                multiline
                numberOfLines={4}
                style={styles.textArea}
                editable={!updatingMethod}
              />
            </View>

            {updatingMethod && (
              <View style={styles.loadingIndicator}>
                <Spinner size="sm" color={Colors.light.primary} />
                <Text allowFontScaling={false} style={styles.loadingIndicatorText}>
                  <FormattedMessage
                    id="paymentMethods.modal.updating"
                    defaultMessage="Actualizando método de pago..."
                  />
                </Text>
              </View>
            )}
          </View>
        </GenericModal>
      )}

      {viewModal && viewText && (
        <GenericModal
          visible={viewModal}
          onClose={() => {
            setViewModal(false)
            setViewText(null)
          }}
          title={intl.formatMessage({
            id: "paymentMethods.modal.specificationsTitle",
            defaultMessage: "Especificaciones del método",
          })}
          subtitle={intl.formatMessage({
            id: "paymentMethods.modal.specificationsSubtitle",
            defaultMessage: "Detalles técnicos y configuración",
          })}
          actions={viewModalActions}
          scrollable={true}
        >
          <View style={styles.viewModalContent}>
            <View style={styles.specificationsContainer}>
              <Text allowFontScaling={false} style={styles.specificationsText}>{viewText}</Text>
            </View>
          </View>
        </GenericModal>
      )}
    </View>
  )
}

export default PaymentMethodsView
