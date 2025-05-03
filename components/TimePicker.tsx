import React, { useState } from "react";
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

const generateTimeSlots = (
  startHour: number,
  endHour: number,
  interval: number
) => {
  const times = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = moment().set({ hour, minute, second: 0, millisecond: 0 });
      times.push(time);
    }
  }
  return times;
};

const TimePicker = ({
  date,
  setDate,
  type = "date",
  interval = 30,
  startHour = 0,
  endHour = 23,
  isRequired = true,
  error,
  checkAvailable,
  occupiedTimes = [],
}: any) => {
  const [showPicker, setShowPicker] = useState(false);
  const formattedDate = moment(date).format("DD/MM/YYYY");

  const formattedTime = moment(date).format("HH:mm");
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  const getFormattedValue = () => {
    if (type === "date") return formattedDate;
    if (type === "time") return formattedTime;
    return formattedDateTime;
  };

  const timeSlots = generateTimeSlots(startHour, endHour, interval);

  const isOccupied = (time: moment.Moment) =>
    occupiedTimes.some((occupiedTime: string | Date) => {
      if (typeof occupiedTime === "string") {
        const [hours, minutes] = occupiedTime.split(":").map(Number);
        const occupiedDate = moment().set({ hour: hours, minute: minutes });
        return occupiedDate.isSame(time, "minute");
      }

      return moment(occupiedTime).isSame(time, "minute");
    });

  const handleTimeSelect = (time: moment.Moment) => {
    if (!isOccupied(time)) {
      const updatedDate = moment(date).set({
        hour: time.hour(),
        minute: time.minute(),
        second: 0,
        millisecond: 0,
      });
      setDate(updatedDate.toDate()); // Convertimos de nuevo a Date para actualizar el estado
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
                `Seleccionar ${
                  type === "date"
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
          label={type === "date" ? "Seleccionar Fecha" : "Seleccionar Hora"}
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
                Cancelar
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
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="gray.500"
                          />
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
