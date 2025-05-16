import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  UIManager,
  Image,
} from "react-native";

import { Agenda } from "react-native-calendars";
import { ID_TIPOSERVICIO_RESERVA } from "@/services/api/tiposervicio/tiposervicio.type";
import api from "@/services/api/admin";
import ItemCalendar from "./components/ItemCalendar";
import { IInfoItem } from "./types";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";

import CustomText from "@/components/CustomText";
import { useUser } from "@/hooks/redux/useUser";
import CreateOrderModal from "@/components/CreateOrderModal";
import Animated, { FadeIn } from "react-native-reanimated";
import { FormattedMessage } from "react-intl";
import { globalStyles } from "@/components/globalStyles";
import { styles as stylesPending } from "../Pedidos/components/OrdersPending/ordersPendingStyles";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type OrderPerDays = {
  [date: string]: IInfoItem[];
};

export default function CalendarView() {
  const [orderPerDays, setOrderPerDays] = useState<OrderPerDays>({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [agendaKey, setAgendaKey] = useState(0);

  useEffect(() => {
    setAgendaKey((prev) => prev + 1);
  }, [selectedDate]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const onLoadItems = async (selectedDate: string) => {
    setLoading(true);
    try {
      const data = await api.order.getCalendarOrders(selectedDate);

      const availableDates = await api.order.getAvailableDates(selectedDate);
      if (availableDates?.length > 0) {
        setAvailableDates(availableDates);
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
      const firstDate = Object.keys(orderPerDays)[0];

      const data = await api.order.confirm(orderId);
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
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  const deleteOrder = async (orderId: number) => {
    try {
      const firstDate = Object.keys(orderPerDays)[0];

      const data = await api.order.remove(orderId);
      if (data) {
        setOrderPerDays((prevState) => {
          const updatedList = prevState[firstDate].filter(
            (order) => order.orderId !== orderId
          );

          return {
            ...prevState,
            [firstDate]: [...updatedList], // ← Clona la lista filtrada
          };
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    if (selectedDate) {
      onLoadItems(selectedDate);
    }
  }, [selectedDate]);

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
      </View>
      {
        <View style={styles.calendarContent}>
          <Agenda
            items={orderPerDays}
            selected={selectedDate}
            refreshing={loading}
            showOnlySelectedDayItems={true}
            showClosingKnob={true}
            onDayPress={(day: any) => {
              setSelectedDate(day.dateString);
            }}
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
            renderItem={(data: IInfoItem) => (
              <ItemCalendar
                key={data.orderId}
                confirmOrder={confirmOrder}
                deleteOrder={deleteOrder}
                InfoItem={data}
                confirmed={data.status}
              />
            )}
            renderEmptyData={() => (
              <View style={styles.emptyDate}>
                {loading ? (
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
              r1.name !== r2.name ||
              r1?.expanded !== r2?.expanded ||
              r1?.status !== r2?.status
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
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  headerContainer: {
    display: "flex",
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
