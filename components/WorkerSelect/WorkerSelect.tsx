import React, { useState } from "react";
import {
  Actionsheet,
  Avatar,
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
import { useUser } from "@/hooks/redux/useUser";

type Worker = {
  id: number;
  nombre: string;
  apellido: string;
  image: string;
};

type Props = {
  workers: Worker[];
  selectedId: number | null;
  onSelect: (workerId: number) => void;
};

const WorkerSelect = ({ workers, selectedId, onSelect }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { user } = useUser();
  const selectedWorker = workers.find((w) => w.id === selectedId);

  return (
    <Box>
      <Pressable
        onPress={onOpen}
        bg="white"
        borderWidth={1}
        borderColor="gray.300"
        borderRadius={12}
        px={4}
        py={5}
      >
        <HStack
          alignItems="center"
          paddingRight={5}
          justifyContent="space-between"
        >
          <HStack alignItems="start" justifyContent={"start"} space={3}>
            {selectedWorker ? (
              <>
                <Avatar width={7} height={7} source={{ uri: selectedWorker.image }} />
                <Text fontWeight={"medium"} marginTop={0.5} color={"gray.500"}>
                  {selectedWorker.nombre} {selectedWorker.apellido}  {user?.id === selectedWorker?.id ? <>(<FormattedMessage id="me" />)</> : ""}
                </Text>
              </>
            ) : (
               <>
              <Text color="gray.500"><FormattedMessage id="selectWorker" /></Text>
              </>
            )}
          </HStack>
          <Icon as={MaterialIcons} name="arrow-drop-down" size={6} />
        </HStack>
      </Pressable>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          {workers.map((worker) => {
            const isSelected = worker.id === selectedId;

            return (
              <Pressable
                key={worker.id}
                w="100%"
                onPress={() => {
                  onSelect(worker.id);
                  onClose();
                }}
                borderRadius={20}
                bg={isSelected ? "gray.200" : "transparent"}
              >
                <HStack alignItems="center" space={3} px={4} py={3} w="100%">
                  <Avatar size="sm" source={{ uri: worker.image }} />
                  <Text>
                    {worker.nombre} {worker.apellido} {user?.id === worker?.id ? <>(<FormattedMessage id="me" />)</> : ""}
                  </Text>
                </HStack>
              </Pressable>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};

export default WorkerSelect;
