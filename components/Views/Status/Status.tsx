import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Pressable, StatusBar, Text, View } from 'native-base';
import api from '@/services/api/admin';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ModalCreateOrEditStatus from './components/ModalCreateOrEditStatus';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import ModalConfirmAction from '@/components/ModalConfirmAction/ModalConfirmAction';
import { Colors } from "@/constants/Colors";
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
import { styles } from './StatusStyles';
import { FormattedMessage } from 'react-intl';
import { router } from 'expo-router';
import CustomText from '@/components/CustomText';

export interface IEstado {
    id: number;
    nombre: string;
    es_defecto: boolean;
    finalizador: boolean;
    tipoServicioId: number;
    order: number | null;
    createdAt: string;
    updatedAt: string;
}

const StatusView = () => {
    const [status, setStatus] = useState<IEstado[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IEstado | null>(null);
    const [modalDelete, setModalDelete] = useState<IEstado | null>(null);
    const originalOrderRef = useRef<IEstado[]>([]);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const resp = await api.status.findAll();
            if (resp.ok) setStatus(resp.data);
        } catch (error: any) {
            console.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (updated: IEstado) => {
        try {
            await api.status.update(updated.id, updated);
            fetchStatus();
        } catch (error: any) {
            console.error(error.response?.data?.message);
        }
    };


    const deleteStatus = async (id: number) => {
        try {
            const resp = await api.status.delete(id);
            if (resp.ok) fetchStatus();
        } catch (error: any) {
            console.error(error.response.data.message);
        }
    };

    const handleDragBegin = () => {
        originalOrderRef.current = [...status];
    };

    const handleDragEnd = async ({ data, from, to }: { data: IEstado[]; from: number; to: number }) => {
        if (from === to) return;

        const movedItem = status[from];
        const newOrder = to + 1;

        try {
            await updateStatus({ ...movedItem, order: newOrder });
        } catch (err) {
            console.error('Error al actualizar el orden', err);
        }
    };

    const toggleModal = () => setModalVisible((prev) => !prev);
    const toggleDeleteModal = () => setModalDelete(null);

    const handleEdit = (item: IEstado) => {
        setSelectedItem(item);
        toggleModal();
    };

    const addOrEditNewStatus = () => {
        fetchStatus()
    };

    const renderItem = ({ item, drag, isActive }: RenderItemParams<IEstado>) => (
        <Box w="full" flex={1}>
            <Pressable
                onLongPress={drag}
                delayLongPress={1}
                flexDir="row"
                alignItems="center"
                mb={2}
                px={4}
                py={4}
                bg={isActive ? 'gray.400' : 'white'}
                rounded="xl"
            >
                <View flexDir="row" alignItems="center" flex={0.2}>
                    <FontAwesome name="reorder" color="black" />
                    <Text ml={2}>{item.order}</Text>
                </View>
                <View flex={0.3}>
                    <Text>{item.nombre}</Text>
                </View>
                <View flex={0.25}>
                    <Text>{item.finalizador ? 'SI' : 'NO'}</Text>
                </View>
                <View flex={0.25} flexDir="row" alignItems="center" justifyContent="flex-end" style={{ gap: 4 }}>
                    <Pressable
                        rounded="full"
                        bg="red.500"
                        p={2.5}
                        _pressed={{ bg: 'red.600' }}
                        onPress={() => setModalDelete(item)}
                    >
                        <MaterialCommunityIcons name="delete" size={18} color="white" />
                    </Pressable>
                    <Pressable
                        rounded="full"
                        borderWidth={1}
                        borderColor="gray.400"
                        p={2.5}
                        bg="white"
                        _pressed={{ bg: 'gray.100' }}
                        onPress={() => handleEdit(item)}
                    >
                        <FontAwesome name="edit" size={18} color="#4A5568" />
                    </Pressable>
                </View>
            </Pressable>
        </Box>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Animated.View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <AntDesign name="arrowleft" size={22} color="white" />
                    </TouchableOpacity>
                    <View style={styles.headerTitle}>
                        <CustomText
                            style={styles.businessName}
                            accessibilityLabel="Pedidos"
                        >
                            <FormattedMessage
                                id="statusTitlePage"
                            />
                        </CustomText>
                    </View>
                </View>
            </Animated.View>
            <View flex={1} w="full" position="relative" px={4} py={2} alignItems="center">
                <View mb={4} w={'full'} borderColor={'blue.600'} borderWidth={1} rounded={'md'} bg={'blue.100'} display={'flex'} alignItems={'center'} justifyContent={'center'} px={4} py={2}>
                    <Text color={'blue.600'} >Drag and drop elements and create the status for the order you want!</Text>
                </View>
                <View style={{ flex: 1, width: '100%' }}>
                    {loading ? (
                        <View h="full" justifyContent="center" alignItems="center">
                            <Progress.Circle color={Colors.light.primary} indeterminate size={100} />
                        </View>
                    ) : status.length > 0 ? (
                        <View>
                            <View px={4} flexDir="row">
                                <View flex={0.2}><Text>Orden</Text></View>
                                <View flex={0.3}><Text>Nombre</Text></View>
                                <View flex={0.25}><Text>Finalizador</Text></View>
                                <View flex={0.25}><Text>Acciones</Text></View>
                            </View>
                            <DraggableFlatList
                                contentContainerStyle={{ paddingBottom: 80, paddingTop: 16 }}
                                data={status}
                                keyExtractor={(item) => item.id.toString()}
                                onDragEnd={handleDragEnd}
                                onDragBegin={handleDragBegin}
                                renderItem={renderItem}
                            />
                        </View>
                    ) : (
                        <View justifyContent="center" alignItems="center">
                            <Text>No hay estados creados aún.</Text>
                        </View>
                    )}
                </View>

                <Button
                    onPress={toggleModal}
                    w="50px"
                    h="50px"
                    justifyContent="center"
                    alignItems="center"
                    bg="teal.600"
                    rounded="full"
                    position="absolute"
                    bottom={4}
                    right={4}
                >
                    <Ionicons name="add" color="white" size={26} />
                </Button>

                <ModalCreateOrEditStatus
                    selectedItem={selectedItem}
                    addOrEditNewStatus={addOrEditNewStatus}
                    isOpen={modalVisible}
                    onClose={() => {
                        toggleModal();
                        setSelectedItem(null);
                    }}
                />

                <ModalConfirmAction
                    isOpen={!!modalDelete}
                    onClose={toggleDeleteModal}
                    title="Borrar estado"
                    message="¿Seguro que deseas eliminar este estado?"
                    onContinue={() => {
                        if (modalDelete) deleteStatus(modalDelete.id);
                        toggleDeleteModal();
                    }}
                />
            </View>
        </GestureHandlerRootView>
    );
};

export default StatusView;
