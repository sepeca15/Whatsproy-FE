import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { styles as productosStyles } from "@/components/Views/Productos/ProductosStyles";
import AddEventToCalendarModal from "./components/AddEventToCalendar";
import api from "@/services/api/admin";
import ItemCalendar from "./components/ItemCalendar";
import { IInfoItem } from "./types";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CalendarView() {
  const [orderPerDays, setOrderPerDays] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );  

  const onLoadItems = async(selectedDate : string) => {
    try {
      const data = await api.order.getCalendarOrders(selectedDate)      
      setOrderPerDays(data.data)
      console.log(data.data);
      
    } catch (error : any) {
      console.log(error.response.data.message);
    }
  }

  React.useEffect(()=> {
    if(selectedDate) {
      onLoadItems(selectedDate)
    }
  },[selectedDate])

  return (
    <View style={styles.container}>
      <Agenda
        loading={false}
        items={orderPerDays}
        selected={selectedDate}
        showOnlySelectedDayItems={true}
        onDayPress={(day: any) => {
          setSelectedDate(day.dateString);
        }}
        renderItem={(data:IInfoItem)=> (
          <ItemCalendar InfoItem={data}/>
        )}
        renderEmptyData={() => {
          return  <View style={styles.emptyDate}>
            <Text>No hay eventos para este día</Text>
          </View>
        }}
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
      {openAddModal && (
        <AddEventToCalendarModal
          onClose={() => setOpenAddModal(false)}
          handleAddOrUpdate={() => null}
          defaultDate={selectedDate}
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
});
