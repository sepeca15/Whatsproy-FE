import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { styles } from './CardNewPedidoStyles';
import CustomText from '@/components/CustomText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIconss from 'react-native-vector-icons/MaterialCommunityIcons';
import { useOrders } from '@/hooks/redux/useOrders';
import { useRouter } from 'expo-router';
import ModalConfirmAction from '@/components/ModalConfirmAction/ModalConfirmAction';
import { useIntl } from 'react-intl'; // Importa useIntl

interface IOrderData {
    clientName: string;
    direccion: string[];
    numberSender: string;
    total: number;
    orderId: number;
}

interface ICardNewPedido {
    pending: boolean;
    orderData: IOrderData;
}

const CardNewPedido = ({ pending, orderData }: ICardNewPedido) => {
    const router = useRouter();
    const [statusModalDelete, setStateModalDelete] = useState<boolean>(false);
    const { handleDeleteOrder, confirmOrder } = useOrders();
    const keyDeleteType = pending ? 'pending' : 'finished';
    const { clientName, direccion, numberSender, orderId, total } = orderData;
    const intl = useIntl(); // Usa useIntl para obtener el texto traducido

    const handleSendPageDetails = () => {
        router.push({ pathname: '/(tabs)/orderDetails', params: { orderId: orderId, keyDeleteType: keyDeleteType } });
    };

    const handleModal = (value: boolean) => {
        setStateModalDelete(value);
    };

    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <View style={styles.row1}>
                    <View style={styles.column}>
                        <CustomText style={styles.name}>{clientName}</CustomText>
                        <View style={styles.miniSeparator}></View>
                        <CustomText style={styles.text}>{direccion}</CustomText>
                        <View style={styles.separator}></View>
                        <CustomText style={styles.text}>
                            {intl.formatMessage({ id: 'phone', defaultMessage: 'Tel' })}: {numberSender}
                        </CustomText>
                    </View>
                    <View style={styles.column2}>
                        <View style={styles.buttonsTop}>
                            <CustomText style={styles.nuevo}>
                                {intl.formatMessage({ id: 'new', defaultMessage: 'New' })}
                            </CustomText>
                        </View>
                        <CustomText style={styles.semiBold}>
                            {intl.formatMessage({ id: 'total', defaultMessage: 'Total' })}: $ {total}
                        </CustomText>
                    </View>
                </View>
                <View style={styles.row2}>
                    <Pressable accessibilityRole={'button'} onPress={handleSendPageDetails} style={styles.detalles}>
                        <AntDesign color={'black'} name='eyeo' size={16} />
                        <CustomText style={{ color: 'black' }}>
                            {intl.formatMessage({ id: 'details', defaultMessage: 'Details' })}
                        </CustomText>
                    </Pressable>
                    {pending === true ? (
                        <View style={styles.buttons}>
                            <Pressable onPress={() => handleDeleteOrder(orderId, keyDeleteType)}>
                                <EvilIcons color={'black'} name='close' size={20} />
                            </Pressable>
                            <Pressable onPress={() => confirmOrder(orderData)}>
                                <IonIcons color={'black'} name='checkmark-done' size={20} />
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable onPress={() => handleModal(true)} style={styles.deleteButton}>
                            <MaterialIconss name='delete' size={20} color={'#FF6F6F'} />
                        </Pressable>
                    )}
                </View>
            </View>
            <ModalConfirmAction
                onContinue={() => handleDeleteOrder(orderData.orderId, keyDeleteType)}
                title={intl.formatMessage({ id: 'deleteOrderTitle', defaultMessage: 'Delete order' })}
                message={intl.formatMessage({ id: 'deleteOrderMessage', defaultMessage: "If you delete this order, you will not see it here but it will affect your company's statistics." })}
                onClose={() => handleModal(false)}
                isOpen={statusModalDelete}
            />
        </View>
    );
};

export default CardNewPedido;