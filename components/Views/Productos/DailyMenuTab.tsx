"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { Text, View, ScrollView, Spinner, Avatar, Image, Switch, FlatList, Input, Icon as NBIcon } from "native-base"
import { TouchableOpacity, RefreshControl } from "react-native"
import * as Animatable from "react-native-animatable"
import { styles } from "./ProductosStyles"
import LottieView from "lottie-react-native"
import { FormattedMessage, useIntl } from "react-intl"
import Icon from "react-native-vector-icons/FontAwesome"
import { Colors } from "../../../constants/Colors"
import { useToastContext } from "@/contexts/ToastContext"
import type { Schedule } from "../SchedulesView/SchedulesView"
import api from "@/services/api/admin"
import AddOrEditDailyMenu from "../AddOrEditDailyMenu/AddOrEditDailyMenu"
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction"
import type { Cliente } from "../Clients/types"
import { useUser } from "@/hooks/redux/useUser"
import { MaterialIcons, Feather } from "@expo/vector-icons"
import GenericModal from "../ConfigAccount/components/GenericModal/GenericModal"

interface ProductoBDD {
  id: number
  nombre: string
  precio: string
  imagen: string
  descripcion: string
  plazoDuracionEstimadoMinutos: number
  disponible: boolean
  currency_id: number
  isMenuDiario: boolean
  orderMenuDiario: number
  diaSemana: number
  empresa_id: number
  category?: any[]
}

interface DailyMenuItem {
  id: number
  imagen?: string
  name: string
  description: string
  price: number
  available: boolean
  image?: string
  estimatedDuration: number
  currencyId: number
  order: number
}

interface DayMenu {
  dayId: number
  dayName: string
  schedules: Schedule[]
  items: DailyMenuItem[]
}

interface IValues {
  offset: number
  limit: number
  clients: Cliente[]
  totalItems: number
}

const initialState = {
  offset: 0,
  limit: 10,
  clients: [],
  totalItems: 0,
}

const DailyMenuTab = () => {
  const intl = useIntl()
  const { showToast } = useToastContext()
  const { user } = useUser()

  const [refreshing, setRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(true)
  const deleteAnimationRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [loadingDailyMenus, setLoadingDailyMenus] = useState(false)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [dailyMenuProducts, setDailyMenuProducts] = useState<ProductoBDD[]>([])
  const [weeklyMenu, setWeeklyMenu] = useState<DayMenu[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null)
  const [selectedDayName, setSelectedDayName] = useState<string>("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteOrderId, setDeleteOrderId] = useState(0)
  const [loadingClients, setLoadingClients] = useState(false)
  const [values, setValues] = useState<IValues>(initialState)

  // New states for notification management
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [updatingNotification, setUpdatingNotification] = useState<number | null>(null)

  // New states for search functionality
  const [searchQuery, setSearchQuery] = useState("")
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  const allDaysOfWeek = useMemo(
    () => [
      {
        id: 1,
        name: intl.formatMessage({ id: "day.monday", defaultMessage: "Lunes" }),
      },
      {
        id: 2,
        name: intl.formatMessage({
          id: "day.tuesday",
          defaultMessage: "Martes",
        }),
      },
      {
        id: 3,
        name: intl.formatMessage({
          id: "day.wednesday",
          defaultMessage: "Miércoles",
        }),
      },
      {
        id: 4,
        name: intl.formatMessage({
          id: "day.thursday",
          defaultMessage: "Jueves",
        }),
      },
      {
        id: 5,
        name: intl.formatMessage({
          id: "day.friday",
          defaultMessage: "Viernes",
        }),
      },
      {
        id: 6,
        name: intl.formatMessage({
          id: "day.saturday",
          defaultMessage: "Sábado",
        }),
      },
      {
        id: 7,
        name: intl.formatMessage({
          id: "day.sunday",
          defaultMessage: "Domingo",
        }),
      },
    ],
    [intl],
  )

  const activeDaysOfWeek = useMemo(() => {
    if (schedules?.length === 0) return []

    const uniqueDays = schedules.reduce(
      (acc, schedule) => {
        const existingDay = acc.find((day) => day.dayOfWeek === schedule.dayOfWeek)

        if (existingDay) {
          existingDay.schedules.push(schedule)
        } else {
          acc.push({
            dayOfWeek: schedule.dayOfWeek,
            schedules: [schedule],
          })
        }

        return acc
      },
      [] as { dayOfWeek: number; schedules: Schedule[] }[],
    )

    return uniqueDays
      .map((dayGroup) => {
        const dayInfo = allDaysOfWeek.find((day) => day.id === dayGroup.dayOfWeek)
        return dayInfo ? { ...dayInfo, schedules: dayGroup.schedules } : null
      })
      .filter(Boolean)
      .sort((a, b) => a!.id - b!.id)
  }, [schedules, allDaysOfWeek])

  const mapProductToDailyMenuItem = (product: ProductoBDD): DailyMenuItem => ({
    id: product.id,
    name: product.nombre,
    imagen: product?.imagen,
    description: product.descripcion,
    price: Number.parseFloat(product.precio) || 0,
    available: product.disponible,
    image: product.imagen,
    estimatedDuration: product.plazoDuracionEstimadoMinutos,
    currencyId: product.currency_id,
    order: product.orderMenuDiario || 0,
  })

  const handleAddItem = (dayId: number, dayName: string) => {
    setSelectedDayId(dayId)
    setSelectedDayName(dayName)
    setEditingItem(null)
    setShowAddModal(true)
  }

  const handleEditItem = (dayId: number, dayName: string, item: DailyMenuItem) => {
    setSelectedDayId(dayId)
    setSelectedDayName(dayName)
    setEditingItem(item)
    setShowAddModal(true)
  }

  const handleSaveMenuItem = async (item: any) => {
    try {
      if (editingItem) {
        const resp = await api.products.update(editingItem?.id, {
          ...(item as any),
        })
        if (!resp.data?.ok) {
          throw new Error("Unknown error")
        }
      } else {
        const resp = await api.products.create({
          ...item,
          diaSemana: selectedDayId,
          isMenuDiario: true,
          orderMenuDiario: 1,
          nombre: item?.nombre,
          currency_id: item?.currency_id,
          precio: item?.precio,
          descripcion: item?.descripcion,
          categoryIds: [],
          plazoDuracionEstimadoMinutos: item?.plazoDuracionEstimadoMinutos,
          disponible: true,
          imagen: item?.imagen,
        })
        if (!resp.data?.ok) {
          throw new Error("Unknown error")
        }
      }

      await loadDailyMenus()
    } catch (error) {
      throw error
    }
  }

  const handleLoadClients = async (offset = 0, limit = values.limit, nombre = "", reset = true) => {
    setLoadingClients(true)
    try {
      const resp = await api.client.findWithOrders({
        offset,
        limit,
        query: nombre,
      })

      if (resp.ok) {
        setValues((prev) => ({
          ...prev,
          clients: reset ? resp.data : [...prev.clients, ...resp.data],
          offset: reset ? limit : offset + limit,
          totalItems: resp.totalItems ?? prev.totalItems,
        }))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingClients(false)
    }
  }

  // New function to handle search with debounce
  const handleSearchChange = (text: string) => {
    setSearchQuery(text)

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      handleLoadClients(0, values.limit, text, true)
    }, 500) // 500ms debounce

    setSearchTimeout(newTimeout)
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("")
    handleLoadClients(0, values.limit, "", true)
  }

  const handleToggleClientNotification = async (clientId: number, currentValue: boolean) => {
    setUpdatingNotification(clientId)
    try {
      const response = await api.client.updateNotificationPreference([{ id: clientId, notificar: currentValue }])
      console.log("response", response)

      if (response.ok) {
        setValues((prev) => ({
          ...prev,
          clients: prev.clients.map((client) =>
            client.id === clientId ? { ...client, notificar_menu: !currentValue } : client,
          ),
        }))

        showToast({
          status: "success",
          title: intl.formatMessage({
            id: "notificationPreferenceUpdated",
            defaultMessage: "Preferencia de notificación actualizada",
          }),
        })
      }
    } catch (error) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "errorUpdatingNotification",
          defaultMessage: "Error al actualizar preferencia",
        }),
      })
    } finally {
      setUpdatingNotification(null)
    }
  }

  const loadSchedules = async () => {
    try {
      setLoading(true)
      const response = await api.schedules.getAll()
      if (response) {
        setSchedules(response)
      }
    } catch (err: any) {
      showToast({
        status: "error",
        title:
          err?.response?.data?.message ??
          intl.formatMessage({
            id: "errorLoadingSchedules",
            defaultMessage: "Error al cargar horarios",
          }),
      })
    } finally {
      setLoading(false)
    }
  }

  const loadDailyMenus = async () => {
    try {
      setLoadingDailyMenus(true)
      const response = await api.products.findAllDailyMenu("")

      if (response && response.data) {
        const dailyMenuItems = response.data.filter(
          (product: ProductoBDD) =>
            product.isMenuDiario === true && product.diaSemana && product.diaSemana >= 1 && product.diaSemana <= 7,
        )

        setDailyMenuProducts(dailyMenuItems)
      }
    } catch (err: any) {
      console.error("Error loading daily menus:", err)
      showToast({
        status: "error",
        title:
          err?.response?.data?.message ??
          intl.formatMessage({
            id: "errorLoadingDailyMenus",
            defaultMessage: "Error al cargar menús diarios",
          }),
      })
    } finally {
      setLoadingDailyMenus(false)
    }
  }

  const initializeWeeklyMenu = useCallback(() => {
    if (activeDaysOfWeek.length === 0) return

    const initialMenu: DayMenu[] = activeDaysOfWeek.map((day) => {
      const dayProducts = dailyMenuProducts
        .filter((product) => {
          return product.diaSemana === day!.id && product.nombre && product.precio
        })
        .sort((a, b) => (a.orderMenuDiario || 0) - (b.orderMenuDiario || 0))
        .map(mapProductToDailyMenuItem)

      return {
        dayId: day!.id,
        dayName: day!.name,
        schedules: day!.schedules,
        items: dayProducts,
      }
    })
    setWeeklyMenu(initialMenu)
  }, [activeDaysOfWeek, dailyMenuProducts])

  useEffect(() => {
    loadSchedules()
    loadDailyMenus()
  }, [])

  useEffect(() => {
    if (schedules?.length > 0 && !loadingDailyMenus) {
      initializeWeeklyMenu()
    }
  }, [schedules, dailyMenuProducts, initializeWeeklyMenu, loadingDailyMenus])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const truncateText = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const handleDeleteRequest = useCallback(
    (dayId: number, itemId: number) => {
      setIsDeleting(true)

      setTimeout(async () => {
        try {
          await api.products.delete(itemId)

          setWeeklyMenu((prevMenu) =>
            prevMenu.map((day) =>
              day.dayId === dayId
                ? {
                    ...day,
                    items: day.items.filter((item) => item.id !== itemId),
                  }
                : day,
            ),
          )

          setIsDeleting(false)

          setTimeout(() => {
            showToast({
              title: intl.formatMessage({
                id: "itemDeletedSuccess",
                defaultMessage: "Producto eliminado del menú",
              }),
              status: "success",
            })
          }, 0)
        } catch (error: any) {
          showToast({
            title: intl.formatMessage({
              id: "errorDeletingItem",
              defaultMessage: "Error al eliminar producto",
            }),
            status: "error",
          })
        }
      }, 2700)
    },
    [intl, showToast],
  )

  const renderClientItem = ({ item: client }: { item: Cliente }) => (
    <View key={`client-${client.id}`} style={styles.clientNotificationItem}>
      <View style={styles.clientInfo}>
        <Avatar size="md" bg={Colors.light.primary} _text={{ color: "white", fontWeight: "bold" }}>
          {client.nombre.charAt(0).toUpperCase()}
        </Avatar>
        <View style={styles.clientDetails}>
          <Text style={styles.clientName}>{client.nombre}</Text>
          <Text style={styles.clientPhone}>{client.telefono}</Text>
        </View>
      </View>

      <View style={styles.notificationToggle}>
        {updatingNotification === client.id ? (
          <Spinner size="sm" color={Colors.light.primary} />
        ) : (
          <Switch
            isChecked={client.notificar_menu}
            onToggle={() => handleToggleClientNotification(client.id, client.notificar_menu)}
            size="md"
            colorScheme="primary"
          />
        )}
      </View>
    </View>
  )

  const renderSearchHeader = () => (
    <View style={styles.searchContainer}>
      <Input
        placeholder={intl.formatMessage({
          id: "searchClientsByName",
          defaultMessage: "Buscar clientes por nombre...",
        })}
        value={searchQuery}
        onChangeText={handleSearchChange}
        variant="filled"
        bg="gray.100"
        borderRadius="12"
        py="3"
        px="4"
        fontSize="14"
        InputLeftElement={<NBIcon as={<Feather name="search" />} size={5} ml="3" color="muted.400" />}
        InputRightElement={
          searchQuery ? (
            <TouchableOpacity onPress={handleClearSearch} style={{ marginRight: 12 }}>
              <Feather name="x" size={20} color={Colors.light.icon} />
            </TouchableOpacity>
          ) : undefined
        }
      />
    </View>
  )

  const renderNotificationSection = () => {
    console.log("user", user?.notificarMenuDiario)
    const isEnabled = user?.notificarMenuDiario === true

    return (
      <View style={[styles.notificationSection, !isEnabled && styles.disabledSection]}>
        <View style={styles.notificationHeader}>
          <MaterialIcons name="notifications" size={20} color={isEnabled ? Colors.light.primary : Colors.light.icon} />
          <Text style={[styles.notificationTitle, !isEnabled && styles.disabledText]}>
            <FormattedMessage id="clientNotificationTitle" defaultMessage="Aquí puedes ver los clientes a notificar" />
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.notificationButton, !isEnabled && styles.disabledButton]}
          onPress={() => {
            if (isEnabled) {
              setShowNotificationModal(true)
              handleLoadClients()
            }
          }}
          disabled={!isEnabled}
          activeOpacity={0.7}
        >
          <MaterialIcons name="people" size={18} color={isEnabled ? Colors.light.primary : Colors.light.icon} />
          <Text style={[styles.notificationButtonText, !isEnabled && styles.disabledText]}>
            <FormattedMessage id="manageNotifications" defaultMessage="Gestionar notificaciones" />
          </Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={14}
            color={isEnabled ? Colors.light.primary : Colors.light.icon}
          />
        </TouchableOpacity>

        {!isEnabled && (
          <Text style={styles.disabledHint}>
            <FormattedMessage
              id="notificationDisabledHint"
              defaultMessage="Las notificaciones del menú diario están deshabilitadas"
            />
          </Text>
        )}
      </View>
    )
  }

  const renderMenuItem = (item: DailyMenuItem, dayId: number, dayName: string) => {
    return (
      <View key={`menu-item-${dayId}-${item.id}`} style={styles.menuItemCard}>
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemIcon}>
            {typeof item?.imagen === "string" && item?.imagen !== "0" ? (
              <Image
                source={{ uri: item?.imagen }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  objectFit: "cover",
                }}
                alt={item.name}
              />
            ) : (
              <Icon name="cutlery" size={20} color={Colors.light.primary} />
            )}
          </View>

          <View style={styles.menuItemInfo}>
            <Text style={styles.menuItemName}>{item.name}</Text>
            <Text style={styles.menuItemDescription}>{truncateText(item.description, 45)}</Text>
            <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
          </View>

          <View style={styles.menuItemActions}>
            <TouchableOpacity
              style={styles.editItemButton}
              onPress={() => handleEditItem(dayId, dayName, item)}
              activeOpacity={0.7}
            >
              <Icon name="edit" size={16} color={Colors.light.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteItemButton}
              onPress={() => {
                setDeleteOpen(true)
                setDeleteOrderId(item?.id)
                setSelectedDayId(dayId)
              }}
              activeOpacity={0.7}
            >
              <Icon name="trash" size={16} color={Colors.light.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const renderScheduleInfo = (schedules: Schedule[]) => {
    const formatTime = (time: string) => {
      if (!time) return ""

      if (time.includes(":")) {
        const parts = time.split(":")
        return `${parts[0]}:${parts[1]}`
      }

      return time
    }

    if (schedules?.length === 1) {
      return `${formatTime(schedules[0].hora_inicio)} - ${formatTime(schedules[0].hora_fin)}`
    }

    return schedules
      .map((schedule) => `${formatTime(schedule.hora_inicio)} - ${formatTime(schedule.hora_fin)}`)
      .join(", ")
  }

  const renderDayCard = (day: DayMenu) => (
    <View key={`day-${day.dayId}`} style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <View style={styles.dayTitleContainer}>
          <Text style={styles.dayTitle}>{day.dayName}</Text>
          <Text style={styles.daySchedule}>{renderScheduleInfo(day.schedules)}</Text>
        </View>
        <TouchableOpacity
          style={styles.addItemButton}
          onPress={() => {
            handleAddItem(day.dayId, day.dayName)
          }}
          activeOpacity={0.7}
        >
          <Icon name="plus" size={14} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {day.items.length > 0 ? (
        <View style={styles.menuItemsContainer}>
          {day.items.map((item) => {
            return renderMenuItem(item, day.dayId, day.dayName)
          })}
        </View>
      ) : (
        <View style={styles.emptyDayContainer}>
          <Icon name="cutlery" size={24} color={Colors.light.icon} />
          <Text style={styles.emptyDayText}>
            <FormattedMessage id="noDailyMenuItems" defaultMessage="No hay productos para este día" />
          </Text>
        </View>
      )}
    </View>
  )

  if (loading || loadingDailyMenus) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner size="lg" color={Colors.light.primary} />
        <Text style={{ marginTop: 16, color: Colors.light.text }}>
          <FormattedMessage
            id={loading ? "loadingSchedules" : "loadingDailyMenus"}
            defaultMessage={loading ? "Cargando horarios..." : "Cargando menús diarios..."}
          />
        </Text>
      </View>
    )
  }

  if (schedules?.length === 0) {
    return (
      <View style={{ flex: 1, paddingHorizontal: 6 }}>
        <Animatable.View animation="fadeIn" style={[styles.emptyStateContainer, { flex: 1, justifyContent: "center" }]}>
          <LottieView
            source={require("../../../constants/Animation-empty-box.json")}
            autoPlay
            loop
            style={styles.emptyStateAnimation}
          />
          <Text style={styles.emptyStateTitle}>
            <FormattedMessage id="noSchedulesConfigured" defaultMessage="No hay horarios configurados" />
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            <FormattedMessage
              id="configureSchedulesFirst"
              defaultMessage="Configura primero los horarios de tu negocio para gestionar el menú diario"
            />
          </Text>
        </Animatable.View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 6 }}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              try {
                setRefreshing(true)
                await Promise.all([loadSchedules(), loadDailyMenus()])
              } catch (error) {
                console.log(error)
              } finally {
                setRefreshing(false)
              }
            }}
            tintColor={Colors.light.primary}
          />
        }
      >
        {/* Notification Management Section */}
        {renderNotificationSection()}

        {weeklyMenu.map((day) => renderDayCard(day))}
      </ScrollView>

      <AddOrEditDailyMenu
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingItem(null)
        }}
        onSave={handleSaveMenuItem}
        editingItem={editingItem}
        dayId={selectedDayId ?? 0}
        dayName={selectedDayName}
      />

      {deleteOpen && deleteOrderId && selectedDayId && (
        <ModalConfirmAction
          isOpen={deleteOpen}
          onClose={() => {
            setDeleteOpen(false)
            setDeleteOrderId(0)
            setSelectedDayId(null)
          }}
          title={intl.formatMessage({ id: "modalDelete.deleteProduct" })}
          message={intl.formatMessage({
            id: "modalDelete.deleteProductMessage",
          })}
          loading={isDeleting}
          onContinue={async () => {
            await handleDeleteRequest(Number(selectedDayId ?? 0), deleteOrderId)
          }}
        />
      )}

      <GenericModal
        visible={showNotificationModal}
        onClose={() => {
          setShowNotificationModal(false)
          setSearchQuery("")
          handleLoadClients(0, values.limit, "", true)
        }}
        title={intl.formatMessage({
          id: "manageClientNotifications",
          defaultMessage: "Gestionar notificaciones de clientes",
        })}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalDescription}>
            <FormattedMessage
              id="notificationModalDescription"
              defaultMessage="Selecciona qué clientes recibirán notificaciones del menú diario"
            />
          </Text>

          {/* Search Header */}
          {renderSearchHeader()}

          {loadingClients && values.clients.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Spinner size="lg" color={Colors.light.primary} />
              <Text style={styles.loadingText}>
                <FormattedMessage id="loadingClients" defaultMessage="Cargando clientes..." />
              </Text>
            </View>
          ) : (
            <FlatList
              data={values.clients}
              renderItem={renderClientItem}
              keyExtractor={(item) => `client-notification-${item.id}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.clientsList}
              onEndReached={() => {
                if (values.clients.length < values.totalItems && !loadingClients) {
                  handleLoadClients(values.offset, values.limit, searchQuery, false)
                }
              }}
              onEndReachedThreshold={0.1}
              ListFooterComponent={() =>
                loadingClients && values.clients.length > 0 ? (
                  <View style={styles.footerLoader}>
                    <Spinner size="sm" color={Colors.light.primary} />
                  </View>
                ) : null
              }
              ListEmptyComponent={() => (
                <View style={styles.emptyClients}>
                  <MaterialIcons name="people-outline" size={48} color={Colors.light.icon} />
                  <Text style={styles.emptyClientsText}>
                    <FormattedMessage
                      id="noClientsFound"
                      defaultMessage={searchQuery ? "No se encontraron clientes" : "No hay clientes"}
                    />
                  </Text>
                  {searchQuery && (
                    <Text style={styles.emptyClientsSubtext}>
                      <FormattedMessage
                        id="tryDifferentSearch"
                        defaultMessage="Intenta con un término de búsqueda diferente"
                      />
                    </Text>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </GenericModal>
    </View>
  )
}

export default DailyMenuTab
