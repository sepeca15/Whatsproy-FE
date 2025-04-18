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

import { styles as stylesPending } from '@/components/Views/Pedidos/components/OrdersPending/OrdersPendingStyles' ;
import { Agenda } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { styles as productosStyles } from "@/components/Views/Productos/ProductosStyles";
import { ID_TIPOSERVICIO_RESERVA } from "@/services/api/tiposervicio/tiposervicio.type";
import api from "@/services/api/admin";
import ItemCalendar from "./components/ItemCalendar";
import { IInfoItem } from "./types";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";

import CustomText from "@/components/CustomText";
import { useUser } from "@/hooks/redux/useUser";
import CreateOrderModal from "@/components/CreateOrderModal";

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
    new Date().toISOString().split("T")[0],
  );
  const {user} = useUser()
  const [loading, setLoading] = useState(true);
  console.log(user);
  
  const onLoadItems = async (selectedDate: string) => {
    setLoading(true);
    try {
      const data = await api.order.getCalendarOrders(selectedDate);
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
            order.orderId === orderId ? { ...order, status: true } : order,
          );
          return {
            ...prevState,
            [firstDate]: updatedOrders,
          };
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message, "xddddddddd");
    }
  };

  const deleteOrder = async (orderId: number) => {
    try {
      const firstDate = Object.keys(orderPerDays)[0];

      const data = await api.order.remove(orderId);
      if (data) {
        setOrderPerDays((prevState) => ({
          ...prevState,
          [firstDate]: prevState[firstDate].filter(
            (order) => order.orderId !== orderId,
          ),
        }));
      }
    } catch (error: any) {
      console.log(error.response.data.message, "xddddddddd");
    }
  };

  useEffect(() => {
    if (selectedDate) {
      onLoadItems(selectedDate);
    }
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Eventos del calendario</Text>
        <View style={styles.circleAvaiableContainer}>
          <View style={[styles.circleAvaiable, { backgroundColor: "green" }]} />
          <Text style={styles.headerDescription}>Confirmados</Text>
        </View>
        <View style={[styles.circleAvaiableContainer]}>
          <View
            style={[styles.circleAvaiable, { backgroundColor: "gray" }]}
          ></View>
          <Text style={styles.headerDescription}>Sin Confirmar</Text>
        </View>
      </View>
      <Agenda
        key={JSON.stringify(orderPerDays)}
        items={orderPerDays}
        selected={selectedDate}
        refreshing={true}
        showOnlySelectedDayItems={true}
        onDayPress={(day: any) => {
          setSelectedDate(day.dateString);
        }}
        renderItem={(data: IInfoItem) => (
          <ItemCalendar
            key={data.orderId}
            confirmOrder={confirmOrder}
            deleteOrder={deleteOrder}
            InfoItem={data}
            confirm={data.status}
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
              <View style={{ ...stylesPending.containerImage, marginTop: 10 }}>
                <Image
                  source={require("../../../assets/images/no-records.png")}
                  style={{ width: 350, height: 250, objectFit: "contain" }}
                />
                <CustomText>No hay eventos para este día</CustomText>
              </View>
            )}
          </View>
        )}
        rowHasChanged={(r1: any, r2: any) =>
          r1.name !== r2.name || r1?.expanded !== r2?.expanded
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
          tipoServicio={ID_TIPOSERVICIO_RESERVA}
        />
      )}

      <View style={productosStyles.buttonContainer}>
        <TouchableOpacity
          style={productosStyles.addButton}
          onPress={() => {
            setOpenAddModal(!openAddModal);
          }}
        >
          <Text style={productosStyles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
