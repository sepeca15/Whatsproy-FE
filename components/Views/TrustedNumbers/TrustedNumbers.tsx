import React from "react";
import { Center, CircularProgress, ScrollView, Spinner, Text, View } from "native-base";
import { FormattedMessage } from "react-intl";
import CustomText from "@/components/CustomText";
import { globalStyles } from "@/components/globalStyles";
import { useUser } from "@/hooks/redux/useUser";
import { TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import CardContact from "./components/CardContact";
import ModalSelectContact from "./components/ModalSelectContacts";
import api from "@/services/api/admin";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import { router } from "expo-router";

interface INumberTrusted {
    nombre: any;
    telefono: string;
    id?: number
}

const TrustedNumbers = () => {
    const { user } = useUser();
    const [numbersTrusted, setNumberTrusted] = React.useState<INumberTrusted[]>([])
    const [stateModalSelectContacts, setstateModalSelectContacts] = React.useState<boolean>(false)
    const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
    const [loadingAll, setLoadingAll] = React.useState<boolean>(false);
    const [stateModalDeleteNumber, setStateModalDeleteNumber] = React.useState<boolean>(false);

    const [trustedNumberSelectedId, setTrustedNumberSelectedId] = React.useState<number | null>(null);

    const toggleStateModal = () => setstateModalSelectContacts((prev) => !prev)
    const toggleModalDelete = () => setStateModalDeleteNumber((prev) => !prev)

    const trustedPhones = numbersTrusted.map(n => n.telefono);

    const ImportContacts = async (contacts: any[]) => {
        console.log(contacts);

        const normalize = (num: string) => num.replace(/\D/g, '').replace(/^0+/, '');

        const incomingPhones = new Set(contacts.map(c => normalize(c.numero)));
        const existingPhones = new Set(numbersTrusted.map((n: any) => normalize(n.telefono)));


        const toDelete = numbersTrusted.filter(
            (n: any) => n.id && !incomingPhones.has(normalize(n.telefono))

        ); const toAdd = contacts.filter(c => !existingPhones.has(normalize(c.numero)));
        let arraysIdsDelete: number[] = []
        try {
            await Promise.all(toDelete.map(async (n: any) => {
                await api.numeroConfianza.delete(n.id);
                arraysIdsDelete.push(n.id)
            }));

            await Promise.all(
                toAdd.map(async (c) => {
                    const resp = await api.numeroConfianza.create({
                        nombre: c.nombre,
                        telefono: normalize(c.numero),
                    });
                    if (resp.ok) {
                        setNumberTrusted((prev: any) => ([
                            ...prev.filter((p: any) => normalize(p.telefono) !== normalize(c.numero)),
                            {
                                nombre: resp.data.nombre,
                                telefono: resp.data.telefono,
                                id: resp.data.id
                            }
                        ]));
                    }
                })
            );

        } catch (error: any) {
            console.error("Error importing contacts:", error.response?.data?.message || error.message);
        } finally {
            setLoadingApi(false);
        }
    };


    const deleteNumberTrusted = async () => {
        if (!trustedNumberSelectedId) {
            return;
        }

        setLoadingApi(true)
        try {
            const resp = await api.numeroConfianza.delete(trustedNumberSelectedId)

            if (resp.ok) {
                setNumberTrusted((prev) => {
                    return prev.filter((item) => item.id !== trustedNumberSelectedId)
                })
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoadingApi(false)
        }
    }

    const loadAllNumbersTrusted = async () => {
        setLoadingAll(true)
        try {
            const resp = await api.numeroConfianza.findAll()

            if (resp.ok) {
                setNumberTrusted(resp.data)
            }

        } catch (error: any) {
        } setLoadingAll(false)
    }

    const handleDeleteClick = (id: number) => {
        setTrustedNumberSelectedId(id);
        toggleModalDelete();
    };

    React.useEffect(() => {
        loadAllNumbersTrusted()
    }, [])

    return (
        <View flex={1} w="full" h="full" position={'relative'}>
            <View style={globalStyles.header2}>

                <TouchableOpacity style={globalStyles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <View style={globalStyles.headerContent}>
                    <View style={globalStyles.headerLeft}>
                        <CustomText style={globalStyles.businessName_confianza}>
                            <FormattedMessage id="trustedNumberSettingsTitle" />
                        </CustomText>
                    </View>
                </View>
            </View>

            <View display={'flex'} flexDir={'row'} alignItems={'center'} justifyContent={'center'} flex={1}>
                {
                    loadingAll ?
                        <Spinner size="lg" color={Colors.light.primary} />
                        :

                        numbersTrusted.length > 0 ?
                            <ScrollView h={'full'} flex={1} px={4} py={2}>

                                {
                                    numbersTrusted.map((number, index) => {
                                        return <CardContact clickDeleteAction={() => handleDeleteClick(number.id ?? 0)} key={index} nombre={number.nombre} telefono={number.telefono} />
                                    })
                                }
                            </ScrollView>

                            :
                            <Text textAlign={'center'}>You don't have a phone number set up yet.</Text>

                }
            </View>


            <View style={globalStyles.buttonContainer}>
                <TouchableOpacity
                    style={globalStyles.addButton}
                    activeOpacity={0.8}
                    onPress={toggleStateModal}
                >
                    <View style={{ backgroundColor: Colors.light.primary }}>
                        <Ionicons name="add" size={30} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>
            {
                stateModalSelectContacts &&
                <ModalSelectContact trustedPhones={trustedPhones} loadingApi={loadingApi} onImportContacts={ImportContacts} isOpen={stateModalSelectContacts} onClose={toggleStateModal} />
            }

            {
                stateModalDeleteNumber &&
                <ModalConfirmAction loading={loadingApi} onContinue={deleteNumberTrusted} isOpen={stateModalDeleteNumber} onClose={toggleModalDelete} title={<FormattedMessage id="titleDeleteNumberTrusted" />} message={'descDeleteNumberTrusted'} />
            }
        </View>
    );
};

export default TrustedNumbers