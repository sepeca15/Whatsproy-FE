import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TipoServicio } from "@/types/empresa";
import { PedidoCard } from "@/types/pedido";
import { ReservaCard } from "@/types/reserva";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

type Props = {
  tipoServicio: TipoServicio;
};

const pedidos: PedidoCard[] = [
  {
    nombre: "Pedido 1",
    timestamp: "2024-10-23 14:00",
    url: "https://example.com/1",
  },
  {
    nombre: "Pedido 2",
    timestamp: "2024-10-23 16:30",
    url: "https://example.com/2",
  },
  {
    nombre: "Pedido 3",
    timestamp: "2024-10-23 18:45",
    url: "https://example.com/3",
  },
];

const reservas: ReservaCard[] = [
  {
    nombre: "Pepe",
    timestamp: "2024-10-23 14:00",
    telefono: "099929929",
    url: "https://example.com/4",
  },
  {
    nombre: "Manuel",
    timestamp: "2024-10-23 16:30",
    telefono: "088838838",
    url: "https://example.com/5",
  },
  {
    nombre: "Lucas",
    timestamp: "2024-10-23 18:45",
    telefono: "077747747",
    url: "https://example.com/6",
  },
];

export default function HomeScreen({ tipoServicio }: Props) {
  // const data = tipoServicio === TipoServicio.delivery ? pedidos : reservas;
  const data = reservas;

  return (
    <ThemedView style={styles.mainContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          {tipoServicio === TipoServicio.delivery ? "Pedidos recientes" : "Reservas recientes"}
        </ThemedText>
      </ThemedView>

      <ScrollView>
        {data.map((item, index) => (
          <ThemedView key={index} style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <ThemedText style={styles.cardTitle}>
                {"telefono" in item ? `${item.nombre} - ${item.telefono}` : item.nombre}
              </ThemedText>
              <ThemedText style={styles.cardTimestamp}>{item.timestamp}</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Linking.openURL(item.url)}
            >
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </ThemedView>
        ))}
        <TouchableOpacity style={styles.verMasButton}>
          <Text style={styles.verMasText}>Ver más</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  titleContainer: {
    display: "flex",
    fontWeight: "bold",
    flexDirection: "row",
    minWidth: "100%",
    alignItems: "center",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardTimestamp: {
    fontSize: 14,
    color: "#555",
  },
  iconButton: {
    marginLeft: 8,
  },
  verMasButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
  },
  verMasText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
