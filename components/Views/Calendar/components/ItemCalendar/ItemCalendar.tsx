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


interface IItemCalendar {
    InfoItem: IInfoItem;
}

interface IDataDetails {
    info: IOrderDetails | null;
    loadingApi: boolean;
}

const ItemCalendar = ({ InfoItem }: IItemCalendar) => {
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
                console.log("Order Details:", data.data);
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

    return (
        <View style={styles.container}>
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
                                <Pressable style={styles.buttonNormal}>
                                    <Text color={'white'} fontSize={12}>Delete</Text>
                                    <EvilIcons color={'white'} name='close' size={16} />
                                </Pressable>
                                {
                                    dataDetails.info?.confirm ?
                                        <Pressable style={styles.buttonConfirm}>
                                            <Text color={'white'} fontSize={12}>Confirm</Text>
                                            <Ion color={'white'} name='checkmark-done' size={16} />
                                        </Pressable>
                                        :
                                        <Pressable style={styles.buttonConfirm}>
                                            <Text color={'white'} fontSize={12}>Go Chat</Text>
                                            <Ion color={'white'} name='chatbubble' size={16} />
                                        </Pressable>
                                }
                            </View>
                        </View>
                    )
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        color: "white",
        marginBottom: 10,
        width: "100%",
        backgroundColor: "#128c7e",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        display: "flex",
        flexDirection: "column",
    },
    mainInfo: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    containerRight: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    expandedContent: {
        overflow: "hidden",
        width: "100%",
        paddingHorizontal: 0,
    },
    additionalInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 10,
        flex: 1,
    },
    product: {
        padding: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    photo: {
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        opacity: 0.8
    },
    containerSpiner: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttons: {
        width:'100%',
        display: 'flex',
        flexDirection: 'row',  
        justifyContent: 'flex-end',  
        alignItems: 'center',  
        gap: 10,  
    },
    rowInfo: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    containerProducts: {
        paddingBottom: 20,
        height: 120,
        width: '100%',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 4,
    },
    info: {
        marginLeft: 20,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6
    },
    price: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    nameProduct: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cantidad: {
        fontSize: 14,
    },
    total: {
        width: '100%',
        marginTop: 6,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonConfirm: {
        gap:8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1eab9b',
        color: 'white',
        borderRadius: 8,
        paddingVertical: 8, 
        paddingHorizontal: 12,  
    },
    buttonNormal: {
        gap:8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#128c7e',
        color: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'white',
        paddingVertical: 8,  
        paddingHorizontal: 12, 
    },
});

export default ItemCalendar;
