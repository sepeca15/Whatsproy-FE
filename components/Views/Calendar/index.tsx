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

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CalendarView() {
  const [items, setItems] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const loadItems = (day: any) => {
    const newItems: any = { ...items };
    for (let i = -5; i < 20; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = new Date(time).toISOString().split("T")[0];
      if (!newItems[strTime]) {
        newItems[strTime] = [
          {
            id: i,
            name: strTime,
            time: "15:30",
            description: `Detalles extensos de la reserva para el día ${strTime}. Esta reserva tiene información importante.`,
            height: 50 + Math.random() * 100,
          },
        ];
      }
    }
    setItems(newItems);
  };

  const toggleExpand = (itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setItems((prevState) => {
      const newItems: any = { ...prevState };

      let foundDate: string | null = null;
      for (const date in newItems) {
        if (newItems[date].some((item: any) => item.id === itemId)) {
          foundDate = date;
          break;
        }
      }

      if (!foundDate) {
        return;
      }
      newItems[foundDate] = newItems[foundDate].map((item: any) =>
        item.id === itemId ? { ...item, expanded: !item.expanded } : item
      );

      return newItems;
    });
  };

  const renderItem = (item: any) => {
    const isExpanded = item?.expanded;
    return (
      <TouchableOpacity
        key={item?.id}
        style={[styles.item, isExpanded && styles.expandedItem]}
        onPress={() => toggleExpand(item?.id)}
      >
        <View style={styles.rowTitle}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.row}>
            <Ionicons name={"time-outline"} size={16} color={"white"} />
            <Text
              style={{
                ...styles.title,
                marginTop: 3,
              }}
            >
              {item.time}
            </Text>
          </View>
        </View>
        <View>
          {isExpanded && (
            <Text style={styles.description}>{item.description}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={selectedDate}
        onDayPress={(day: any) => {
          setSelectedDate(day.dateString);
        }}
        renderItem={renderItem}
        renderEmptyDate={() => (
          <View style={styles.emptyDate}>
            <Text>No hay eventos para este día</Text>
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
