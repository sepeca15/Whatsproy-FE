import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  UIManager,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import moment from "moment";
import "moment/locale/es";
import { ID_TIPOSERVICIO_RESERVA, ID_TIPOSERVICIO_RESERVA_ESPACIO } from "@/services/api/tiposervicio/tiposervicio.type";
import api from "@/services/api/admin";
import ItemCalendar from "./components/ItemCalendar";
import * as Progress from "react-native-progress";
import CreateOrderModal from "@/components/CreateOrderModal";
import { FormattedMessage, useIntl } from "react-intl";
import { useToastContext } from "@/contexts/ToastContext";
import { Animated as AnimatedNative, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ordenarPedidosPorHora, type OrderPerDays } from "@/utils/date";
import { useUser } from "@/hooks/redux/useUser";
import type { WorkerUser } from "@/services/api/user/user.types";
import { SafeAreaView } from "react-native-safe-area-context";
import WorkerSelect from "@/components/WorkerSelect/WorkerSelect";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import DatePickerModal from "./components/DatePickerModal/DatePickerModal";
import { LinearGradient } from "expo-linear-gradient";
import AddButton from "@/hooks/add_Button/Add_button";
import { Espacio } from "@/services/api/espacio/types";
import EspacioSelect from "@/components/EspacioSelect/EspacioSelect";

const primaryColor = "#075e54";
const secondaryColor = "#128c7e";

const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    primary: primaryColor,
    secondary: secondaryColor,
    warning: "#F39C12",
    border: "#e1e1e1",
    success: "#2ECC71",
    error: "#ef4444",
    textSecondary: "#000",
    danger: "#E74C3C",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: primaryColor,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    danger: "#E74C3C",
    primary: primaryColor,
    success: "#2ECC71",
    border: "#e1e1e1",
    textSecondary: "#FFF",
    error: "#ef4444",
    secondary: secondaryColor,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryColor,
  },
};

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CalendarView() {
  const [orderPerDaysAll, setOrderPerDays] = useState<OrderPerDays>({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false); // Nuevo estado para el modal de horarios
  const [daySchedules, setDaySchedules] = useState<any[]>([]); // Estado para los horarios del día
  const [loadingSchedules, setLoadingSchedules] = useState(false); // Estado de carga para horarios
  const spinAnim = useRef(new AnimatedNative.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const { showToast } = useToastContext();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(
    moment.tz(user.timeZone).format("YYYY-MM-DD")
  );


  const [calendarData, setCalendarData] = useState<{
    workers: WorkerUser[];
    espacios: Espacio[];
  }>({ workers: [], espacios: [] });

  const [selectedWorkerId, setSelectedWorkerId] = useState<any | undefined>();
  const [selectedEspacio, setSelectedEspacio] = useState<any | undefined>();
  const [loadingCalendarData, setLoadingCalendarData] = useState(false);

  const [horarios, setHorarios] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<any>("");
  const [selectedYear, setSelectedYear] = useState<any>("");
  const [disabledDates, setDisabledDates] = useState<any>({});
  const [oredrToDelete, setOrderToDelete] = useState<any>(null);
  const orderPerDays = ordenarPedidosPorHora(orderPerDaysAll);

  const [ordrDeleteModalConfirm, setOrdrDeleteModalConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const intl = useIntl();
  const [loadingCalendarCupos, setLoadingCalendarCupos] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleOpenModal = () => setOpenAddModal((prev) => !prev);

  // Nueva función para cargar horarios del día
  const handleLoadDaySchedules = async () => {
    try {
      setLoadingSchedules(true);

      const response = await api.order.getNextDateAvailableForSingleDay(selectedDate, selectedWorkerId);

      if (response) {
        setDaySchedules(response || []);
        setShowScheduleModal(true);
      }
    } catch (error) {
      console.error("Error loading day schedules:", error);
      showToast({
        title: "Error",
        description: "No se pudieron cargar los horarios del día",
        status: "error",
      });
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      const date = moment(selectedDate);
      setSelectedMonth(date.month() + 1);
      setSelectedYear(date.year());
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      handleLoadDisabledDates();
    }
  }, [selectedMonth, selectedYear]);

  const handleLoadCalendarData = async () => {
    try {
      setLoadingCalendarData(true);

      let espacios: Espacio[] = [];
      let workers: WorkerUser[] = [];

      if (user.tipo_servicio === ID_TIPOSERVICIO_RESERVA_ESPACIO) {
        const espaciosRes = await api.espacio.findAll();
        espacios = espaciosRes || [];
      } else {
        const workersRes = await api.user.findWorkers(user?.id_empresa);
        workers = workersRes?.data || [];
      }

      setCalendarData({ espacios, workers });

      if (espacios.length > 0) {
        setSelectedEspacio(espacios[0].id);
      }

      if (workers.length > 0) {
        setSelectedWorkerId(workers[0].id);
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Error",
        description: "Error al cargar datos del calendario",
        status: "error",
      });
    } finally {
      setLoadingCalendarData(false);
    }
  };

  const handleLoadDisabledDates = async () => {
    try {
      setLoadingCalendarCupos(true);
      const availableDates = await api.order.getAvailableDatesByMonth(
        selectedYear,
        selectedMonth,
        user?.id
      );
      const disabledDatesCurrentMonth: any = {};
      (availableDates as any[]).forEach((itm) => {
        if (itm?.cuposDisponibles === 0) {
          disabledDatesCurrentMonth[itm?.fecha] = true;
        }
      });
      setDisabledDates(disabledDatesCurrentMonth);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCalendarCupos(false);
    }
  };

  const handleLoadHorarios = async () => {
    try {
      setLoading(true);
      const dataHorarios = await api.user.findHorarios();
      setHorarios(dataHorarios);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startSpin = () => {
    spinAnim.setValue(0);
    AnimatedNative.loop(
      AnimatedNative.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSpin = () => {
    spinAnim.stopAnimation(() => {
      spinAnim.setValue(0);
    });
  };

  const onRefresh = async () => {
    startSpin();
    await onLoadItems(selectedDate);
    stopSpin();
  };

  const onLoadItems = async (dateString: string) => {
    setLoading(true);
    try {
      const idSelected = user.tipo_servicio === ID_TIPOSERVICIO_RESERVA_ESPACIO? selectedEspacio : selectedWorkerId
      
      const data = await api.order.getCalendarOrders(dateString, idSelected, user?.tipo_servicio === ID_TIPOSERVICIO_RESERVA_ESPACIO );
      const availableDatesResponse = await api.order.getAvailableDates(
        dateString,
        idSelected
      );
      if (availableDatesResponse?.length > 0) {
        setAvailableDates(availableDatesResponse);
      }
      setOrderPerDays(data.data);
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (orderId: number) => {
    try {
      const data = await api.order.confirm(orderId);
      showToast({
        title: "¡Evento confirmado!",
        description: "Su reserva fue confirmado exitosamente.",
        status: "success",
      });
      if (data.data) {
        setOrderPerDays((prevState) => {
          const updatedOrdersForSelectedDate = prevState[selectedDate]?.map((order) =>
            order.orderId === orderId ? { ...order, status: true } : order
          );
          return {
            ...prevState,
            [selectedDate]: updatedOrdersForSelectedDate || [],
          };
        });
      }
    } catch (error: any) {
      console.log("nooo", error.response.data.message);
    }
  };

  const deleteOrder = async (orderId: number) => {
    try {
      setLoadingDelete(true);
      const data = await api.order.remove(orderId);
      showToast({
        title: "¡Evento cancelado!",
        description: "Su reserva fue cancelado exitosamente.",
        status: "success",
      });
      if (data) {
        setOrderPerDays((prevState) => {
          const updatedListForSelectedDate = prevState[selectedDate]?.filter(
            (order) => order.orderId !== orderId
          );
          return {
            ...prevState,
            [selectedDate]: updatedListForSelectedDate || [],
          };
        });
        setOrdrDeleteModalConfirm(false);
        setOrderToDelete(null);
        setReason("");
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    if (user?.id_empresa) {
      handleLoadCalendarData();
      handleLoadHorarios();
    }
  }, [user?.id_empresa]);

  useEffect(() => {
    if (selectedDate && (selectedWorkerId || selectedEspacio)) {
      onLoadItems(selectedDate);
    }
  }, [selectedDate, selectedWorkerId, selectedEspacio]);

  const handleDateChange = useCallback((newDate: Date) => {
    const formattedDate = moment(newDate)
      .tz(user.timeZone)
      .format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setShowDatePicker(false);
  }, [user.timeZone]);

  const handlePreviousDay = useCallback(() => {
    const prevDay = moment(selectedDate)
      .tz(user.timeZone)
      .subtract(1, "day")
      .toISOString()
      .split("T")[0];
    setSelectedDate(prevDay);
  }, [selectedDate]);

  const handleNextDay = useCallback(() => {
    const nextDay = moment(selectedDate)
      .tz(user.timeZone)
      .add(1, "day")
      .toISOString()
      .split("T")[0];
    setSelectedDate(nextDay);
  }, [selectedDate]);

  const isCurrentDayDisabled = disabledDates[selectedDate];
  const eventsCount = orderPerDays[selectedDate]?.length || 0;
  const confirmedCount =
    orderPerDays[selectedDate]?.filter((order) => order.status)?.length || 0;
    

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text allowFontScaling={false} style={styles.headerTitle}>
              <FormattedMessage id="calendar" defaultMessage="Calendario" />
            </Text>
            <Text allowFontScaling={false} style={styles.headerSubtitle}>
              <FormattedMessage id="manageEvents" />
            </Text>
          </View>
          <View style={styles.headerButtons}>
            {/* Nuevo botón para horarios */}
            <TouchableOpacity
              disabled={loading || loadingSchedules}
              onPress={handleLoadDaySchedules}
              style={[styles.headerActionButton, { marginRight: 8 }]}
            >
              {loadingSchedules ? (
                <Progress.Circle
                  color="white"
                  indeterminate={true}
                  size={20}
                />
              ) : (
                <Ionicons name="time-outline" size={20} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loading}
              onPress={() => onRefresh()}
              style={styles.refreshButton}
            >
              <AnimatedNative.View
                style={{
                  transform: [
                    {
                      rotate: spinAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <Ionicons name="refresh" size={24} color="white" />
              </AnimatedNative.View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text allowFontScaling={false} style={styles.statNumber}>{eventsCount}</Text>
          <Text allowFontScaling={false} style={styles.statLabel}>
            <FormattedMessage id="calendarEventText" />
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text allowFontScaling={false} style={[styles.statNumber, { color: Colors.light.success }]}>
            {confirmedCount}
          </Text>
          <Text allowFontScaling={false} style={styles.statLabel}>
            <FormattedMessage id="calendarConfirmatedText" />
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text allowFontScaling={false} style={[styles.statNumber, { color: Colors.light.warning }]}>
            {eventsCount - confirmedCount}
          </Text>
          <Text allowFontScaling={false} style={styles.statLabel}>
            <FormattedMessage id="calendarPendingText" />
          </Text>
        </View>
      </View>


      {
        user?.tipo_servicio === ID_TIPOSERVICIO_RESERVA_ESPACIO ? (
          calendarData.espacios.length > 0 && !loadingCalendarData && (
            <View style={styles.workerSelectContainer}>
              <EspacioSelect
                espacios={calendarData.espacios}
                selectedId={selectedEspacio}
                onSelect={setSelectedEspacio}
              />
            </View>
          )
        ) : (
          calendarData.workers.length > 0 && !loadingCalendarData && (
            <View style={styles.workerSelectContainer}>
              <WorkerSelect
                workers={calendarData.workers}
                selectedId={selectedWorkerId}
                onSelect={setSelectedWorkerId}
              />
            </View>
          )
        )
      }



      <View style={styles.dateNavigationContainer}>
        <TouchableOpacity onPress={handlePreviousDay} style={styles.dateNavButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.currentDateContainer}
        >
          <Text allowFontScaling={false} style={styles.currentDateDay}>
            {moment(selectedDate).format("DD")}
          </Text>
          <View style={styles.currentDateInfo}>
            <Text allowFontScaling={false} style={styles.currentDateMonth}>
              {moment(selectedDate).format("MMM").toUpperCase()}
            </Text>
            <Text allowFontScaling={false} style={styles.currentDateWeekday}>
              {moment(selectedDate).format("dddd")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNextDay} style={styles.dateNavButton}>
          <Ionicons name="chevron-forward" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {isCurrentDayDisabled && (
        <View style={styles.noSlotsContainer}>
          <Ionicons name="warning" size={20} color={Colors.light.danger} />
          <Text allowFontScaling={false} style={styles.noSlotsText}>
            <FormattedMessage
              id="noSlotsForSelectedDay"
              defaultMessage="No hay lugares disponibles para esta fecha."
            />
          </Text>
        </View>
      )}

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {loading || loadingCalendarData || loadingCalendarCupos ? (
          <View style={styles.loadingContainer}>
            <Progress.Circle color={Colors.light.primary} indeterminate={true} size={50} />
            <Text allowFontScaling={false} style={styles.loadingText}>
              <FormattedMessage id="loadingEvents" />
            </Text>
          </View>
        ) : orderPerDays[selectedDate] && orderPerDays[selectedDate].length > 0 ? (
          <FlatList
            data={orderPerDays[selectedDate]}
            renderItem={({ item }: { item: any }) => (
              <ItemCalendar
                key={`${item.orderId}-${item.date}`}
                confirmOrder={confirmOrder}
                deleteOrder={(orderId) => {
                  setOrdrDeleteModalConfirm(true);
                  setOrderToDelete(orderId);
                }}
                InfoItem={item}
                confirmed={item.status}
              />
            )}
            keyExtractor={(item) => `${item.orderId}-${item.date}`}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="calendar-outline" size={80} color="#d1d5db" />
            <Text allowFontScaling={false} style={styles.emptyStateTitle}>No hay eventos</Text>
            <Text allowFontScaling={false} style={styles.emptyStateSubtitle}>
              No tienes eventos programados para esta fecha
            </Text>
          </View>
        )}
      </View>

      <AddButton onPress={() => setOpenAddModal(true)} />

      {/* Modal de Horarios del Día */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text allowFontScaling={false} style={styles.modalTitle}>
                Horarios Disponibles
              </Text>
              <Text allowFontScaling={false} style={styles.modalSubtitle}>
                {moment(selectedDate).format("dddd, DD [de] MMMM [de] YYYY")}
              </Text>
              <TouchableOpacity
                onPress={() => setShowScheduleModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={Colors.light.icon} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {daySchedules.length > 0 ? (
                daySchedules.map((schedule, index) => (
                  <View key={index} style={styles.scheduleItem}>
                    <View style={styles.scheduleTimeContainer}>
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={Colors.light.primary}
                      />
                      <Text allowFontScaling={false} style={styles.scheduleTime}>
                        {moment.tz(schedule, user.timeZone).format("HH:mm")}
                      </Text>
                    </View>
                    <View style={styles.scheduleInfo}>
                      <Text allowFontScaling={false} style={styles.scheduleStatus}>
                        Disponible
                      </Text>
                      <View style={[
                        styles.scheduleStatusIndicator,
                        {
                          backgroundColor: Colors.light.success
                        }
                      ]} />
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyScheduleContainer}>
                  <Ionicons name="time-outline" size={60} color="#d1d5db" />
                  <Text allowFontScaling={false} style={styles.emptyScheduleTitle}>
                    No hay horarios configurados
                  </Text>
                  <Text allowFontScaling={false} style={styles.emptyScheduleSubtitle}>
                    No se encontraron horarios para esta fecha
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {openAddModal && selectedDate && (
        <CreateOrderModal
          horarios={horarios}
          selectedWorkerId={selectedWorkerId}
          currentOrders={orderPerDays[selectedDate] ? orderPerDays[selectedDate] : []}
          onClose={() => setOpenAddModal(false)}
          defaultDate={selectedDate}
          onSuccess={() => {
            onLoadItems(selectedDate);
          }}
          availableDates={availableDates}
          tipoServicio={ID_TIPOSERVICIO_RESERVA}
        />
      )}

      {ordrDeleteModalConfirm && (
        <ModalConfirmAction
          loading={loadingDelete}
          onContinue={() => deleteOrder(oredrToDelete)}
          title={intl.formatMessage({
            id: "deleteReservationTitle",
            defaultMessage: "Delete order",
          })}
          message={intl.formatMessage({
            id: "deleteReservationMessage",
            defaultMessage: "",
          })}
          withReason={true}
          onClose={() => {
            setOrdrDeleteModalConfirm(false);
            setOrderToDelete(null);
            setReason("");
          }}
          reason={reason}
          setReason={setReason}
          isOpen={ordrDeleteModalConfirm}
        />
      )}

      <DatePickerModal
        isVisible={showDatePicker}
        onConfirm={handleDateChange}
        onCancel={() => setShowDatePicker(false)}
        currentDate={new Date(selectedDate)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.icon,
    fontWeight: "500",
  },
  workerSelectContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  dateNavigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  dateNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  currentDateContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  currentDateDay: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.light.primary,
  },
  currentDateInfo: {
    alignItems: "flex-start",
  },
  currentDateMonth: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.icon,
    letterSpacing: 1,
  },
  currentDateWeekday: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 2,
  },
  noSlotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  noSlotsText: {
    color: Colors.light.danger,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    minHeight: "50%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.icon,
    fontWeight: "500",
  },
  flatListContent: {
    paddingBottom: 100,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: "center",
    lineHeight: 24,
  },
  // Estilos del Modal de Horarios
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    position: "relative",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    fontWeight: "500",
  },
  modalCloseButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    marginTop: 10,
    flex: 1,
    paddingHorizontal: 20
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  scheduleTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  scheduleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scheduleStatus: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.icon,
  },
  scheduleStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyScheduleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyScheduleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyScheduleSubtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});