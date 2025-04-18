import * as React from "react"
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, Dimensions } from "react-native"
import { styles } from "./OrderDetailsStyles"
import { useLocalSearchParams, useRouter } from "expo-router"
import * as Progress from "react-native-progress"
import api from "@/services/api/admin"
import AntDesign from "react-native-vector-icons/AntDesign"
import Octicons from "react-native-vector-icons/Octicons"
import IonIcons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { ScrollView } from "native-base"
import ProductOrderCard from "./components/ProductOrderCard"
import type { IOrderDetails } from "./OrderDetailsTypes"
import { useOrders } from "@/hooks/redux/useOrders"
import { useUser } from "@/hooks/redux/useUser"
import moment from "moment"
import "moment/locale/es"
import { FormattedMessage } from "react-intl"
import { Colors } from "@/constants/Colors"

interface IDetailsOrder {
  loading: boolean
  data: IOrderDetails | null
}

const initialState = {
  loading: true,
  data: null,
}

const OrderDetails = () => {
  const { handleDeleteOrder } = useOrders()
  const router = useRouter()
  const { user } = useUser()
  const [detailOfOrder, setDetailOfOrder] = React.useState<IDetailsOrder>(initialState)
  const { orderId, keyDeleteType } = useLocalSearchParams()
  const resolvedKeyDeleteType = keyDeleteType as "pending" | "finished"

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const slideAnim = React.useRef(new Animated.Value(30)).current

  const loadOrderDetail = async () => {
    try {
      const orderDetailsData = await api.order.getOrderDetails(orderId)
      console.log(orderDetailsData)

      if (orderDetailsData.ok === true) {
        setDetailOfOrder({ ...detailOfOrder, data: orderDetailsData.data })
      }
    } catch (error: any) {
      console.log("error", JSON.stringify(error))
    } finally {
      setDetailOfOrder((prevState) => ({
        ...prevState,
        loading: false,
      }))
    }
  }

  React.useEffect(() => {
    if (orderId) {
      loadOrderDetail()
    }
  }, [])

  React.useEffect(() => {
    if (!detailOfOrder.loading) {
      // Start animations when data is loaded
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [detailOfOrder.loading])

  const DeleteOrder = async () => {
    if (detailOfOrder.data?.id && keyDeleteType) {
      await handleDeleteOrder(detailOfOrder.data.id, resolvedKeyDeleteType)
      router.push("/(tabs)/pedidos")
    }
  }

  const handleViewChat = () => {
    if (detailOfOrder.data?.chatId) {
      router.push({
        pathname: "/(tabs)/orderChat",
        params: { chatId: detailOfOrder.data?.chatId.id },
      })
    }
  }

  if (detailOfOrder.loading) {
    return (
      <View style={styles.loadingContainer}>
        <Progress.Circle 
          color={Colors.light.primary} 
          indeterminate={true} 
          size={70} 
          borderWidth={3} 
          strokeCap="round" 
        />
        <Text style={styles.loadingText}>
          <FormattedMessage id="loading" defaultMessage="Cargando..." />
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.primary} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={22} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            <FormattedMessage id="orderDetails" defaultMessage="Detalles del Pedido" />
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.orderNumberCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.orderNumberContent}>
            <View>
              <Text style={styles.orderNumberLabel}>
                <FormattedMessage id="orderNumber" defaultMessage="Pedido #" />
              </Text>
              <Text style={styles.orderNumberValue}>{detailOfOrder.data?.id}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {detailOfOrder.data?.confirm ? (
                  <FormattedMessage id="accepted" defaultMessage="Aceptado" />
                ) : (
                  <FormattedMessage id="pending" defaultMessage="Pendiente" />
                )}
              </Text>
            </View>
          </View>
          <View style={styles.orderDateContainer}>
            <AntDesign name="calendar" size={16} color={Colors.light.icon} />
            <Text style={styles.orderDateText}>
              {moment(detailOfOrder.data?.date).locale("es").format("D [de] MMMM [de] YYYY")}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.sectionCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <AntDesign name="clockcircleo" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>
              <FormattedMessage id="estimatedTime" defaultMessage="Tiempo Estimado" />
            </Text>
          </View>
          <Text style={styles.estimateTimeValue}>
            {detailOfOrder.data?.estimateTime}{" "}
            <Text style={styles.estimateTimeUnit}>
              {detailOfOrder?.data?.estimateTime && detailOfOrder?.data?.estimateTime > 60 ? "horas" : "minutos"}
            </Text>
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.sectionCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Octicons name="person" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>
              <FormattedMessage id="client" defaultMessage="Cliente" />
            </Text>
          </View>
          <Text style={styles.clientName}>{detailOfOrder.data?.client.name}</Text>

          <View style={styles.addressContainer}>
            <IonIcons name="location-outline" size={20} color={Colors.light.icon} />
            <Text style={styles.addressText}>
              {detailOfOrder.data?.infoLines?.direccion ? (
                detailOfOrder.data.infoLines.direccion
              ) : (
                <FormattedMessage id="noAddress" defaultMessage="Sin dirección" />
              )}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.sectionCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <MaterialIcons name="shopping-bag" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>
              <FormattedMessage id="products" defaultMessage="Productos" />
            </Text>
          </View>

          <View style={styles.productsList}>
            {detailOfOrder.data?.products.map((product, index) => (
              <ProductOrderCard key={index} data={product.productoInfo} cantidad={product.cantidad} />
            ))}
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>
              <FormattedMessage id="total" defaultMessage="Total" />
            </Text>
            <Text style={styles.totalValue}>$ {detailOfOrder.data?.total}</Text>
          </View>
        </Animated.View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={DeleteOrder} activeOpacity={0.7}>
            <MaterialIcons name="delete-outline" size={20} color={Colors.light.text} />
            <Text style={styles.deleteButtonText}>
              <FormattedMessage id="delete" defaultMessage="Eliminar" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.chatButton} onPress={handleViewChat} activeOpacity={0.7}>
            <IonIcons name="chatbubble-outline" size={20} color="white" />
            <Text style={styles.chatButtonText}>
              <FormattedMessage id="goToChat" defaultMessage="Ir al chat" />
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetails
