import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";

interface ReservaItemProps {
  reserva: {
    id: string;
    hora: string;
    cliente: string;
    estado: string;
  };
  onPress: () => void;
}

export default function ReservaItem({ reserva, onPress }: ReservaItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{reserva.hora}</Text>
          <Text style={styles.separator}>-</Text>
          <Text style={styles.client}>{reserva.cliente}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.status,
              reserva.estado === "Pendiente"
                ? styles.pendingStatus
                : styles.completedStatus,
            ]}
          >
            {reserva.estado}
          </Text>
        </View>
      </View>
      <ChevronRight size={20} color="#666" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  separator: {
    marginHorizontal: 8,
    color: "#666",
  },
  client: {
    fontSize: 16,
    color: "#666",
  },
  statusContainer: {
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  pendingStatus: {
    backgroundColor: "#FFF3E0",
    color: "#FF9800",
  },
  completedStatus: {
    backgroundColor: "#E8F5E9",
    color: "#4CAF50",
  },
});
