import React, { useState } from "react";
import { TouchableWithoutFeedback, Platform } from "react-native";
import { VStack, FormControl, Input, Modal, Button } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "@/hooks/redux/useUser";
import moment from "moment-timezone";

const DateTimeInputField = ({ date, setDate, isRequired = true, error } : any) => {
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>("date");
  const { user } = useUser();
  const dateLocal = moment.tz(date, user.timeZone).local();

  const onChange = (event : any, selectedDate : any) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selectedDate) {
      setDate(moment.tz(selectedDate, user.timeZone).toDate());
    }
  };

  const handleOpenPicker = (pickerMode : any) => {
    setMode(pickerMode);
    setShowPicker(true);
  };

  const formattedDate = moment(date).format("DD/MM/YYYY");
  const formattedTime = moment(date).format("HH:mm");

  return (
    <VStack space={4}>
      <TouchableWithoutFeedback onPress={() => handleOpenPicker("date")}>
        <FormControl isRequired={isRequired}>
          <FormControl.Label _text={{ fontWeight: "bold" }}>
            Fecha
          </FormControl.Label>
          <Input
            isReadOnly
            value={formattedDate}
            placeholder="Seleccionar fecha"
            borderColor="coolGray.300"
            backgroundColor="coolGray.50"
          />
        </FormControl>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => handleOpenPicker("time")}>
        <FormControl isInvalid={error} isRequired={isRequired}>
          <FormControl.Label _text={{ fontWeight: "bold" }}>
            Hora
          </FormControl.Label>
          <Input
            isReadOnly
            value={formattedTime}
            placeholder="Seleccionar hora"
            borderColor="coolGray.300"
            backgroundColor="coolGray.50"
          />
          {error && <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>}
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

      <Modal isOpen={showPicker && Platform.OS === "ios"} onClose={() => setShowPicker(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            Seleccionar {mode === "date" ? "Fecha" : "Hora"}
          </Modal.Header>
          <Modal.Body>
            <DateTimePicker
              value={dateLocal.toDate()}
              mode={mode}
              display="spinner"
              onChange={onChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={() => setShowPicker(false)}>Aceptar</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack>
  );
};

export default DateTimeInputField;
