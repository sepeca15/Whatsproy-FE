import { Center, Modal, View, Button, Text, ScrollView, FlatList } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import * as moment from "moment-timezone";
import { styles } from "./SelectTimeZoneStyles";
import { useIntl } from "react-intl"; // Importa useIntl

interface ISelectTimeZone {
  timeZones: string[];
  timeZoneSelected: string;
  selectTimeZone: (value: string) => void;
}

const SelectTimeZone = ({
  timeZones,
  timeZoneSelected,
  selectTimeZone,
}: ISelectTimeZone) => {
  const [stateModal, setStateModal] = useState<boolean>(false);
  const [valueSearch, setValueSearch] = useState<string>("");
  const [valuesFiltered, setValuesFiltered] = useState<string[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const intl = useIntl(); // Usa useIntl para obtener la instancia de intl

  const handleModal = () => {
    setStateModal((prevState) => !prevState);
  };

  const handleSearch = (searchTerm: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchTerm) {
        const filtered = timeZones.filter((zone) =>
          zone.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setValuesFiltered(filtered);
      } else {
        setValuesFiltered(timeZones);
      }
    }, 300);

    setDebounceTimeout(timeout);
  };

  useEffect(() => {
    handleSearch(valueSearch);
  }, [valueSearch]);

  const selectItem = (value: string) => {
    selectTimeZone(value);
    handleModal();
  };

  return (
    <View>
      <TouchableOpacity onPress={handleModal} style={styles.container}>
        <Text allowFontScaling={false} style={styles.buttonText}>
          {timeZoneSelected
            ? timeZoneSelected
            : intl.formatMessage({
              id: "selectTimeZone",
              defaultMessage: "Select a time zone",
            })}
        </Text>
      </TouchableOpacity>
      <Modal
        style={styles.modalContainer}
        isOpen={stateModal}
        onClose={handleModal}
      >
        <Center>
          <Modal.Content style={styles.modalContent}>
            <InputField
              label={intl.formatMessage({
                id: "searchTimeZone",
                defaultMessage: "Search Time Zone",
              })}
              placeholder={intl.formatMessage({
                id: "enterTimeZone",
                defaultMessage: "Enter time zone...",
              })}
              onChangeText={(text) => setValueSearch(text)}
            />
            <FlatList
              style={styles.containerScroll}
              data={valueSearch ? valuesFiltered : timeZones}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectItem(item)}
                  style={[
                    styles.buttonTz,
                    {
                      backgroundColor:
                        item === timeZoneSelected ? "#e3e3e3" : "transparent",
                    },
                  ]}
                >
                  <Text allowFontScaling={false}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                valueSearch ? (
                  <Text allowFontScaling={false}>
                    {intl.formatMessage({
                      id: "noResultsFound",
                      defaultMessage: "No results found",
                    })}
                  </Text>
                ) : null
              }
            />
          </Modal.Content>
        </Center>
      </Modal>
    </View>
  );
};

export default SelectTimeZone;
