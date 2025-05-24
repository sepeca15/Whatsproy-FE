import * as React from "react";
import {
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Progress from "react-native-progress";
import api from "@/services/api/admin";
import { ScrollView, Text, View } from "native-base";
import moment from "moment";
import "moment/locale/es";
import { FormattedMessage } from "react-intl";
import { Colors } from "@/constants/Colors";
import type { IEstado } from "../Status/Status";
import { styles } from "./OrderDetailsStyles";

// Icons
import AntDesign from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import IonIcons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Components
import ProductOrderCard from "./components/ProductOrderCard";
import CustomModalPicker from "./components/ModalPicker";
import StatusTimeline from "./components/StatusTimeline";
import type { IOrderDetails } from "./OrderDetailsTypes";
import { useOrders } from "@/hooks/redux/useOrders";
import { useUser } from "@/hooks/redux/useUser";
import { io } from "socket.io-client";
import { useToastContext } from "@/contexts/ToastContext";
import { ID_TIPOSERVICIO_RESERVA } from "@/services/api/tiposervicio/tiposervicio.type";

interface IDetailsOrder {
  loading: boolean;
  data: IOrderDetails | null;
}

const initialState: IDetailsOrder = {
  loading: true,
  data: null,
};

const OrderDetails = () => {
  const { handleDeleteOrder } = useOrders();
  const router = useRouter();
  const { user } = useUser();
  const [detailOfOrder, setDetailOfOrder] =
    React.useState<IDetailsOrder>(initialState);

    console.log("detailOfOrder", detailOfOrder)
  const { orderId, keyDeleteType } = useLocalSearchParams();
  const resolvedKeyDeleteType = keyDeleteType as "pending" | "finished";
  const [stateModalStatus, setStateModalStatus] =
    React.useState<boolean>(false);
  const { showToast } = useToastContext();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  const [allStatus, setAllStatus] = React.useState<IEstado[]>([]);
  const [sendingChangeStatus, setSendingChangeStatus] =
    React.useState<boolean>(false);

  const toggleModalStatus = () => setStateModalStatus((prev) => !prev);

  const loadOrderDetail = async () => {
    try {
      const orderDetailsData = await api.order.getOrderDetails(orderId);
      if (orderDetailsData.ok) {        
        setDetailOfOrder({ loading: false, data: orderDetailsData.data });
      }
    } catch (error: any) {
      console.log("error", error.response.data.message);
      setDetailOfOrder({ loading: false, data: null });
    }
  };

  const loadAllStatus = async () => {
    try {
      const resp = await api.status.findAll();
      if (resp.ok) setAllStatus(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (orderId) {
      loadAllStatus();
      loadOrderDetail();
    }
  }, [orderId]);

  React.useEffect(() => {
    if (!detailOfOrder.loading) {
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
      ]).start();
    }
  }, [detailOfOrder.loading]);

  const DeleteOrder = async () => {
    if (detailOfOrder.data?.id && keyDeleteType) {
      try {
        const response = await api.order.remove(detailOfOrder.data.id);
        console.log("API Response:", response);
        if (response.ok) {
          await handleDeleteOrder(detailOfOrder.data.id, resolvedKeyDeleteType);
          if (user?.tipo_servicio === ID_TIPOSERVICIO_RESERVA) {
            router.push("/(tabs)/calendar");
          } else {
            router.push("/(tabs)/pedidos");
          }
        } else {
          console.error("Failed to delete order:", response.message);
        }
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    } else {
      console.error("Missing required data to delete the order.");
    }
  };

  const handleViewChat = () => {
    if (detailOfOrder.data?.chatId) {
      router.push({
        pathname: "/(tabs)/orderChat",
        params: { chatId: detailOfOrder.data.chatId.id },
      });
    }
  };

  const changeStatusOrder = async (newStatus: IEstado) => {
    setSendingChangeStatus(true);
    const currentOrder = detailOfOrder.data?.estadoActual.order;
    try {
      if (!detailOfOrder.data?.id || !newStatus.id) return;
      if (newStatus.order === null || newStatus.order <= (currentOrder ?? 0))
        return;
      const resp = await api.changeStatus.cambioEstado({
        estadoId: newStatus.id,
        id_user: user.id,
        pedidoId: detailOfOrder.data.id,
      });
      if (resp.ok && detailOfOrder.data) {
        setDetailOfOrder({
          loading: false,
          data: {
            ...detailOfOrder.data,
            estadoActual: newStatus,
            cambiosEstado: [...detailOfOrder.data.cambiosEstado, resp.data],
          },
        });
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setSendingChangeStatus(false);
    }
  };

  const changeStatusOrderStore = (newStatus: any, newChangeStatus: any) => {
    if (!detailOfOrder.data) return;
    setDetailOfOrder({
      loading: false,
      data: {
        ...detailOfOrder.data,
        estadoActual: newStatus,
        cambiosEstado: [...detailOfOrder.data.cambiosEstado, newChangeStatus],
      },
    });
  };

  React.useEffect(() => {
    const socketIo = io(user.apiUrl);
    socketIo.on("connect", () =>
      socketIo.emit("listenChangeOrder", { orderId })
    );
    socketIo.on("changeStatusOrder", (data: any) => {
      if (data.id_user !== user.id) {
        changeStatusOrderStore(data.estado, data);
        showToast({
          title: <FormattedMessage id="statusUpdatedOrderDetails" />,
          description:
            <FormattedMessage id="userChangeStatusDetailsMessagge" /> +
            data.estado.nombre,
          status: "success",
        });
      }
    });
    return () => {
      socketIo.disconnect();
    };
  }, [user.id, user.apiUrl, orderId]);

  if (detailOfOrder.loading) {
    return (
      <View style={styles.loadingContainer}>
        <Progress.Circle
          color={Colors.light.primary}
          indeterminate
          size={70}
          borderWidth={3}
          strokeCap="round"
        />
        <Text style={styles.loadingText}>
          <FormattedMessage id="loading" defaultMessage="Cargando..." />
        </Text>
      </View>
    );
  }

  // presentation logic: siempre mostrar ambos si existen
  const generalDetail = detailOfOrder.data?.detalle_pedido ?? null;
  const productDetailsExist = detailOfOrder.data?.products.some((p) =>
    Boolean(p.detalle?.trim())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          <FormattedMessage
            id="orderDetails"
            defaultMessage="Detalles del Pedido"
          />
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={DeleteOrder}
          >
            <MaterialIcons name="delete-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary Card */}
        <Animated.View
          style={[
            styles.orderSummaryCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.orderNumberRow}>
            <View>
              <Text style={styles.orderNumberLabel}>
                <FormattedMessage id="orderNumber" defaultMessage="Pedido #" />
              </Text>
              <Text style={styles.orderNumberValue}>
                {detailOfOrder.data?.id}
              </Text>
            </View>
            <View>
              <Text style={styles.orderDateLabel}>
                <FormattedMessage id="orderDate" defaultMessage="Fecha" />
              </Text>
              <Text style={styles.orderDateValue}>
                {moment(detailOfOrder.data?.date)
                  .locale("es")
                  .format("D MMM YYYY")}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statusSection}>
            <View style={styles.currentStatusContainer}>
              <Text style={styles.currentStatusLabel}>
                <FormattedMessage
                  id="currentStatus"
                  defaultMessage="Estado actual"
                />
              </Text>
              <TouchableOpacity
                style={styles.statusBadge}
                onPress={toggleModalStatus}
              >
                <Text style={styles.statusText}>
                  {detailOfOrder.data?.estadoActual.nombre}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            {detailOfOrder.data?.cambiosEstado.length ? (
              <StatusTimeline
                statusChanges={detailOfOrder.data.cambiosEstado}
              />
            ) : null}
          </View>
        </Animated.View>

        {/* Additional Info Card */}
        <Animated.View
          style={[
            styles.sectionCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <AntDesign name="database" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>
              <FormattedMessage id="informationAditional" />
            </Text>
          </View>
          <View flexDir="column">
            {Object.keys(detailOfOrder.data?.infoLines || {}).map((key) => (
              <Text key={key} fontSize={16} my={1}>
                -- {key}: {detailOfOrder.data?.infoLines[key]}
              </Text>
            ))}
          </View>
        </Animated.View>

        {/* Client Card */}
        <Animated.View
          style={[
            styles.sectionCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Octicons name="person" size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>
              <FormattedMessage id="client" defaultMessage="Cliente" />
            </Text>
          </View>
          <View style={styles.clientInfoContainer}>
            <View style={styles.clientAvatar}>
              <Text style={styles.clientAvatarText}>
                {detailOfOrder.data?.client.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.clientDetails}>
              <Text style={styles.clientName}>
                {detailOfOrder.data?.client.name}
              </Text>
              <Text style={styles.clientPhone}>
                {detailOfOrder.data?.client.phone}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Estimated Time Card */}
        <Animated.View
          style={[
            styles.sectionCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <AntDesign
              name="clockcircleo"
              size={20}
              color={Colors.light.primary}
            />
            <Text style={styles.sectionTitle}>
              <FormattedMessage
                id="estimatedTime"
                defaultMessage="Tiempo Estimado"
              />
            </Text>
          </View>
          {detailOfOrder?.data?.estimateTime && (
            <View style={styles.timeContainer}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={36}
                color={Colors.light.primary}
              />
                <Text style={styles.estimateTimeValue}>
                {detailOfOrder.data?.estimateTime! >= 60
                  ? Math.floor(detailOfOrder?.data?.estimateTime / 60)
                  : detailOfOrder.data?.estimateTime}
                {" "}
                <Text style={styles.estimateTimeUnit}>
                  {detailOfOrder.data?.estimateTime! >= 60 ? (
                  <FormattedMessage id="hours" />
                  ) : (
                  <FormattedMessage id="minutes" />
                  )}
                </Text>
                </Text>
            </View>
          )}
        </Animated.View>

        {/* Products Card */}
        <Animated.View
          style={[
            styles.sectionCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="shopping-bag"
              size={20}
              color={Colors.light.primary}
            />
            <Text style={styles.sectionTitle}>
              <FormattedMessage id="products" defaultMessage="Productos" />
            </Text>
          </View>
          <View style={styles.productsList}>
            {detailOfOrder.data?.products.map((product, idx) => (
              <ProductOrderCard
                key={idx}
                data={product.productoInfo}
                cantidad={product.cantidad}
              />
            ))}
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>
              <FormattedMessage id="total" defaultMessage="Total" />
            </Text>
            <Text style={styles.totalValue}>$ {detailOfOrder.data?.total}</Text>
          </View>
        </Animated.View>

        {/* Order Details Card - Especificaciones del cliente */}
        <Animated.View
          style={[
            styles.sectionCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="notes"
              size={20}
              color={Colors.light.primary}
            />
            <Text style={styles.sectionTitle}>
              <FormattedMessage
                id="customerSpecifications"
                defaultMessage="Especificaciones del cliente"
              />
            </Text>
          </View>
          {generalDetail && (
            <View style={styles.generalNotes}>
              <Text style={styles.generalNotesLabel}>
                <FormattedMessage
                  id="orderNotes"
                  defaultMessage="Notas generales:"
                />
              </Text>
              <View style={styles.notesContainer}>
                <Text style={styles.generalNotesText}>{generalDetail}</Text>
              </View>
            </View>
          )}
          {productDetailsExist && (
            <View style={styles.orderDetailsContainer}>
              {detailOfOrder.data!.products.map((product, idx) =>
                product.detalle ? (
                  <View key={idx} style={styles.productSpecification}>
                    <Text style={styles.productSpecName}>
                      {product.productoInfo.nombre}:
                    </Text>
                    <View style={styles.specificationBubble}>
                      <Text style={styles.productSpecDetail}>
                        {product.detalle}
                      </Text>
                    </View>
                  </View>
                ) : null
              )}
            </View>
          )}
          {!generalDetail && !productDetailsExist && (
            <View style={styles.emptyDetailsContainer}>
              <MaterialIcons
                name="info-outline"
                size={24}
                color={Colors.light.icon}
              />
              <Text style={styles.emptyDetailsText}>
                <FormattedMessage
                  id="noSpecifications"
                  defaultMessage="Sin especificaciones adicionales"
                />
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Chat Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleViewChat}
          activeOpacity={0.7}
        >
          <IonIcons name="chatbubble-outline" size={20} color="white" />
          <Text style={styles.chatButtonText}>
            <FormattedMessage id="goToChat" defaultMessage="Ir al chat" />
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Status Change Modal */}
      <CustomModalPicker
        loading={sendingChangeStatus}
        changeStatus={detailOfOrder.data?.cambiosEstado}
        createOrderDate={detailOfOrder.data?.date ?? "No date"}
        changeStatusOrder={changeStatusOrder}
        lastStatusOrder={detailOfOrder.data?.estadoActual.order ?? 0}
        elements={allStatus}
        isVisible={stateModalStatus}
        onClose={toggleModalStatus}
      />
    </SafeAreaView>
  );
};

export default OrderDetails;
