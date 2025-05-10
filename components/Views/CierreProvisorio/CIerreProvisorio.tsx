import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Spinner } from "native-base";
import { TouchableOpacity } from "react-native";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FormattedMessage } from "react-intl";

import CustomText from "@/components/CustomText";
import { globalStyles } from "@/components/globalStyles";
import ModalCreateCierre from "./ModalCreateCierre";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import { useUser } from "@/hooks/redux/useUser";
import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";
import moment from "moment-timezone";

type Cierre = {
    id: number;
    inicio: string;
    final: string;
    estado: string;
};

type status = 'Active' | 'Pending' | 'Finished'

export const CierreProvisorio = () => {
    const { user } = useUser();
    const { showToast } = useToastContext();
    const now = moment().tz(user.timeZone);

    const [cierres, setCierres] = useState<Cierre[]>([]);
    const [modalState, setModalState] = useState(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
    const [loadingApi, setLoadingApi] = useState(false);
    const [loadingCierres, setloadingCierres] = useState(false);

    const [selectedCierreId, setSelectedCierreId] = useState<number | null>(null);

    const fetchCierres = useCallback(async () => {
        setloadingCierres(true)
        try {
            const resp = await api.cierreProvisorio.getAll(user.id_empresa);
            if (resp.ok) setCierres(resp.data);
        } catch (error) {
            console.error(error);
        } finally {
            setloadingCierres(false)
        }
    }, [user.id_empresa]);

    useEffect(() => {
        fetchCierres();
    }, [fetchCierres]);

    const toggleModal = () => setModalState(prev => !prev);
    const toggleModalConfirmDelete = () => setModalConfirmDelete(prev => !prev);

    const createNewCierre = async (inicio: Date, fin: Date) => {
        if (inicio >= fin) {
            showToast({
                title: "Fechas inválidas",
                description: <FormattedMessage id="cierreProvisorioErrorFechas" />,
                status: "error",
            });
            return;
        }

        setLoadingApi(true);
        try {
            const resp = await api.cierreProvisorio.create({
                fecha_inicio: inicio,
                fecha_fin: fin,
                empresaId: user.id_empresa,
            });

            if (resp.ok) {
                showToast({
                    title: "Creado exitosamente",
                    description: <FormattedMessage id="cierreProvisorioCreado" />,
                    status: "success",
                });
                toggleModal();
                setCierres(prev => [...prev, resp.data]);
            }
        } catch (error) {
            console.error(error);
            showToast({
                title: "Error",
                description: <FormattedMessage id="errorCreandoCierreProvisorio" />,
                status: "error",
            });
        } finally {
            setLoadingApi(false);
        }
    };

    const handleDeleteClick = (id: number) => {
        setSelectedCierreId(id);
        toggleModalConfirmDelete();
    };

    const confirmDelete = async () => {
        if (!selectedCierreId) return;

        setLoadingApi(true);
        try {
            const resp = await api.cierreProvisorio.delete(selectedCierreId);
            if (resp.ok) {
                setCierres(prev => prev.filter(c => c.id !== selectedCierreId));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingApi(false);
        }
    };

    return (
        <View flex={1} w="full" h="full" position={'relative'}>
            <View style={globalStyles.header}>
                <View style={globalStyles.headerContent}>
                    <View style={globalStyles.headerLeft}>
                        <CustomText style={globalStyles.businessName}>
                            <FormattedMessage id="cierreProvisorioTittleSettings" />
                        </CustomText>
                    </View>
                </View>
            </View>

            <ScrollView w="full" flex={1} p={3}>
                <View
                    flex={1}
                    p={0}
                    w="full"
                    flexDir="column"
                    style={{ gap: 12 }}
                >
                    {

                        loadingCierres ?
                            <Spinner mt={'1/2'} color={"black"} size={40} />
                            :
                            cierres.length > 0 ? (
                                cierres.map((cierre) => {
                                    const inicio = moment.tz(cierre.inicio, user.timeZone);
                                    const final = moment.tz(cierre.final, user.timeZone);

                                    const currentStatus: status =
                                        now.isBefore(inicio) ? "Pending" :
                                            now.isBetween(inicio, final, undefined, '[)') ? "Active" :
                                                "Finished";
                                    return (
                                        <View
                                            key={cierre.id}
                                            w="full"
                                            px={4}
                                            py={3}
                                            display={'flex'}
                                            flexDirection={'row'}
                                            borderBottomWidth={1}
                                            borderColor="gray.200"
                                            bg={'white'}
                                            shadow={'2'}
                                            rounded={'md'}
                                        >
                                            <View w={'2/3'} display={'flex'} flexDir={'column'} style={{ gap: 12 }} alignItems={'flex-start'}>
                                                <View display={'flex'} flexDir={'row'} alignItems={'center'} style={{ gap: 6 }}>
                                                    <View bg={'green.100'} color={'green.700'} p={3} rounded={'full'}>
                                                        <AntDesign name="calendar" color={'#15803D'} size={18} />
                                                    </View>
                                                    <View display={'flex'} flexDir={'column'} alignItems={'flex-start'}>
                                                        <Text fontWeight={'bold'} color={'gray.400'}>
                                                            <FormattedMessage id="cierreProvisorioModalCreateText1" />
                                                        </Text>
                                                        <Text fontWeight={'bold'} color="gray.600" flex={1.5}>
                                                            {moment.tz(cierre.inicio, user.timeZone).format("D [of] MMMM, HH:mm")}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View display={'flex'} flexDir={'row'} alignItems={'center'} style={{ gap: 6 }}>
                                                    <View bg={'green.100'} color={'green.700'} p={3} rounded={'full'}>
                                                        <AntDesign name="calendar" color={'#15803D'} size={18} />
                                                    </View>
                                                    <View display={'flex'} flexDir={'column'} alignItems={'flex-start'}>
                                                        <Text fontWeight={'bold'} color={'gray.400'}>
                                                            <FormattedMessage id="cierreProvisorioModalCreateText2" />
                                                        </Text>
                                                        <Text fontWeight={'bold'} color="gray.600" flex={1.5}>
                                                            {moment.tz(cierre.final, user.timeZone).format("D [of] MMMM, HH:mm")}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View alignSelf={'flex-start'} flex={1} display={'flex'} flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} style={{ gap: 12 }}>
                                                <View borderRadius="full" backgroundColor={
                                                    currentStatus === 'Pending'
                                                        ? 'yellow.100'
                                                        : currentStatus === 'Active'
                                                            ? 'green.100'
                                                            : 'gray.00'
                                                }>
                                                    <Text
                                                        px={3}
                                                        py={1}
                                                        fontSize="sm"
                                                        fontWeight="bold"
                                                        borderRadius="full"
                                                        color={
                                                            currentStatus === 'Pending'
                                                                ? 'yellow.800'
                                                                : currentStatus === 'Active'
                                                                    ? 'green.800'
                                                                    : 'gray.700'
                                                        }
                                                    >
                                                        {currentStatus}
                                                    </Text>
                                                </View>
                                                <Pressable
                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                    onPress={() => handleDeleteClick(cierre.id)}
                                                >
                                                    <MaterialCommunityIcons size={25} color="#A80000" name="delete" />
                                                </Pressable>

                                            </View>
                                        </View>
                                    )
                                })
                            ) : (
                                <Text color="gray.600" textAlign="center" m="auto">
                                    <FormattedMessage id="cierreProvisorioEmpty" defaultMessage="You don't have any scheduled closings yet." />
                                </Text>
                            )}
                </View>
            </ScrollView>

            <View style={globalStyles.buttonContainer}>
                <TouchableOpacity
                    onPress={toggleModal}
                    style={globalStyles.addButton}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {modalState && (
                <ModalCreateCierre
                    onCreate={createNewCierre}
                    open={modalState}
                    onClose={toggleModal}
                    loading={loadingApi}
                />
            )}

            {modalConfirmDelete && (
                <ModalConfirmAction
                    isOpen={modalConfirmDelete}
                    onClose={toggleModalConfirmDelete}
                    onContinue={confirmDelete}
                    loading={loadingApi}
                    title={<FormattedMessage id="modalConfirmDeleteCierreProvisorioTitle" />}
                    message={<FormattedMessage id="modalConfirmDeleteCierreProvisorioDesc" />}
                />
            )}
        </View>
    );
};
