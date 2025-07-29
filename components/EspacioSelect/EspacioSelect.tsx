import React from "react";
import {
  Actionsheet,
  Box,
  HStack,
  Pressable,
  Text,
  useDisclose,
  VStack,
  Icon,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { FormattedMessage } from "react-intl";

export interface Espacio {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  capacidad: number | null;
  pedido: any[];
}

type Props = {
  espacios: Espacio[];
  selectedId: number | null;
  onSelect: (espacioId: number) => void;
};

const EspacioSelect = ({ espacios, selectedId, onSelect }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const selectedEspacio = espacios.find((e) => e.id === selectedId);

  return (
    <Box>
      <Pressable
        onPress={onOpen}
        bg="white"
        borderWidth={1}
        borderColor="gray.300"
        borderRadius={12}
        px={4}
        py={3}
      >
        <HStack alignItems="center" paddingRight={5} justifyContent="space-between">
          <HStack alignItems="start" justifyContent="start" space={3}>
            {selectedEspacio ? (
              <Text allowFontScaling={false} fontWeight="medium" marginTop={0.5} color="gray.500">
                {selectedEspacio.nombre}
              </Text>
            ) : (
              <Text allowFontScaling={false} color="gray.500">
                <FormattedMessage id="selectEspacio" />
              </Text>
            )}
          </HStack>
          <Icon as={MaterialIcons} name="arrow-drop-down" size={6} />
        </HStack>
      </Pressable>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          {espacios.map((espacio) => {
            const isSelected = espacio.id === selectedId;

            return (
              <Pressable
                key={espacio.id}
                w="100%"
                onPress={() => {
                  onSelect(espacio.id);
                  onClose();
                }}
                borderRadius={20}
                bg={isSelected ? "gray.200" : "transparent"}
              >
                <VStack alignItems="flex-start" px={4} py={3} w="100%">
                  <Text allowFontScaling={false} fontWeight="medium">
                    {espacio.nombre}
                  </Text>
                  <Text allowFontScaling={false} fontSize="xs" color="gray.500">
                    {espacio.ubicacion}
                  </Text>
                </VStack>
              </Pressable>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};

export default EspacioSelect;
