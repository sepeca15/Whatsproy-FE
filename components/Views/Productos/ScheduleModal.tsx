"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input, Button, Spinner } from "native-base";
import { useIntl, FormattedMessage } from "react-intl";
import { Colors } from "@/constants/Colors";
import GenericModal from "../ConfigAccount/components/GenericModal/GenericModal";
import { formatTime } from "@/utils/date";

interface Schedule {
  id?: number;
  dayOfWeek: number;
  hora_inicio: string;
  hora_fin: string;
}

interface ScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (schedule: Schedule) => Promise<void>;
  editingSchedule?: Schedule | null;
  dayId: number;
  dayName: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  visible,
  onClose,
  onSave,
  editingSchedule,
  dayId,
  dayName,
}) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState<{
    startTime?: string;
    endTime?: string;
  }>({});

  useEffect(() => {
    if (editingSchedule) {
      setStartTime(formatTime(editingSchedule.hora_inicio || ""));
      setEndTime(formatTime(editingSchedule.hora_fin || ""));
    } else {
      setStartTime("");
      setEndTime("");
    }
    setErrors({});
  }, [editingSchedule, visible]);

  const validateTime = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const validateForm = (): boolean => {
    const newErrors: { startTime?: string; endTime?: string } = {};

    if (!startTime.trim()) {
      newErrors.startTime = intl.formatMessage({
        id: "schedule.startTimeRequired",
        defaultMessage: "La hora de inicio es requerida",
      });
    } else if (!validateTime(startTime)) {
      newErrors.startTime = intl.formatMessage({
        id: "schedule.invalidTimeFormat",
        defaultMessage: "Formato de hora inválido (HH:MM)",
      });
    }

    if (!endTime.trim()) {
      newErrors.endTime = intl.formatMessage({
        id: "schedule.endTimeRequired",
        defaultMessage: "La hora de fin es requerida",
      });
    } else if (!validateTime(endTime)) {
      newErrors.endTime = intl.formatMessage({
        id: "schedule.invalidTimeFormat",
        defaultMessage: "Formato de hora inválido (HH:MM)",
      });
    }

    if (
      startTime &&
      endTime &&
      validateTime(startTime) &&
      validateTime(endTime)
    ) {
      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (startMinutes >= endMinutes) {
        newErrors.endTime = intl.formatMessage({
          id: "schedule.endTimeMustBeAfterStart",
          defaultMessage: "La hora de fin debe ser posterior a la de inicio",
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const scheduleData: Schedule = {
        ...(editingSchedule?.id && { id: editingSchedule.id }),
        dayOfWeek: dayId,
        hora_inicio: startTime,
        hora_fin: endTime,
      };

      await onSave(scheduleData);
      onClose();
    } catch (error) {
      console.error("Error saving schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeInput = (text: string): string => {
    // Remove non-numeric characters except colon
    const cleaned = text.replace(/[^\d:]/g, "");

    // Auto-format as user types
    if (cleaned.length === 2 && !cleaned.includes(":")) {
      return cleaned + ":";
    }

    // Limit to HH:MM format
    if (cleaned.length > 5) {
      return cleaned.substring(0, 5);
    }

    return cleaned;
  };

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      title={intl.formatMessage(
        {
          id: editingSchedule
            ? "schedule.editScheduleForDay"
            : "schedule.addScheduleForDay",
          defaultMessage: editingSchedule
            ? "Editar horario para {dayName}"
            : "Agregar horario para {dayName}",
        },
        { dayName }
      )}
    >
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.description}>
          <FormattedMessage
            id="schedule.scheduleDescription"
            defaultMessage="Define el horario en el que estará disponible el menú diario para este día"
          />
        </Text>

        <View style={styles.timeContainer}>
          <View style={styles.timeInputContainer}>
            <Text allowFontScaling={false} style={styles.timeLabel}>
              <FormattedMessage
                id="schedule.startTime"
                defaultMessage="Hora de inicio"
              />
            </Text>
            <Input
              allowFontScaling={false}
              value={startTime}
              onChangeText={(text) => setStartTime(formatTimeInput(text))}
              placeholder="09:00"
              keyboardType="numeric"
              maxLength={5}
              style={styles.timeInput}
              isInvalid={!!errors.startTime}
              _focus={{
                borderColor: Colors.light.primary,
                backgroundColor: "white",
              }}
            />
            {errors.startTime && (
              <Text allowFontScaling={false} style={styles.errorText}>{errors.startTime}</Text>
            )}
          </View>

          <View style={styles.timeInputContainer}>
            <Text allowFontScaling={false} style={styles.timeLabel}>
              <FormattedMessage
                id="schedule.endTime"
                defaultMessage="Hora de fin"
              />
            </Text>
            <Input
              allowFontScaling={false}
              value={endTime}
              onChangeText={(text) => setEndTime(formatTimeInput(text))}
              placeholder="17:00"
              keyboardType="numeric"
              maxLength={5}
              style={styles.timeInput}
              isInvalid={!!errors.endTime}
              _focus={{
                borderColor: Colors.light.primary,
                backgroundColor: "white",
              }}
            />
            {errors.endTime && (
              <Text allowFontScaling={false} style={styles.errorText}>{errors.endTime}</Text>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="outline"
            onPress={onClose}
            style={styles.cancelButton}
            _text={{ color: Colors.light.text }}
          >
            <Text allowFontScaling={false} style={{ fontWeight: 500 }}>
              <FormattedMessage id="common.cancel" defaultMessage="Cancelar" />
            </Text>
          </Button>

          <Button
            onPress={handleSave}
            isLoading={loading}
            isDisabled={loading}
            style={[
              styles.saveButton,
              { backgroundColor: Colors.light.primary },
            ]}
            _text={{ color: "white" }}
          >
            {loading ? (
              <Spinner size="sm" color="white" />
            ) : (
              <Text allowFontScaling={false} style={{ color: "white", fontWeight: 500 }}>
                <FormattedMessage
                  id={editingSchedule ? "common.update" : "common.save"}
                  defaultMessage={editingSchedule ? "Actualizar" : "Guardar"}
                />
              </Text>
            )}
          </Button>
        </View>
      </View>
    </GenericModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },
  timeInputContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  timeInput: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.danger,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: Colors.light.border,
  },
  saveButton: {
    flex: 1,
  },
});

export default ScheduleModal;
