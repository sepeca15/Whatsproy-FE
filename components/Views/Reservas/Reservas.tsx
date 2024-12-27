import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Calendar, ChevronLeft } from "lucide-react-native";
import ReservaItem from "../../ReservaItem";
import { useState } from "react";
import { styles } from "./ReservasStyles";

const reservas = [
  { id: "1", hora: "11:30", cliente: "Juan Manuel", estado: "Pendiente" },
  { id: "2", hora: "12:00", cliente: "Ana María", estado: "Pendiente" },
  { id: "3", hora: "13:30", cliente: "Carlos Pérez", estado: "Realizada" },
];

export default function Reservas() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pendientes");

  const filteredReservas = reservas.filter(
    (reserva) =>
      (activeTab === "pendientes" && reserva.estado === "Pendiente") ||
      (activeTab === "realizados" && reserva.estado === "Realizada")
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Reservas recientes</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={20} color="#333" />
          <Text style={styles.calendarText}>Ver calendario</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pendientes" && styles.activeTab]}
          onPress={() => setActiveTab("pendientes")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pendientes" && styles.activeTabText,
            ]}
          >
            Pendientes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "realizados" && styles.activeTab]}
          onPress={() => setActiveTab("realizados")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "realizados" && styles.activeTabText,
            ]}
          >
            Realizados
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredReservas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReservaItem
            reserva={item}
            onPress={() => router.push(`/reservas/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
