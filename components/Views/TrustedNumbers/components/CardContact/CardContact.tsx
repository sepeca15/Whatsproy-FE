import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "native-base";
import React from "react";
import { Pressable } from "react-native";

interface ICardContact {
    nombre: string;
    telefono: any
    clickDeleteAction: () => void
}
const getInitials = (nombre: string) => {
    if (!isNaN(Number(nombre))) return "C";
    const words = nombre.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

const CardContact = ({ nombre, telefono, clickDeleteAction }: ICardContact) => {

    const initials = getInitials(nombre);

    return (
        <View w={'full'} mb={2} bg={'white'} borderWidth={1} rounded={'md'} borderColor={'gray.200'} shadow={1} p={4} display={'flex'} flexDir={'row'} alignItems={'center'}>
            <View display={'flex'} flex={1} flexDir={'row'} alignItems={'center'} style={{ gap: 12 }}>
                <View
                    w={50}
                    h={50}
                    bg={'teal.500'}
                    rounded={'full'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <Text fontSize={18} fontWeight={'bold'} color={'white'}>
                        {initials}
                    </Text>
                </View>
                <View display={'flex'} flexDir={'column'} alignItems={'flex-start'} justifyContent={'space-between'}>
                    <Text fontWeight={'bold'}  >{nombre}</Text>
                    <Text color={'gray.400'} >{telefono}</Text>
                </View>
            </View>
            <Pressable
                onPress={clickDeleteAction}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <MaterialCommunityIcons size={25} color="#A80000" name="delete" />
            </Pressable>
        </View>
    )
}

export default CardContact