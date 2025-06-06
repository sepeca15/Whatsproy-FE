import React, { useEffect, useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import {
  VStack,
  FormControl,
  Input,
  Modal,
  Button,
  FlatList,
  Text,
  Pressable,
  HStack,
  Icon,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment"; // Importamos moment
import GlobalModal from "./Modal";
import { Colors } from "@/constants/Colors";
import { useIntl } from "react-intl";

const generateTimeSlots = (
  date: string | moment.Moment,
  interval: number,
  horarios: Array<{
    dayOfWeek: number;
    hora_inicio: string;
    hora_fin: string;
  }>
) => {
  const baseDate = moment.isMoment(date) ? date.clone() : moment(date);
  const now = moment();
  const isToday = baseDate.isSame(now, "day");

  const dayOfWeek = baseDate.isoWeekday();
  const bloquesDelDia = horarios.filter((h) => h.dayOfWeek === dayOfWeek);
  const slots: moment.Moment[] = [];

  bloquesDelDia.forEach(({ hora_inicio, hora_fin }) => {
    const [startHour, startMinute] = hora_inicio.split(":").map(Number);
    const [endHour, endMinute] = hora_fin.split(":").map(Number);

    let current = baseDate.clone().set({
      hour: startHour,
      minute: startMinute,
      second: 0,
      millisecond: 0,
    });

    const endTime = baseDate.clone().set({
      hour: endHour,
      minute: endMinute,
      second: 0,
      millisecond: 0,
    });

    while (current.isBefore(endTime)) {
      if (!isToday || current.isSameOrAfter(now, "minute")) {
        slots.push(current.clone());
      }
      current.add(interval, "minutes");
    }
  });

  return slots;
};

const TimePicker = ({
  date,
  setDate,
  type = "date",
  interval = 30,
  isRequired = true,
  error,
  horario,
  checkAvailable,
  setAllOcupped,
  occupiedTimes = [],
}: any) => {
  const [showPicker, setShowPicker] = useState(false);
  const formattedDate = moment(date).format("DD/MM/YYYY");
  const { formatMessage } = useIntl();
  const formattedTime = moment(date).format("HH:mm");
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  const getFormattedValue = () => {
    if (type === "date") return formattedDate;
    if (type === "time") return formattedTime;
    return formattedDateTime;
  };

  const timeSlots = generateTimeSlots(moment(date).add("3", "hours").format("YYYY-MM-DD"), interval, horario);

const isOccupied = (time: moment.Moment) =>
  occupiedTimes.some((occupiedTime: string | Date) => {
    if (typeof occupiedTime === "string") {
      const [hours, minutes] = occupiedTime.split(":").map(Number);
      const occupiedFormatted = moment()
        .set({ hour: hours, minute: minutes, second: 0, millisecond: 0 })
        .format("HH:mm");

      const timeFormatted = time.format("HH:mm");

      return occupiedFormatted === timeFormatted;
    }

    return moment(occupiedTime).isSame(time, "minute");
  });

  const isAllOcupped = timeSlots.every((datetime) => isOccupied(datetime))

  useEffect(() => {
    if (isAllOcupped && setAllOcupped) {
      setAllOcupped(true)
    }
  }, [])
  

  const handleTimeSelect = (time: moment.Moment) => {
    if (!isOccupied(time)) {
      const updatedDate = moment(date).set({
        hour: time.hour(),
        minute: time.minute(),
        second: 0,
        millisecond: 0,
      });
      setDate(updatedDate.toDate());
      setShowPicker(false);
    }
  };

  return (
    <VStack space={4}>
      <TouchableWithoutFeedback onPress={() => setShowPicker(true)}>
        <FormControl isRequired={isRequired} isInvalid={error}>
          <FormControl.Label _text={{ fontWeight: "bold", fontSize: "md" }}>
            {type === "date"
              ? "Fecha"
              : type === "time"
                ? "Hora"
                : "Fecha y hora"}
          </FormControl.Label>
          <HStack
            alignItems="center"
            borderColor="coolGray.300"
            backgroundColor="coolGray.50"
            borderWidth={1}
            borderRadius="md"
            px={3}
            py={2}
          >
            <Icon
              as={Ionicons}
              name={type === "date" ? "calendar-outline" : "time-outline"}
              size="sm"
              color="coolGray.600"
            />
            <Text ml={3} flex={1} color="coolGray.800">
              {getFormattedValue() ||
                `Seleccionar ${type === "date"
                  ? "fecha"
                  : type === "time"
                    ? "hora"
                    : "fecha y hora"
                }`}
            </Text>
          </HStack>
          {error && (
            <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
          )}
        </FormControl>
      </TouchableWithoutFeedback>

      {showPicker && (
        <GlobalModal
          label={type === "date" ? formatMessage({ id: "selectDate" }) : formatMessage({ id: "selectTime" })}
          isVisible={showPicker}
          onClose={() => setShowPicker(false)}
          actions={[
            <Button
              onPress={() => setShowPicker(false)}
              size="sm"
              key="Cancel"
              backgroundColor={"#2C2C2C"}
              borderRadius="md"
            >
              <Text fontSize={14} color={"white"} fontWeight={500}>
                {formatMessage({ id: "cancel" })}
              </Text>
            </Button>,
          ]}
          content={
            <>
              {type === "time" && (
                <FlatList
                  scrollEnabled={false}
                  data={timeSlots}
                  keyExtractor={(item) => item.toISOString()}
                  renderItem={({ item }) => {
                    let occupied = isOccupied(item);
                    if (checkAvailable) {
                      occupied =
                        isOccupied(item) ||
                        !checkAvailable(moment(item).format("YYYY-MM-DD HH:mm"));
                    }
                    return (
                      <Pressable
                        onPress={() => !occupied && handleTimeSelect(item)}
                        disabled={occupied}
                        _pressed={{
                          backgroundColor: "coolGray.200",
                          borderRadius: "md",
                        }}
                        px={4}
                        py={3}
                        mb={2}
                        bg={occupied ? "gray.100" : "white"}
                        borderWidth={1}
                        borderColor={occupied ? "coolGray.300" : "coolGray.200"}
                        borderRadius="md"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text
                          fontSize="md"
                          color={occupied ? "gray.500" : "black"}
                          fontWeight="medium"
                        >
                          {item.format("HH:mm")}
                        </Text>
                        {occupied ? (
                          <Ionicons name="close-circle" size={20} color="gray.500" />
                        ) : (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={Colors.light.secondary}
                          />
                        )}
                      </Pressable>
                    );
                  }}
                />

              )}
            </>
          }
        ></GlobalModal>
      )}
    </VStack>
  );
};

export default TimePicker;
