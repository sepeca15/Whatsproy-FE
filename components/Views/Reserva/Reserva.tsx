import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MessageCircle } from "lucide-react-native";
import { styles } from "./ReservaStyles";

const reservaDetalles = [
  {
    id: "1",
    hora: "11:30",
    fecha: "Jun 11, 2024",
    cliente: "Juan Manuel",
    estado: "Pendiente",
    direccion: "Arelina 716",
    tipo: "delivery",
  },
  {
    id: "2",
    hora: "12:00",
    fecha: "Jun 11, 2024",
    cliente: "Ana María",
    estado: "Pendiente",
    direccion: "Arelina 716",
    tipo: "delivery",
  },
  {
    id: "3",
    hora: "13:30",
    fecha: "Jun 11, 2024",
    cliente: "Carlos Pérez",
    estado: "Realizada",
    direccion: "Arelina 716",
    tipo: "local",
  },
];

export default function ReservaDetalle() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const reserva = reservaDetalles[id];

  if (!reserva) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Reserva no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Foto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.photoPlaceholder}>{/* Aquí iría la foto */}</View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Información:</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha:</Text>
              <Text style={styles.infoValue}>{reserva.fecha}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dirección:</Text>
              <Text style={styles.infoValue}>{reserva.direccion}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tipo:</Text>
              <Text style={styles.infoValue}>{reserva.tipo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estado:</Text>
              <Text style={[styles.infoValue, styles.statusText]}>
                {reserva.estado}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Observaciones</Text>
          <TextInput
            style={styles.observationsInput}
            placeholder="Buen corte"
            multiline
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => router.push(`/chat/${id}`)}
            >
              <MessageCircle size={20} color="#007AFF" />
              <Text style={styles.chatButtonText}>Ir al chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
