import * as React from "react"
import { Pressable, Text, View } from "react-native";
import { styles } from "./OrderDetailsStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Progress from "react-native-progress";
import api from "@/services/api/admin";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Octicons from 'react-native-vector-icons/Octicons'
import IonIcons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { Button, ScrollView } from "native-base";
import ProductOrderCard from "./components";
import { IOrderDetails } from "./OrderDetailsTypes";
import { useOrders } from "@/hooks/redux/useOrders";

interface IDetailsOrder {
    loading: boolean,
    data: IOrderDetails | null
}
const initialState = {
    loading: true,
    data: null
}


const OrderDetails = () => {
    const {handleDeleteOrder} = useOrders()
    const router = useRouter()
    const [detailOfOrder, setDetailOfOrder] = React.useState<IDetailsOrder>(initialState)
    const { orderId, keyDeleteType } = useLocalSearchParams()
    const resolvedKeyDeleteType = keyDeleteType as string;

    const loadOrderDetail = async () => {
        try {
            const orderDetailsData = await api.order.getOrderDetails(orderId)
            if (orderDetailsData.ok === true) {
                setDetailOfOrder({ ...detailOfOrder, data: orderDetailsData.data })
            }
        } catch (error: any) {
            console.log('errorrrrrr', JSON.stringify(error))
        } finally {
            setDetailOfOrder((prevState) => ({
                ...prevState,
                loading: false
            }))
        }
    }

    React.useEffect(() => {
        if (orderId) {
            loadOrderDetail()
        }
    }, [])

    const DeleteOrder = async() => {
        if(detailOfOrder.data?.id && keyDeleteType) {
            await handleDeleteOrder(detailOfOrder.data.id, resolvedKeyDeleteType)
            router.push('/(tabs)/pedidos')
        }
    }

    const handleViewChat = () => {
        if(detailOfOrder.data?.chatId) {
            router.push({ pathname: '/(tabs)/orderChat', params: { chatId: detailOfOrder.data?.chatId.id } })
        }
    }

    return (
        detailOfOrder.loading ?
            <View style={styles.containerSpiner}>
                <Progress.Circle color={'#075e54'} indeterminate={true} size={100} />
            </View>
            :
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.columnDate}>
                        <Text style={[styles.textTitle, { fontWeight: "bold" }]}>Order #{detailOfOrder.data?.id}</Text>
                        <View style={styles.containerDate}>
                            <AntDesign name="calendar" color={'white'} />
                            <Text style={styles.text}> 25 de diciembre, 12:36</Text>
                        </View>
                    </View>
                    <Text style={styles.buttonStatus}>{detailOfOrder.data?.confirm ? 'Aceptado' : 'Pending'}</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.containerEstimateTime}>
                        <View style={styles.containerRowinfoGap}>
                            <AntDesign size={20} name="clockcircleo" />
                            <Text style={styles.textBodyBold}>Tiempo Estimado</Text>
                        </View>
                        <Text style={styles.textEstimateTime}>{detailOfOrder.data?.estimateTime} {detailOfOrder?.data?.estimateTime && detailOfOrder?.data?.estimateTime > 60 ? 'hs' : 'mn'} </Text>
                    </View>
                    <View style={styles.containerRowinfo}>
                        <Octicons size={20} style={{ marginRight: 6 }} name="person" />
                        <Text style={styles.textBodyBold}>Cliente: </Text>
                        <Text style={styles.textBodyBold}>{detailOfOrder.data?.client.name}</Text>
                    </View>
                    <View style={styles.containerRowinfo}>
                        <IonIcons size={20} style={{ marginRight: 6, marginLeft: -2 }} name="location-outline" />
                        <Text style={styles.textlocation}>CIudad vieja, Montevideo</Text>
                    </View>
                    <View style={styles.containerProducts}>
                        <Text style={styles.textBodyBig} >Products</Text>
                        <ScrollView horizontal={false} style={styles.products}>
                            {
                                detailOfOrder.data?.products.map((product, index)=> {
                                    return <ProductOrderCard key={index} data={product.productoInfo} cantidad={product.cantidad}/>
                                })
                            }
                        </ScrollView>
                    </View>

                </View>
                <View style={styles.footer}>
                    <View style={styles.containerrColumn}>
                        <View style={styles.containerRow}>
                            <Text style={styles.textBodyBold}>Total</Text>
                            <Text style={styles.textBodyBold}>$ {detailOfOrder.data?.total}</Text>
                        </View>
                        <View style={styles.ContainerButtons}>
                            <Button style={styles.buttonDelete}>
                                <Pressable onPress={DeleteOrder} accessibilityRole="button" style={styles.containerRowinfoGap}>
                                    <MaterialIcons size={16} color={'black'} name="delete" />
                                    <Text style={{ color: 'black' }}>Eliminar</Text>
                                </Pressable>
                            </Button>
                            <Button style={styles.buttonViewChat}>
                                <Pressable onPress={handleViewChat} style={styles.containerRowinfoGap}>
                                    <IonIcons accessibilityRole="button" size={16} color={'white'} name="chatbubble-outline" />
                                    <Text style={{ color: 'white' }}>Ir al chat</Text>
                                </Pressable>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
    );
}

export default OrderDetails

