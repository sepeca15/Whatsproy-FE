import React, { useState } from "react";
import { TouchableWithoutFeedback, Platform } from "react-native";
import { VStack, FormControl, Input, Modal, Button, View } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "@/hooks/redux/useUser";
import moment from "moment-timezone";
import GlobalModal from "./Modal";

const DateTimeInputField = ({
  date,
  setDate,
  isRequired = true,
  error,
  direction = 'col'
}: any) => {
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const { user } = useUser();
  const dateLocal = moment.tz(date, user.timeZone).local();

  const onChange = (event: any, selectedDate: any) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selectedDate) {
      setDate(moment.tz(selectedDate, user.timeZone).toDate());
    }
  };

  const handleOpenPicker = (pickerMode: any) => {
    setMode(pickerMode);
    setShowPicker(true);
  };

  const formattedDate = moment(date).format("DD/MM/YYYY");
  const formattedTime = moment(date).format("HH:mm");

  return (
    <VStack flex={1} style={{gap: direction === 'row' ? 4 : 0}} display={'flex'} flexDir={direction === 'col' ? 'column' : 'row'}  space={4}>
      <TouchableWithoutFeedback onPress={() => handleOpenPicker("date")}>
        <FormControl flex={'1'} isRequired={isRequired}>
          <FormControl.Label _text={{ fontWeight: "bold" }}>
            Fecha
          </FormControl.Label>
          <Input
            isReadOnly
            onPress={() => handleOpenPicker("date")}
            value={formattedDate}
            placeholder="Seleccionar fecha"
            borderColor="coolGray.300"
            backgroundColor="coolGray.50"
          />
        </FormControl>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => handleOpenPicker("time")}>
        <FormControl flex={1} isInvalid={error} isRequired={isRequired}>
          <FormControl.Label _text={{ fontWeight: "bold" }}>
            Hora
          </FormControl.Label>
          <Input
            isReadOnly
            onPress={() => handleOpenPicker("time")}
            value={formattedTime}
            placeholder="Seleccionar hora"
            borderColor="coolGray.300"
            backgroundColor="coolGray.50"
          />
          {error && (
            <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
          )}
        </FormControl>
      </TouchableWithoutFeedback>

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={dateLocal.toDate()}
          mode={mode}
          display="default"
          onChange={onChange}
        />
      )}

      <GlobalModal
        label={`Seleccionar ${mode === "date" ? "Fecha" : "Hora"}`}
        isVisible={showPicker && Platform.OS === "ios"}
        onClose={() => setShowPicker(false)}
        actions={[
          <Button
            key="Accept"
            onPress={() => setShowPicker(false)}
            size="sm"
            backgroundColor={"#2C2C2C"}
            borderRadius="md"
          >
            Aceptar
          </Button>,
        ]}
        content={
          <View
            width={"100%"}
            flexGrow={1}
            margin={"auto"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            paddingY={5}
            paddingBottom={10}
          >
            <DateTimePicker
              style={{
                marginLeft: -5,
              }}
              value={dateLocal.toDate()}
              mode={mode}
              textColor="black"
              display="spinner"
              onChange={onChange}
            />
          </View>
        }
      />
    </VStack>
  );
};

export default DateTimeInputField;
