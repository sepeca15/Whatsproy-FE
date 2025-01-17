import { Pressable, StyleSheet, View, Animated } from "react-native";
import { IInfoItem } from "../../types";
import { useState, useRef, useEffect } from "react";
import { Button, ScrollView, Text } from "native-base";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ion from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import api from "@/services/api/admin";
import { IOrderDetails } from "@/components/Views/OrderDetails/OrderDetailsTypes";
import { useRouter } from "expo-router";
import {styles} from './ItemCalendarStyles'

interface IItemCalendar {
    InfoItem: IInfoItem;
    deleteOrder: (orderId : number)=> void;
    confirmOrder: (orderId : number)=> void;
    confirm: boolean
}

interface IDataDetails {
    info: IOrderDetails | null;
    loadingApi: boolean;
}

const ItemCalendar = ({ InfoItem , confirmOrder, deleteOrder, confirm}: IItemCalendar) => {    
    console.log(confirm);
    
    const router = useRouter()
    const [expanded, setExpanded] = useState<boolean>(false);
    const [dataDetails, setDataDetails] = useState<IDataDetails>({
        info: null,
        loadingApi: true,
    });
    const animationHeight = useRef(new Animated.Value(0)).current;

    const toggleLoadingApi = (value: boolean) => {
        setDataDetails((prevState) => ({
            ...prevState,
            loadingApi: value,
        }));
    };

    const onLoadingDetails = async () => {
        toggleLoadingApi(true);
        try {
            const data = await api.order.getOrderDetails(InfoItem.orderId);
            if (data.data) {
                setDataDetails({
                    info: data.data,
                    loadingApi: false,
                });
            }
        } catch (error) {
            console.log(error);
            toggleLoadingApi(false);
        }
    };

    const toggleExpand = () => {
        setExpanded((prevState) => !prevState);
        Animated.timing(animationHeight, {
            toValue: expanded ? 0 : 200,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        if (expanded && !dataDetails.info) {
            onLoadingDetails();
        }
    }, [expanded, dataDetails.info]);

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString('es-ES');
        const timePart = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        return `${datePart.replace(/\//g, '-')}, ${timePart}`;
    };

    const validateFunction = async () => {
        if(confirm){
            router.push({ pathname: '/(tabs)/orderChat', params: { chatId: dataDetails.info?.chatId.id } })
        } else {
            confirmOrder(InfoItem.orderId)
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: confirm === true ? '#128c7e' : '#A9A9A9' }]}>
            <View style={styles.mainInfo}>
                <Text color={"white"}>{InfoItem.clientName}</Text>
                <View style={styles.containerRight}>
                    <Text color={"white"}>{InfoItem.date}</Text>
                    <Pressable onPress={toggleExpand}>
                        <EvilIcons
                            color={"white"}
                            size={24}
                            name={expanded ? "chevron-up" : "chevron-down"}
                        />
                    </Pressable>
                </View>
            </View>
            <Animated.View style={[styles.expandedContent, { minHeight: animationHeight }]}>
                {expanded && (
                    dataDetails.loadingApi ? (
                        <View style={styles.containerSpiner}>
                            <Progress.Circle color={"white"} indeterminate={true} size={40} />
                        </View>
                    ) : (
                        <View style={styles.additionalInfo}>
                            <View style={styles.rowInfo}>
                                <AntDesign name="user" size={16} color={"white"} />
                                <Text color={"white"}>
                                    {dataDetails.info?.client?.name || "Nombre no disponible"}
                                </Text>
                            </View>
                            <View style={styles.rowInfo}>
                                <AntDesign name="phone" size={16} color={"white"} />
                                <Text color={"white"}>
                                    {dataDetails.info?.client?.phone || "Teléfono no disponible"}
                                </Text>
                            </View>
                            <View style={styles.rowInfo}>
                                <MaterialIcons name="access-time" size={16} color={"white"} />
                                <Text color={"white"}>
                                    {dataDetails.info?.estimateTime || "Teléfono no disponible"} mn
                                </Text>
                            </View>
                            <View style={styles.rowInfo}>
                                <AntDesign name="calendar" size={16} color={"white"} />
                                <Text color={"white"}>
                                    {formatDate(dataDetails.info?.date) || "Fecha no disponible"}
                                </Text>
                            </View>
                            <Text color={'white'} fontSize={18} fontWeight={'bold'}>Products</Text>
                            <ScrollView horizontal={false} style={styles.containerProducts}>
                                {
                                    dataDetails.info?.products.map((product, index) => (
                                        <View key={index} style={styles.product}>
                                            <View style={styles.photo}></View>
                                            <View style={styles.info}>
                                                <Text color={'white'} style={styles.nameProduct}>{product.productoInfo.nombre}</Text>
                                                <Text color={'gray.200'} style={styles.cantidad}>Cantidad: {product.cantidad}</Text>
                                            </View>
                                            <Text color={'white'} style={styles.price}>$ {product.cantidad * product.productoInfo.precio}</Text>
                                        </View>
                                    ))
                                }
                            </ScrollView>
                            <View style={styles.total}>
                                <Text fontSize={18} fontWeight={'bold'} color={'white'}>Total:</Text>
                                <View style={styles.rowInfo}>
                                    <FontAwesome name="money" size={12} color={"white"} />
                                    <Text fontSize={18} fontWeight={'bold'} color={'white'}>
                                        {dataDetails.info?.total}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.buttons}>
                                <Pressable style={[styles.buttonNormal, { backgroundColor: confirm ? '128c7e' : 'transparent' }]}>
                                    <Text color={'white'} fontSize={12}>Delete</Text>
                                    <EvilIcons color={'white'} name='close' size={16} />
                                </Pressable>
                                <Pressable onPress={validateFunction} style={[styles.buttonConfirm, { backgroundColor: confirm ? '#1eab9b' : 'black' }]}>
                                    <Text color={'white'} fontSize={12}>{confirm ? 'Go chat' : 'Confirm'}</Text>
                                    <Ion color={'white'} name={confirm ? 'chatbubble' : 'checkmark-done'} size={16} />
                                </Pressable>
                            </View>
                        </View>
                    )
                )}
            </Animated.View>
        </View>
    );
};

export default ItemCalendar;
