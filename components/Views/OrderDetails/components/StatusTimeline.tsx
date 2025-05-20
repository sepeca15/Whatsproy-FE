import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"
import moment from "moment"
import "moment/locale/es"
import { RFValue } from "react-native-responsive-fontsize"

interface StatusChange {
  createdAt: string
  estado: {
    nombre: string
    color?: string
  }
}

interface StatusTimelineProps {
  statusChanges: StatusChange[]
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ statusChanges }) => {
  // Sort status changes by date (newest first)
  const sortedChanges = [...statusChanges].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <View style={styles.container}>
      <Text style={styles.timelineTitle}>Historial de estados</Text>

      {sortedChanges.map((change, index) => (
        <View key={index} style={styles.timelineItem}>
          <View style={styles.timelineLine}>
            <View style={styles.timelineDot} />
            {index !== sortedChanges.length - 1 && <View style={styles.timelineConnector} />}
          </View>

          <View style={styles.timelineContent}>
            <Text style={styles.statusName}>{change.estado.nombre}</Text>
            <Text style={styles.statusDate}>{moment(change.createdAt).locale("es").format("D MMM, HH:mm")}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingTop: 10,
  },
  timelineTitle: {
    fontSize: RFValue(12),
    color: Colors.light.icon,
    marginBottom: 10,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  timelineLine: {
    width: 20,
    alignItems: "center",
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  timelineConnector: {
    width: 2,
    height: "100%",
    backgroundColor: "#e0e0e0",
    marginTop: 4,
    marginLeft: 4,
    position: "absolute",
    top: 10,
    bottom: 0,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 10,
    paddingBottom: 8,
  },
  statusName: {
    fontSize: RFValue(13),
    fontWeight: "500",
    color: Colors.light.text,
  },
  statusDate: {
    fontSize: RFValue(11),
    color: Colors.light.icon,
    marginTop: 2,
  },
})

export default StatusTimeline
