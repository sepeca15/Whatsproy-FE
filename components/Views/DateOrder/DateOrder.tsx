"use client"

import * as React from "react"
import { Pressable, Text, TouchableOpacity, View, ActivityIndicator, ScrollView } from "react-native"
import { styles } from "./DateOrderStyles"
import api from "@/services/api/admin"
import CustomText from "@/components/CustomText"
import DateOrderCard from "./components/DateOrderCard"
import ModalCreateOrderDate from "./components/ModalCreateOrderDate"
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { useToastContext } from "@/contexts/ToastContext"
import { FormattedMessage, useIntl } from "react-intl"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction"
import { globalStyles } from "@/components/globalStyles"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import CustomHeader from "@/components/CustomHeader/CustomHeader"

interface OrderDataItem {
  id: number
  nombre: string
  tipo: string
  requerido: boolean
  es_defecto: boolean
}

const DateOrder: React.FC = () => {
  const intl = useIntl()
  const router = useRouter()
  const { showToast } = useToastContext()

  const [orderDate, setOrderDate] = React.useState<OrderDataItem[]>([])
  const [selectedItem, setSelectedItem] = React.useState<OrderDataItem | null>(null)
  const [stateModal, setStateModal] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [loadingDelete, setLoadingDelete] = React.useState<boolean>(false)
  const [stateModalConfirm, setstateModalConfirm] = React.useState<boolean>(false)
  const [itemToDeleteId, setItemToDeleteId] = React.useState<number | null>(null)

  const toggleModalConfirm = () => setstateModalConfirm((prev) => !prev)

  const updateOrderData = (newOrderData: OrderDataItem) => {
    if (selectedItem?.id) {
      setOrderDate((prevState) => prevState.map((item) => (item.id === selectedItem.id ? newOrderData : item)))
    } else {
      setOrderDate((prevState) => [...prevState, newOrderData])
    }
  }

  const openConfirmModal = (id: number) => {
    setItemToDeleteId(id)
    setstateModalConfirm(true)
  }

  const getAllOrderDate = async () => {
    setLoading(true)
    try {
      const data = await api.dataOrder.getAll()
      setOrderDate(data || [])
    } catch (error: any) {
      showToast({
        title: intl.formatMessage({
          id: "orderData.error.loadingData",
          defaultMessage: "Error al cargar datos",
        }),
        status: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const onOpenModal = (item?: OrderDataItem) => {
    setSelectedItem(item || null)
    setStateModal(true)
  }

  const onCloseModal = () => {
    setSelectedItem(null)
    setStateModal(false)
  }

  const onDeleteItem = async (id: number) => {
    setLoadingDelete(true)
    try {
      const data = await api.dataOrder.delete(id)
      if (data) {
        const allItems = orderDate.filter((item) => item.id !== id)
        setOrderDate(allItems)
        showToast({
          title: intl.formatMessage({
            id: "orderData.success.deleted",
            defaultMessage: "Campo eliminado correctamente",
          }),
          status: "success",
        })
        setstateModalConfirm(false)
        setItemToDeleteId(null)
      }
    } catch (error: any) {
      showToast({
        title: intl.formatMessage({
          id: "orderData.error.deleting",
          defaultMessage: "Error al eliminar campo",
        }),
        description:
          error?.response?.data?.message ||
          intl.formatMessage({
            id: "common.unknownError",
            defaultMessage: "Error desconocido",
          }),
        status: "error",
      })
    } finally {
      setLoadingDelete(false)
    }
  }

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case "string":
        return "text-fields"
      case "number":
        return "numbers"
      case "boolean":
        return "check-box"
      case "date":
        return "date-range"
      default:
        return "help-outline"
    }
  }

  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case "string":
        return Colors.light.primary
      case "number":
        return Colors.light.secondary
      case "boolean":
        return Colors.light.success
      case "date":
        return Colors.light.warning
      default:
        return Colors.light.icon
    }
  }

  React.useEffect(() => {
    getAllOrderDate()
  }, [])

  return (
    <View style={styles.container}>
      <CustomHeader 
      title={<FormattedMessage id="orderData.title" defaultMessage="Campos Personalizados" />}
      subtitle={<FormattedMessage
                id="orderData.subtitle"
                defaultMessage="Gestiona la información que recopilas"
              />}
              onBack={() => router.back()}
              showBackButton

      />

      {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>
              <FormattedMessage id="orderData.loading" defaultMessage="Cargando campos..." />
            </Text>
          </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info Banner */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.infoBanner}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="info-outline" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>
                <FormattedMessage id="orderData.info.title" defaultMessage="Campos de información" />
              </Text>
              <Text style={styles.infoDescription}>
                <FormattedMessage
                  id="orderData.info.description"
                  defaultMessage="Define qué información adicional necesitas de tus clientes al realizar pedidos"
                />
              </Text>
            </View>
          </Animated.View>

          {/* Fields List */}
          <View style={styles.fieldsContainer}>
            {orderDate.length === 0 ? (
              <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={[Colors.light.primary + "20", Colors.light.primary + "10"]}
                    style={styles.emptyIconBackground}
                  >
                    <MaterialIcons name="assignment" size={48} color={Colors.light.primary} />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyTitle}>
                  <FormattedMessage id="orderData.empty.title" defaultMessage="No hay campos configurados" />
                </Text>
                <Text style={styles.emptySubtitle}>
                  <FormattedMessage
                    id="orderData.empty.subtitle"
                    defaultMessage="Comienza agregando tu primer campo personalizado para recopilar información específica"
                  />
                </Text>
                <TouchableOpacity style={styles.emptyButton} onPress={() => onOpenModal()} activeOpacity={0.8}>
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.emptyButtonText}>
                    <FormattedMessage id="orderData.empty.button" defaultMessage="Crear primer campo" />
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <>
                {/* Fields Header */}
                <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.fieldsHeader}>
                  <Text style={styles.fieldsHeaderTitle}>
                    <FormattedMessage id="orderData.fields.title" defaultMessage="Campos configurados" />
                  </Text>
                  <View style={styles.fieldsHeaderBadge}>
                    <Text style={styles.fieldsHeaderBadgeText}>{orderDate.length}</Text>
                  </View>
                </Animated.View>

                {/* Fields Cards */}
                {orderDate.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInDown.duration(600).delay(400 + index * 100)}
                    style={styles.fieldCard}
                  >
                    <View style={styles.fieldCardHeader}>
                      <View style={styles.fieldTypeContainer}>
                        <View
                          style={[
                            styles.fieldTypeIcon,
                            { backgroundColor: getFieldTypeColor(item.tipo) + "20" },
                          ]}
                        >
                          <MaterialIcons
                            name={getFieldTypeIcon(item.tipo)}
                            size={20}
                            color={getFieldTypeColor(item.tipo)}
                          />
                        </View>
                        <View style={styles.fieldInfo}>
                          <Text style={styles.fieldName}>{item.nombre}</Text>
                          <Text style={styles.fieldType}>
                            <FormattedMessage
                              id={`orderData.fieldType.${item.tipo}`}
                              defaultMessage={item.tipo}
                            />
                          </Text>
                        </View>
                      </View>
                      <View style={styles.fieldActions}>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => onOpenModal(item)}
                          activeOpacity={0.7}
                        >
                          <Feather name="edit-2" size={16} color={Colors.light.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => openConfirmModal(item.id)}
                          activeOpacity={0.7}
                        >
                          <Feather name="trash-2" size={16} color={Colors.light.danger} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.fieldBadges}>
                      {item.requerido && (
                        <View style={[styles.badge, styles.requiredBadge]}>
                          <MaterialIcons name="star" size={12} color={Colors.light.warning} />
                          <Text style={styles.requiredBadgeText}>
                            <FormattedMessage id="orderData.badge.required" defaultMessage="Requerido" />
                          </Text>
                        </View>
                      )}
                      {item.es_defecto && (
                        <View style={[styles.badge, styles.defaultBadge]}>
                          <MaterialIcons name="check-circle" size={12} color={Colors.light.success} />
                          <Text style={styles.defaultBadgeText}>
                            <FormattedMessage id="orderData.badge.default" defaultMessage="Por defecto" />
                          </Text>
                        </View>
                      )}
                    </View>
                  </Animated.View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      )}

      {!loading && orderDate.length > 0 && (
        <Animated.View entering={FadeInUp.duration(600).delay(800)} style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={() => onOpenModal()} activeOpacity={0.8}>
            <LinearGradient colors={[Colors.light.primary, Colors.light.primary + "CC"]} style={styles.fabGradient}>
              <Ionicons name="add" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {stateModal && (
        <ModalCreateOrderDate updateOrder={updateOrderData as any} onClose={onCloseModal} data={selectedItem as any} visible={true} />
      )}

      <ModalConfirmAction
        isOpen={stateModalConfirm}
        onClose={toggleModalConfirm}
        loading={loadingDelete}
        onContinue={() => onDeleteItem(itemToDeleteId ?? 0)}
        title={intl.formatMessage({
          id: "orderData.deleteModal.title",
          defaultMessage: "Eliminar campo",
        })}
        message={intl.formatMessage({
          id: "orderData.deleteModal.message",
          defaultMessage: "¿Estás seguro de que deseas eliminar este campo? Esta acción no se puede deshacer.",
        })}
      />
    </View>
  )
}

export default DateOrder
