import { Center, Modal, View, Button, Text, ScrollView } from "native-base";
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
        <Text style={styles.buttonText}>
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
            <ScrollView style={styles.containerScroll}>
              {valueSearch && valuesFiltered.length === 0 ? (
                <Text>
                  {intl.formatMessage({
                    id: "noResultsFound",
                    defaultMessage: "No results found",
                  })}
                </Text>
              ) : (
                (valueSearch ? valuesFiltered : timeZones).map(
                  (element, index) => (
                    <TouchableOpacity
                      onPress={() => selectItem(element)}
                      style={[
                        styles.buttonTz,
                        {
                          backgroundColor:
                            element === timeZoneSelected
                              ? "#e3e3e3"
                              : "transparent",
                        },
                      ]}
                      key={index}
                    >
                      <Text>{element}</Text>
                    </TouchableOpacity>
                  ),
                )
              )}
            </ScrollView>
          </Modal.Content>
        </Center>
      </Modal>
    </View>
  );
};

export default SelectTimeZone;
