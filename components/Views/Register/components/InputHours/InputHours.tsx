import React, { useState } from 'react';
import { Platform, TouchableWithoutFeedback, View } from 'react-native';
import { FormControl, Input } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export const InputHours = ({
  error,
  isRequired,
  value,
  onChange,
  label,
  dateLocal,
}: {
  error?: string;
  isRequired?: boolean;
  value: string;
  onChange: (value: string) => void;
  label: any;
  dateLocal: Date;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleOpenPicker = () => setShowPicker(true);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedTime = moment(selectedDate).format("HH:mm");
      onChange(formattedTime);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOpenPicker}>
      <View style={{ flex: 1 }}>
        <FormControl isInvalid={!!error} isRequired={isRequired}>
          <FormControl.Label _text={{ fontWeight: "bold" }}>
            {label}
          </FormControl.Label>
          <Input
            allowFontScaling={false}
            isReadOnly
            onPressIn={handleOpenPicker}
            value={value}
            placeholder="Seleccionar hora"
            borderColor="coolGray.300"
            backgroundColor="coolGray.50"
          />
          {error && <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>}
        </FormControl>

        {showPicker && Platform.OS === "android" && (
          <DateTimePicker
            value={dateLocal}
            mode="time"
            display="default"
            onChange={handleChange}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
