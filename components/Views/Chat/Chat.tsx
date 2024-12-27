import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import { styles } from "./ChatStyles";

export default function Chat() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mensajes</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.messages}>
        <View style={styles.messageContainer}>
          <Text style={styles.time}>11:30</Text>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>Hola, quiero una cita</Text>
          </View>
        </View>

        <View style={[styles.messageContainer, styles.rightMessage]}>
          <Text style={styles.time}>11:30</Text>
          <View style={[styles.messageContent, styles.rightMessageContent]}>
            <Text style={styles.messageText}>
              Si por supuesto! En que hora?
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Hola, soy el admin"
          multiline
        />
        <TouchableOpacity style={styles.sendButton}>
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
