import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  Spinner,
  Avatar,
  Image,
  Switch,
  FlatList,
  Input,
  Icon as NBIcon,
} from "native-base";
import { TouchableOpacity, RefreshControl } from "react-native";
import { styles } from "./ProductosStyles";
import { FormattedMessage, useIntl } from "react-intl";
import Icon from "react-native-vector-icons/FontAwesome";
import { Colors } from "../../../constants/Colors";
import { useToastContext } from "@/contexts/ToastContext";
import type { Schedule } from "../SchedulesView/SchedulesView";
import api from "@/services/api/admin";
import AddOrEditDailyMenu from "../AddOrEditDailyMenu/AddOrEditDailyMenu";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import type { Cliente } from "../Clients/types";
import { useUser } from "@/hooks/redux/useUser";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import GenericModal from "../ConfigAccount/components/GenericModal/GenericModal";
import ScheduleModal from "./ScheduleModal";
import { formatTime } from "@/utils/date";

interface ProductoBDD {
  id: number;
  nombre: string;
  precio: string;
  imagen: string;
  descripcion: string;
  plazoDuracionEstimadoMinutos: number;
  disponible: boolean;
  currency_id: number;
  isMenuDiario: boolean;
  orderMenuDiario: number;
  diaSemana: number;
  empresa_id: number;
  category?: any[];
}

interface DailyMenuItem {
  id: number;
  imagen?: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image?: string;
  estimatedDuration: number;
  currencyId: number;
  order: number;
}

interface DayMenu {
  dayId: number;
  dayName: string;
  schedules: Schedule[];
  items: DailyMenuItem[];
}

interface IValues {
  offset: number;
  limit: number;
  clients: Cliente[];
  totalItems: number;
}

const initialState = {
  offset: 0,
  limit: 10,
  clients: [],
  totalItems: 0,
};

const DailyMenuTab = () => {
  const intl = useIntl();
  const { showToast } = useToastContext();
  const { user } = useUser();

  const [refreshing, setRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteAnimationRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingDailyMenus, setLoadingDailyMenus] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [dailyMenuProducts, setDailyMenuProducts] = useState<ProductoBDD[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<DayMenu[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [selectedDayName, setSelectedDayName] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(0);
  const [loadingClients, setLoadingClients] = useState(false);
  const [values, setValues] = useState<IValues>(initialState);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [updatingNotification, setUpdatingNotification] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // New states for schedule management
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedScheduleDayId, setSelectedScheduleDayId] = useState<
    number | null
  >(null);
  const [selectedScheduleDayName, setSelectedScheduleDayName] =
    useState<string>("");

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
    [intl]
  );

  const activeDaysOfWeek = useMemo(() => {
    // Always show all days, but mark which ones have schedules
    return allDaysOfWeek.map((day) => {
      const daySchedules = schedules.filter(
        (schedule) => schedule.dayOfWeek === day.id
      );
      return {
        ...day,
        schedules: daySchedules,
        hasSchedules: daySchedules.length > 0,
      };
    });
  }, [schedules, allDaysOfWeek]);

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
  });

  const handleAddItem = (dayId: number, dayName: string) => {
    setSelectedDayId(dayId);
    setSelectedDayName(dayName);
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleEditItem = (
    dayId: number,
    dayName: string,
    item: DailyMenuItem
  ) => {
    setSelectedDayId(dayId);
    setSelectedDayName(dayName);
    setEditingItem(item);
    setShowAddModal(true);
  };

  // New functions for schedule management
  const handleAddSchedule = (dayId: number, dayName: string) => {
    setSelectedScheduleDayId(dayId);
    setSelectedScheduleDayName(dayName);
    setEditingSchedule(null);
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (schedule: Schedule, dayName: string) => {
    setSelectedScheduleDayId(schedule.dayOfWeek);
    setSelectedScheduleDayName(dayName);
    setEditingSchedule(schedule);
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = async (scheduleData: Schedule) => {
    try {
      if (editingSchedule?.id) {
        const response = await api.schedules.updateDailySchedule(
          editingSchedule.id,
          scheduleData
        );
        if (response.ok) {
          showToast({
            status: "success",
            title: intl.formatMessage({
              id: "schedule.updateSuccess",
              defaultMessage: "Horario actualizado correctamente",
            }),
          });
        }
      } else {
        const response = await api.schedules.createDailySchedule(scheduleData);
        if (response.ok) {
          showToast({
            status: "success",
            title: intl.formatMessage({
              id: "schedule.createSuccess",
              defaultMessage: "Horario creado correctamente",
            }),
          });
        }
      }
      await loadSchedules();
    } catch (error: any) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "schedule.saveError",
          defaultMessage: "Error al guardar el horario",
        }),
      });
      throw error;
    }
  };

  const handleSaveMenuItem = async (item: any) => {
    try {
      if (editingItem) {
        const resp = await api.products.update(editingItem?.id, {
          ...(item as any),
        });
        if (!resp.data?.ok) {
          throw new Error("Unknown error");
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
        });
        if (!resp.data?.ok) {
          throw new Error("Unknown error");
        }
      }
      await loadDailyMenus();
    } catch (error) {
      throw error;
    }
  };

  const handleLoadClients = async (
    offset = 0,
    limit = values.limit,
    nombre = "",
    reset = true
  ) => {
    setLoadingClients(true);
    try {
      const resp = await api.client.findWithOrders({
        offset,
        limit,
        query: nombre,
      });
      if (resp.ok) {
        setValues((prev) => ({
          ...prev,
          clients: reset ? resp.data : [...prev.clients, ...resp.data],
          offset: reset ? limit : offset + limit,
          totalItems: resp.totalItems ?? prev.totalItems,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const newTimeout = setTimeout(() => {
      handleLoadClients(0, values.limit, text, true);
    }, 500);
    setSearchTimeout(newTimeout);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    handleLoadClients(0, values.limit, "", true);
  };

  const handleToggleClientNotification = async (
    clientId: number,
    currentValue: boolean
  ) => {
    setUpdatingNotification(clientId);
    try {
      const response = await api.client.updateNotificationPreference([
        { id: clientId, notificar: currentValue },
      ]);
      if (response.ok) {
        setValues((prev) => ({
          ...prev,
          clients: prev.clients.map((client) =>
            client.id === clientId
              ? { ...client, notificar_menu: !currentValue }
              : client
          ),
        }));
        showToast({
          status: "success",
          title: intl.formatMessage({
            id: "notificationPreferenceUpdated",
            defaultMessage: "Preferencia de notificación actualizada",
          }),
        });
      }
    } catch (error) {
      showToast({
        status: "error",
        title: intl.formatMessage({
          id: "errorUpdatingNotification",
          defaultMessage: "Error al actualizar preferencia",
        }),
      });
    } finally {
      setUpdatingNotification(null);
    }
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);
      // Changed from getAll() to getAllDailyMenu()
      const response = await api.schedules.getAllDailyMenu();
      if (response) {
        setSchedules(response);
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
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDailyMenus = async () => {
    try {
      setLoadingDailyMenus(true);
      const response = await api.products.findAllDailyMenu("");
      if (response && response.data) {
        const dailyMenuItems = response.data.filter(
          (product: ProductoBDD) =>
            product.isMenuDiario === true &&
            product.diaSemana &&
            product.diaSemana >= 1 &&
            product.diaSemana <= 7
        );
        setDailyMenuProducts(dailyMenuItems);
      }
    } catch (err: any) {
      console.error("Error loading daily menus:", err);
      showToast({
        status: "error",
        title:
          err?.response?.data?.message ??
          intl.formatMessage({
            id: "errorLoadingDailyMenus",
            defaultMessage: "Error al cargar menús diarios",
          }),
      });
    } finally {
      setLoadingDailyMenus(false);
    }
  };

  const initializeWeeklyMenu = useCallback(() => {
    const initialMenu: DayMenu[] = activeDaysOfWeek.map((day) => {
      const dayProducts = dailyMenuProducts
        .filter((product) => {
          return (
            product.diaSemana === day!.id && product.nombre && product.precio
          );
        })
        .sort((a, b) => (a.orderMenuDiario || 0) - (b.orderMenuDiario || 0))
        .map(mapProductToDailyMenuItem);

      return {
        dayId: day!.id,
        dayName: day!.name,
        schedules: day!.schedules,
        items: dayProducts,
      };
    });
    setWeeklyMenu(initialMenu);
  }, [activeDaysOfWeek, dailyMenuProducts]);

  useEffect(() => {
    loadSchedules();
    loadDailyMenus();
  }, []);

  useEffect(() => {
    if (!loadingDailyMenus) {
      initializeWeeklyMenu();
    }
  }, [schedules, dailyMenuProducts, initializeWeeklyMenu, loadingDailyMenus]);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const truncateText = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleDeleteRequest = useCallback(
    (dayId: number, itemId: number) => {
      setIsDeleting(true);
      setTimeout(async () => {
        try {
          await api.products.delete(itemId);
          setWeeklyMenu((prevMenu) =>
            prevMenu.map((day) =>
              day.dayId === dayId
                ? {
                    ...day,
                    items: day.items.filter((item) => item.id !== itemId),
                  }
                : day
            )
          );
          setIsDeleting(false);
          setTimeout(() => {
            showToast({
              title: intl.formatMessage({
                id: "itemDeletedSuccess",
                defaultMessage: "Producto eliminado del menú",
              }),
              status: "success",
            });
          }, 0);
        } catch (error: any) {
          showToast({
            title: intl.formatMessage({
              id: "errorDeletingItem",
              defaultMessage: "Error al eliminar producto",
            }),
            status: "error",
          });
        }
      }, 2700);
    },
    [intl, showToast]
  );

  const renderClientItem = ({ item: client }: { item: Cliente }) => (
    <View key={`client-${client.id}`} style={styles.clientNotificationItem}>
      <View style={styles.clientInfo}>
        <Avatar
          size="md"
          bg={Colors.light.primary}
          _text={{ color: "white", fontWeight: "bold" }}
        >
          {client.nombre.charAt(0).toUpperCase()}
        </Avatar>
        <View style={styles.clientDetails}>
          <Text allowFontScaling={false} style={styles.clientName}>{client.nombre}</Text>
          <Text allowFontScaling={false} style={styles.clientPhone}>{client.telefono}</Text>
        </View>
      </View>
      <View style={styles.notificationToggle}>
        {updatingNotification === client.id ? (
          <Spinner size="sm" color={Colors.light.primary} />
        ) : (
          <Switch
            isChecked={client.notificar_menu}
            onToggle={() =>
              handleToggleClientNotification(client.id, client.notificar_menu)
            }
            size="md"
            colorScheme="primary"
          />
        )}
      </View>
    </View>
  );

  const renderSearchHeader = () => (
    <View style={styles.searchContainer}>
      <Input
        allowFontScaling={false}
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
        InputLeftElement={
          <NBIcon
            as={<Feather name="search" />}
            size={5}
            ml="3"
            color="muted.400"
          />
        }
        InputRightElement={
          searchQuery ? (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={{ marginRight: 12 }}
            >
              <Feather name="x" size={20} color={Colors.light.icon} />
            </TouchableOpacity>
          ) : undefined
        }
      />
    </View>
  );

  const renderNotificationSection = () => {
    const isEnabled = user?.notificarMenuDiario === true;

    return (
      <View
        style={[
          styles.notificationSection,
          !isEnabled && styles.disabledSection,
        ]}
      >
        <View style={styles.notificationHeader}>
          <MaterialIcons
            name="notifications"
            size={20}
            color={isEnabled ? Colors.light.primary : Colors.light.icon}
          />
          <Text allowFontScaling={false}
            style={[
              styles.notificationTitle,
              !isEnabled && styles.disabledText,
            ]}
          >
            <FormattedMessage
              id="clientNotificationTitle"
              defaultMessage="Aquí puedes ver los clientes a notificar"
            />
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.notificationButton,
            !isEnabled && styles.disabledButton,
          ]}
          onPress={() => {
            if (isEnabled) {
              setShowNotificationModal(true);
              handleLoadClients();
            }
          }}
          disabled={!isEnabled}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="people"
            size={18}
            color={isEnabled ? Colors.light.primary : Colors.light.icon}
          />
          <Text allowFontScaling={false}
            style={[
              styles.notificationButtonText,
              !isEnabled && styles.disabledText,
            ]}
          >
            <FormattedMessage
              id="manageNotifications"
              defaultMessage="Gestionar notificaciones"
            />
          </Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={14}
            color={isEnabled ? Colors.light.primary : Colors.light.icon}
          />
        </TouchableOpacity>
        {!isEnabled && (
          <Text allowFontScaling={false} style={styles.disabledHint}>
            <FormattedMessage
              id="notificationDisabledHint"
              defaultMessage="Las notificaciones del menú diario están deshabilitadas"
            />
          </Text>
        )}
      </View>
    );
  };

  const renderMenuItem = (
    item: DailyMenuItem,
    dayId: number,
    dayName: string
  ) => {
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
            <Text allowFontScaling={false} style={styles.menuItemName}>{item.name}</Text>
            <Text allowFontScaling={false} style={styles.menuItemDescription}>
              {truncateText(item.description, 45)}
            </Text>
            <Text allowFontScaling={false} style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
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
                setDeleteOpen(true);
                setDeleteOrderId(item?.id);
                setSelectedDayId(dayId);
              }}
              activeOpacity={0.7}
            >
              <Icon name="trash" size={16} color={Colors.light.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderScheduleInfo = (schedules: Schedule[]) => {

    if (schedules?.length === 0) {
      return intl.formatMessage({
        id: "schedule.noSchedules",
        defaultMessage: "Sin horarios configurados",
      });
    }

    if (schedules?.length === 1) {
      return `${formatTime(schedules[0].hora_inicio)} - ${formatTime(schedules[0].hora_fin)}`;
    }

    return schedules
      .map(
        (schedule) =>
          `${formatTime(schedule.hora_inicio)} - ${formatTime(schedule.hora_fin)}`
      )
      .join(", ");
  };

  const renderScheduleActions = (day: any) => (
    <View style={styles.scheduleActions}>
      {day.schedules.length > 0 && (
        <TouchableOpacity
          style={styles.editScheduleButton}
          onPress={() => handleEditSchedule(day.schedules[0], day.name)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="edit" size={16} color={Colors.light.secondary} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.addScheduleButton}
        onPress={() => handleAddSchedule(day.id, day.name)}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="access-time"
          size={16}
          color={Colors.light.primary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderDayCard = (day: DayMenu) => {
    const dayInfo = activeDaysOfWeek.find((d) => d.id === day.dayId);
    const hasSchedules = dayInfo?.hasSchedules || false;

    return (
      <View key={`day-${day.dayId}`} style={styles.dayCard}>
        <View style={styles.dayHeader}>
          <View style={styles.dayTitleContainer}>
            <Text allowFontScaling={false} style={styles.dayTitle}>{day.dayName}</Text>
            <View style={styles.scheduleContainer}>
              <Text allowFontScaling={false}
                style={[
                  styles.daySchedule,
                  !hasSchedules && styles.noScheduleText,
                ]}
              >
                {renderScheduleInfo(day.schedules)}
              </Text>
              {renderScheduleActions(dayInfo)}
            </View>
          </View>
          {hasSchedules && (
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => {
                handleAddItem(day.dayId, day.dayName);
              }}
              activeOpacity={0.7}
            >
              <Icon name="plus" size={14} color={Colors.light.primary} />
            </TouchableOpacity>
          )}
        </View>

        {!hasSchedules ? (
          <View style={styles.noScheduleContainer}>
            <MaterialIcons
              name="access-time"
              size={32}
              color={Colors.light.icon}
            />
            <Text allowFontScaling={false} style={styles.noScheduleTitle}>
              <FormattedMessage
                id="schedule.noScheduleForDay"
                defaultMessage="Sin horarios configurados"
              />
            </Text>
            <Text allowFontScaling={false} style={styles.noScheduleSubtitle}>
              <FormattedMessage
                id="schedule.addScheduleToEnableMenu"
                defaultMessage="Agrega un horario para habilitar el menú de este día"
              />
            </Text>
          </View>
        ) : day.items.length > 0 ? (
          <View style={styles.menuItemsContainer}>
            {day.items.map((item) => {
              return renderMenuItem(item, day.dayId, day.dayName);
            })}
          </View>
        ) : (
          <View style={styles.emptyDayContainer}>
            <Icon name="cutlery" size={24} color={Colors.light.icon} />
            <Text allowFontScaling={false} style={styles.emptyDayText}>
              <FormattedMessage
                id="noDailyMenuItems"
                defaultMessage="No hay productos para este día"
              />
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading || loadingDailyMenus) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner size="lg" color={Colors.light.primary} />
        <Text allowFontScaling={false} style={{ marginTop: 16, color: Colors.light.text }}>
          <FormattedMessage
            id={loading ? "loadingSchedules" : "loadingDailyMenus"}
            defaultMessage={
              loading ? "Cargando horarios..." : "Cargando menús diarios..."
            }
          />
        </Text>
      </View>
    );
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
                setRefreshing(true);
                await Promise.all([loadSchedules(), loadDailyMenus()]);
              } catch (error) {
                console.log(error);
              } finally {
                setRefreshing(false);
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
          setShowAddModal(false);
          setEditingItem(null);
        }}
        onSave={handleSaveMenuItem}
        editingItem={editingItem}
        dayId={selectedDayId ?? 0}
        dayName={selectedDayName}
      />

      <ScheduleModal
        visible={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setEditingSchedule(null);
        }}
        onSave={handleSaveSchedule as any}
        editingSchedule={editingSchedule}
        dayId={selectedScheduleDayId ?? 0}
        dayName={selectedScheduleDayName}
      />

      {deleteOpen && deleteOrderId && selectedDayId && (
        <ModalConfirmAction
          isOpen={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setDeleteOrderId(0);
            setSelectedDayId(null);
          }}
          title={intl.formatMessage({ id: "modalDelete.deleteProduct" })}
          message={intl.formatMessage({
            id: "modalDelete.deleteProductMessage",
          })}
          loading={isDeleting}
          onContinue={async () => {
            await handleDeleteRequest(
              Number(selectedDayId ?? 0),
              deleteOrderId
            );
          }}
        />
      )}

      <GenericModal
        visible={showNotificationModal}
        onClose={() => {
          setShowNotificationModal(false);
          setSearchQuery("");
          handleLoadClients(0, values.limit, "", true);
        }}
        title={intl.formatMessage({
          id: "manageClientNotifications",
          defaultMessage: "Gestionar notificaciones de clientes",
        })}
      >
        <View style={styles.modalContent}>
          <Text allowFontScaling={false} style={styles.modalDescription}>
            <FormattedMessage
              id="notificationModalDescription"
              defaultMessage="Selecciona qué clientes recibirán notificaciones del menú diario"
            />
          </Text>

          {renderSearchHeader()}

          {loadingClients && values.clients.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Spinner size="lg" color={Colors.light.primary} />
              <Text allowFontScaling={false} style={styles.loadingText}>
                <FormattedMessage
                  id="loadingClients"
                  defaultMessage="Cargando clientes..."
                />
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
                if (
                  values.clients.length < values.totalItems &&
                  !loadingClients
                ) {
                  handleLoadClients(
                    values.offset,
                    values.limit,
                    searchQuery,
                    false
                  );
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
                  <MaterialIcons
                    name="people-outline"
                    size={48}
                    color={Colors.light.icon}
                  />
                  <Text allowFontScaling={false} style={styles.emptyClientsText}>
                    <FormattedMessage
                      id="noClientsFound"
                      defaultMessage={
                        searchQuery
                          ? "No se encontraron clientes"
                          : "No hay clientes"
                      }
                    />
                  </Text>
                  {searchQuery && (
                    <Text allowFontScaling={false} style={styles.emptyClientsSubtext}>
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
  );
};

export default DailyMenuTab;
