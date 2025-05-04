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

interface IDetailsOrder {
  loading: boolean;
  data: IOrderDetails | null;
}

const initialState = {
  loading: true,
  data: null,
};

const OrderDetails = () => {
  const { handleDeleteOrder } = useOrders();
  const router = useRouter();
  const { user } = useUser();
  const [detailOfOrder, setDetailOfOrder] =
    React.useState<IDetailsOrder>(initialState);
  const { orderId, keyDeleteType } = useLocalSearchParams();
  const resolvedKeyDeleteType = keyDeleteType as "pending" | "finished";
  const [stateModalStatus, setstateModalStatus] =
    React.useState<boolean>(false);
  const { showToast } = useToastContext();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  const [allStatus, setAllStatus] = React.useState<IEstado[]>([]);
  const [sendingChangeStatus, setSendingChangeStatus] =
    React.useState<boolean>(false);

  const toggleModalStatus = () => setstateModalStatus((prev) => !prev);

  const loadOrderDetail = async () => {
    try {
      const orderDetailsData = await api.order.getOrderDetails(orderId);

      if (orderDetailsData.ok === true) {
        setDetailOfOrder({ ...detailOfOrder, data: orderDetailsData.data });
      }
    } catch (error: any) {
      console.log("error", JSON.stringify(error));
    } finally {
      setDetailOfOrder((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const loadAllStatus = async () => {
    try {
      const resp = await api.status.findAll();

      if (resp.ok) {
        setAllStatus(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (orderId) {
      loadAllStatus();
      loadOrderDetail();
    }
  }, []);

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
      await handleDeleteOrder(detailOfOrder.data.id, resolvedKeyDeleteType);
      router.push("/(tabs)/pedidos");
    }
  };

  const handleViewChat = () => {
    if (detailOfOrder.data?.chatId) {
      router.push({
        pathname: "/(tabs)/orderChat",
        params: { chatId: detailOfOrder.data?.chatId.id },
      });
    }
  };

  const changeStatusOrder = async (newStatus: IEstado) => {
    setSendingChangeStatus(true);
    const currentOrder = detailOfOrder?.data?.estadoActual?.order;
    const newOrder = newStatus.order;
    try {
      if (!detailOfOrder.data?.id || !newStatus.id) {
        return;
      }
      if (newOrder && currentOrder && newOrder <= currentOrder) {
        return;
      }

      const resp = await api.changeStatus.cambioEstado({
        estadoId: newStatus.id,
        id_user: user.id,
        pedidoId: detailOfOrder?.data?.id,
      });

      if (resp.ok) {
        setDetailOfOrder((prev: any) => {
          return {
            ...prev,
            data: {
              ...prev.data,
              estadoActual: newStatus,
              cambiosEstado: [...prev.data.cambiosEstado, resp.data],
            },
          };
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setSendingChangeStatus(false);
    }
  };

  const changeStatusOrderStore = (newStatus: any, newChangeStatus: any) => {
    setDetailOfOrder((prev: any) => {
      return {
        ...prev,
        data: {
          ...prev.data,
          estadoActual: newStatus,
          cambiosEstado: [...prev.data.cambiosEstado, newChangeStatus],
        },
      };
    });
  };

  React.useEffect(() => {
    const socketIo = io(user.apiUrl);

    socketIo.on("connect", () => {
      socketIo.emit("listenChangeOrder", { orderId });
    });

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
  }, []);

  console.log(detailOfOrder.data?.infoLines);


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
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.light.primary}
      />

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
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
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
                  {detailOfOrder.data?.estadoActual?.nombre}
                </Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            {detailOfOrder.data?.cambiosEstado &&
              detailOfOrder.data.cambiosEstado.length > 0 && (
                <StatusTimeline
                  statusChanges={detailOfOrder.data.cambiosEstado}
                />
              )}
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
            <AntDesign size={20} color={Colors.light.primary} name="database"/>
            <Text style={styles.sectionTitle}>
              <FormattedMessage id="informationAditional" />
            </Text>
          </View>
          <View display={'flex'} flexDir={'column'} >
            {
              Object.keys(detailOfOrder.data?.infoLines).map((key, index) => {
                return <Text fontSize={16} my={1} key={index}>-- {key}: {detailOfOrder.data?.infoLines[key]}
                </Text>
              })
            }
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
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
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

          <View style={styles.timeContainer}>
            <MaterialCommunityIcons
              name="timer-outline"
              size={36}
              color={Colors.light.primary}
            />
            <Text style={styles.estimateTimeValue}>
              {detailOfOrder.data?.estimateTime}{" "}
              <Text style={styles.estimateTimeUnit}>
                {detailOfOrder?.data?.estimateTime &&
                  detailOfOrder?.data?.estimateTime > 60
                  ? "horas"
                  : "minutos"}
              </Text>
            </Text>
          </View>
        </Animated.View>

        {/* Products Card */}
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
            {detailOfOrder.data?.products.map((product, index) => (
              <ProductOrderCard
                key={index}
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
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
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

          {detailOfOrder.data?.products.some((product) => product.detalle) ? (
            <View style={styles.orderDetailsContainer}>
              {detailOfOrder.data?.products.map(
                (product, index) =>
                  product.detalle && (
                    <View key={index} style={styles.productSpecification}>
                      <Text style={styles.productSpecName}>
                        {product.productoInfo.nombre}:
                      </Text>
                      <View style={styles.specificationBubble}>
                        <Text style={styles.productSpecDetail}>
                          {product.detalle}
                        </Text>
                      </View>
                    </View>
                  )
              )}
            </View>
          ) : (
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

          {detailOfOrder.data?.detalle && (
            <View style={styles.generalNotes}>
              <Text style={styles.generalNotesLabel}>
                <FormattedMessage
                  id="orderNotes"
                  defaultMessage="Notas generales:"
                />
              </Text>
              <View style={styles.notesContainer}>
                <Text style={styles.generalNotesText}>
                  {detailOfOrder.data.detalle}
                </Text>
              </View>
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
        createOrderDate={detailOfOrder?.data?.date ?? "No date"}
        changeStatusOrder={changeStatusOrder}
        lastStatusOrder={detailOfOrder.data?.estadoActual?.order ?? 0}
        elements={allStatus}
        isVisible={stateModalStatus}
        onClose={toggleModalStatus}
      />
    </SafeAreaView>
  );
};

export default OrderDetails;
