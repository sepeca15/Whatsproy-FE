import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  UIManager,
  Image,
} from "react-native";
import moment from "moment";

import { Agenda } from "react-native-calendars";
import { ID_TIPOSERVICIO_RESERVA } from "@/services/api/tiposervicio/tiposervicio.type";
import api from "@/services/api/admin";
import ItemCalendar from "./components/ItemCalendar";
import { IInfoItem } from "./types";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import CustomText from "@/components/CustomText";
import CreateOrderModal from "@/components/CreateOrderModal";
import Animated from "react-native-reanimated";
import { FormattedMessage, useIntl } from "react-intl";
import { globalStyles } from "@/components/globalStyles";
import { styles as stylesPending } from "../Pedidos/components/OrdersPending/ordersPendingStyles";
import { useToastContext } from "@/contexts/ToastContext";
import { Animated as AnimatedNative, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ordenarPedidosPorHora, OrderPerDays } from "@/utils/date";
import { useUser } from "@/hooks/redux/useUser";
import { WorkerUser } from "@/services/api/user/user.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "native-base";
import WorkerSelect from "@/components/WorkerSelect/WorkerSelect";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CalendarView() {
  const [orderPerDaysAll, setOrderPerDays] = useState<OrderPerDays>({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [agendaKey, setAgendaKey] = useState(1);
  const spinAnim = useRef(new AnimatedNative.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const { showToast } = useToastContext();
  const { user } = useUser();
  const [workers, setWorkers] = useState<WorkerUser[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<
    any | number | undefined
  >();
  const [horarios, setHorarios] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<any>("");
  const [selectedYear, setSelectedYear] = useState<any>("");
  const [disabledDates, setDisabledDates] = useState({});
  const [oredrToDelete, setOrderToDelete] = useState<any>(null);
  const orderPerDays = ordenarPedidosPorHora(orderPerDaysAll);

  useEffect(() => {
    setAgendaKey((prev) => prev + 1);
  }, [selectedDate]);

  const [loadWorkers, setLoadWorkers] = useState(false);
  const [ordrDeleteModalConfirm, setOrdrDeleteModalConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const intl = useIntl();

  const [loadingCalendarCupos, setLoadingCalendarCupos] = useState(false);

  const handleLoadWorkers = async () => {
    try {
      setLoadWorkers(true);
      const workers = await api.user.findWorkers(user?.id_empresa);
      setWorkers(workers.data);
      if (workers?.data && workers?.data?.length > 0) {
        setSelectedWorkerId(workers?.data[0]?.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadWorkers(false);
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
      console.log("availableDates", selectedYear, selectedMonth, user?.id);

      let disabledDatesCurrentMonth: any = {};

      (availableDates as any[]).forEach((itm) => {
        if (itm?.cuposDisponibles === 0) {
          disabledDatesCurrentMonth[itm?.fecha] = {
            disabled: false,
            disableTouchEvent: false,
            marked: false,
            customStyles: {
              container: {
                backgroundColor: "rgba(255, 0, 0, 0.15)",
                borderRadius: 100,
              },
              text: {
                color: "#ff0000",
                fontWeight: "bold",
              },
            },
          };
        }
      });
      setDisabledDates(disabledDatesCurrentMonth);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCalendarCupos(false);
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

  useEffect(() => {
    if (user?.id_empresa) {
      handleLoadWorkers();
    }
  }, [user?.id_empresa]);

  useEffect(() => {
    if (user?.id_empresa) {
      handleLoadHorarios();
    }
  }, [user?.id_empresa]);

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

  const onLoadItems = async (selectedDate: string) => {
    setLoading(true);
    try {
      const data = await api.order.getCalendarOrders(
        selectedDate,
        selectedWorkerId
      );
      const availableDates = await api.order.getAvailableDates(
        selectedDate,
        selectedWorkerId
      );
      if (availableDates?.length > 0) {
        setAvailableDates(availableDates);
      }
      setOrderPerDays(data.data);
      setAgendaKey((prev) => prev + 1);
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (orderId: number) => {
    try {
      const firstDate = Object.keys(orderPerDays)[0];

      const data = await api.order.confirm(orderId);
      showToast({
        title: "¡Evento confirmado!",
        description: "Su reserva fue confirmado exitosamente.",
        status: "success",
      });
      if (data.data) {
        setOrderPerDays((prevState) => {
          const updatedOrders = prevState[firstDate].map((order) =>
            order.orderId === orderId ? { ...order, status: true } : order
          );

          return {
            ...prevState,
            [firstDate]: [...updatedOrders],
          };
        });
        setAgendaKey((prev) => prev + 1);
      }
    } catch (error: any) {
      console.log('nooo',error.response.data.message);
    }
  };

  const deleteOrder = async (orderId: number) => {
    try {
      const firstDate = Object.keys(orderPerDays)[0];

      const data = await api.order.remove(orderId);
      showToast({
        title: "¡Evento cancelado!",
        description: "Su reserva fue cancelado exitosamente.",
        status: "success",
      });
      if (data) {
        setOrderPerDays((prevState) => {
          const updatedList = prevState[firstDate].filter(
            (order) => order.orderId !== orderId
          );

          return {
            ...prevState,
            [firstDate]: [...updatedList],
          };
        });
        setAgendaKey((prev) => prev + 1);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedWorkerId) {
      onLoadItems(selectedDate);
    }
  }, [selectedDate, selectedWorkerId]);

  return (
    <View style={styles.container}>
      <Animated.View style={globalStyles.header}>
        <View style={styles.headerContent}>
          <View style={globalStyles.headerLeft}>
            <CustomText
              style={globalStyles.businessName}
              accessibilityLabel="Pedidos"
            >
              <FormattedMessage id="calendar" />
            </CustomText>
          </View>
        </View>
      </Animated.View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {" "}
          <FormattedMessage
            id="events.calendar"
            defaultMessage="Eventos del calendario"
          />
        </Text>
        <View style={styles.circleAvaiableContainer}>
          <View style={[styles.circleAvaiable, { backgroundColor: "green" }]} />
          <Text style={styles.headerDescription}>
            <FormattedMessage id="confirmed" defaultMessage="confirmados" />
          </Text>
        </View>
        <View style={[styles.circleAvaiableContainer]}>
          <View
            style={[styles.circleAvaiable, { backgroundColor: "gray" }]}
          ></View>
          <Text style={styles.headerDescription}>
            <FormattedMessage
              id="not.confirmed"
              defaultMessage="no comfirmados"
            />
          </Text>
        </View>
        <View style={[styles.circleAvaiableContainer]}>
          <View
            style={[styles.circleAvaiable, { backgroundColor: "rgba(255, 0, 0, 0.15)" }]}
          ></View>
          <Text style={styles.headerDescription}>
            <FormattedMessage
              id="noPlace"
              defaultMessage="Sin lugares disponibles"
            />
          </Text>
        </View>
        {!loadWorkers && (
          <Box my={4} pb={6} flex={1} width={"full"}>
            <WorkerSelect
              workers={workers}
              selectedId={selectedWorkerId}
              onSelect={setSelectedWorkerId}
            />
          </Box>
        )}
        <View style={styles.buttonRefresh}>
          <TouchableOpacity disabled={loading} onPress={() => onRefresh()}>
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
              <Ionicons name="refresh" size={24} color={"white"} />
            </AnimatedNative.View>
          </TouchableOpacity>
        </View>
      </View>

      {
        <View style={styles.calendarContent}>
          <Agenda
            markedDates={disabledDates}
            markingType="custom"
            items={orderPerDays}
            selected={selectedDate}
            refreshing={loading || loadWorkers || loadingCalendarCupos}
            displayLoadingIndicator={
              loadWorkers || loading || loadingCalendarCupos
            }
            showOnlySelectedDayItems={true}
            showClosingKnob={true}
            onDayPress={(day: any) => {
              console.log("day", day);
              setSelectedDate(day.dateString);
              setSelectedMonth(day?.month.toString());
              setSelectedYear(day?.year.toString());
            }}
            onRefresh={onRefresh}
            renderKnob={() => (
              <View style={{ alignItems: "center", padding: 10 }}>
                <View
                  style={{
                    width: 50,
                    height: 5,
                    borderRadius: 5,
                    backgroundColor: "#128c7e",
                  }}
                />
              </View>
            )}
            renderItem={(data: IInfoItem) => {
              return (
                <ItemCalendar
                  key={`${data.orderId}-${data.date}`}
                  confirmOrder={confirmOrder}
                  deleteOrder={(orderId) => {
                    setOrdrDeleteModalConfirm(true);
                    setOrderToDelete(orderId);
                  }}
                  InfoItem={data}
                  confirmed={data.status}
                />
              );
            }}
            renderEmptyData={() => (
              <View style={styles.emptyDate}>
                {loading || loadWorkers || loadingCalendarCupos ? (
                  <Progress.Circle
                    color={Colors.light.primary}
                    indeterminate={true}
                    size={50}
                  />
                ) : (
                  <View
                    style={{ ...stylesPending.containerImage, marginTop: 10 }}
                  >
                    <Image
                      source={require("../../../assets/images/no-records.png")}
                      style={{ width: 350, height: 250, objectFit: "contain" }}
                    />
                    <CustomText>
                      <FormattedMessage
                        id="noOrdersAvailable.index"
                        defaultMessage="No orders available"
                      />
                    </CustomText>
                  </View>
                )}
              </View>
            )}
            rowHasChanged={(r1: any, r2: any) =>
              r1.orderId !== r2.orderId ||
              r1.date !== r2.date ||
              r1.productName !== r2.productName ||
              r1.status !== r2.status
            }
            theme={{
              agendaDayTextColor: "#333",
              agendaDayNumColor: "#333",
              agendaTodayColor: "#128c7e",
              agendaKnobColor: "#128c7e",
              selectedDayBackgroundColor: "#128c7e",
              selectedDayTextColor: "#ffffff",
            }}
          />
        </View>
      }

      {openAddModal && selectedDate && (
        <CreateOrderModal
          horarios={horarios}
          selectedWorkerId={selectedWorkerId}
          currentOrders={
            orderPerDays[selectedDate] ? orderPerDays[selectedDate] : []
          }
          onClose={() => setOpenAddModal(false)}
          defaultDate={selectedDate}
          onSuccess={() => {
            onLoadItems(selectedDate);
          }}
          availableDates={availableDates}
          tipoServicio={ID_TIPOSERVICIO_RESERVA}
        />
      )}

      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity
          style={globalStyles.addButton}
          onPress={() => {
            setOpenAddModal(!openAddModal);
          }}
        >
          <Text style={globalStyles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

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
          onClose={() => setOrdrDeleteModalConfirm(false)}
          reason={reason}
          setReason={setReason}
          isOpen={ordrDeleteModalConfirm}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContent: {
    width: "100%",
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
    height: "100%",
    maxHeight: "100%",
    flexDirection: "column",
  },
  item: {
    backgroundColor: "#128c7e8c",
    borderRadius: 10,
    color: "white",
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  expandedItem: {
    backgroundColor: "#128c7e8c",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    fontWeight: "semibold",
    color: "white",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "white",
    marginTop: 10,
  },
  emptyDate: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  rowTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonRefresh: {
    position: "absolute",
    right: 8,
    top: 16,
    width: 40,
    height: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
    backgroundColor: "#128c7e",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  headerContainer: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#f2f2f2",
  },
  circleAvaiableContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circleAvaiable: {
    height: 10,
    width: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerDescription: {
    fontSize: 14,
    color: "#666",
  },
});
