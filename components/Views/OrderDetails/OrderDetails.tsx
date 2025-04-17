import * as React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { styles } from "./OrderDetailsStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Progress from "react-native-progress";
import api from "@/services/api/admin";
import AntDesign from "react-native-vector-icons/AntDesign";
import Octicons from "react-native-vector-icons/Octicons";
import IonIcons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button, ScrollView } from "native-base";
import ProductOrderCard from "./components/ProductOrderCard";
import { IOrderDetails } from "./OrderDetailsTypes";
import { useOrders } from "@/hooks/redux/useOrders";
import { useUser } from "@/hooks/redux/useUser";
import moment from "moment";
import "moment/locale/es";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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

  const loadOrderDetail = async () => {
    try {
      const orderDetailsData = await api.order.getOrderDetails(orderId);
      console.log(orderDetailsData);

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

  React.useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    }
  }, []);

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

  return detailOfOrder.loading ? (
    <View style={styles.containerSpiner}>
      <Progress.Circle color={"#075e54"} indeterminate={true} size={100} />
    </View>
  ) : (
    <KeyboardAwareScrollView
      style={styles.containerScroll}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === "ios" ? 20 : 50}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}></ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.columnDate}>
            <Text style={[styles.textTitle, { fontWeight: "bold" }]}>
              <FormattedMessage id="orderNumber" defaultMessage="Order #" />
              {detailOfOrder.data?.id}
            </Text>
            <View style={styles.containerDate}>
              <AntDesign name="calendar" color={"white"} />
              <Text style={styles.text}>
                {moment(detailOfOrder.data?.date)
                  .locale("es")
                  .format("D [de] MMMM [de] YYYY")}
              </Text>
            </View>
          </View>
          <Text style={styles.buttonStatus}>
            {detailOfOrder.data?.confirm ? (
              <FormattedMessage id="accepted" defaultMessage="Accepted" />
            ) : (
              <FormattedMessage id="pending" defaultMessage="Pending" />
            )}
          </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.containerEstimateTime}>
            <View style={styles.containerRowinfoGap}>
              <AntDesign size={20} name="clockcircleo" />
              <Text style={styles.textBodyBold}>
                <FormattedMessage
                  id="estimatedTime"
                  defaultMessage="Estimated Time"
                />
              </Text>
            </View>
            <Text style={styles.textEstimateTime}>
              {detailOfOrder.data?.estimateTime}{" "}
              {detailOfOrder?.data?.estimateTime &&
                detailOfOrder?.data?.estimateTime > 60
                ? "hs"
                : "mn"}
            </Text>
          </View>
          <View style={styles.containerRowinfo}>
            <Octicons size={20} style={{ marginRight: 6 }} name="person" />
            <Text style={styles.textBodyBold}>
              <FormattedMessage id="client" defaultMessage="Client" />:{" "}
            </Text>
            <Text style={styles.textBodyBold}>
              {detailOfOrder.data?.client.name}
            </Text>
          </View>
          <View style={styles.containerRowinfo}>
            <IonIcons
              size={20}
              style={{ marginRight: 6, marginLeft: -2 }}
              name="location-outline"
            />
            <Text style={styles.textlocation}>
              {detailOfOrder.data?.infoLines?.direccion ? (
                detailOfOrder.data.infoLines.direccion
              ) : (
                <FormattedMessage id="noAddress" defaultMessage="No address" />
              )}
            </Text>
          </View>
          <View style={styles.containerProducts}>
            <Text style={styles.textBodyBig}>
              <FormattedMessage id="products" defaultMessage="Products" />
            </Text>
            <ScrollView horizontal={false} style={styles.products}>
              {detailOfOrder.data?.products.map((product, index) => {
                return (
                  <ProductOrderCard
                    key={index}
                    data={product.productoInfo}
                    cantidad={product.cantidad}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.containerrColumn}>
            <View style={styles.containerRow}>
              <Text style={styles.textBodyBold}>
                <FormattedMessage id="total" defaultMessage="Total" />
              </Text>
              <Text style={styles.textBodyBold}>
                $ {detailOfOrder.data?.total}
              </Text>
            </View>
            <View style={styles.ContainerButtons}>
              <Button style={styles.buttonDelete}>
                <Pressable
                  onPress={DeleteOrder}
                  accessibilityRole="button"
                  style={styles.containerRowinfoGap}
                >
                  <MaterialIcons size={16} color={"black"} name="delete" />
                  <Text style={{ color: "black" }}>
                    <FormattedMessage id="delete" defaultMessage="Delete" />
                  </Text>
                </Pressable>
              </Button>
              <Button style={styles.buttonViewChat}>
                <Pressable
                  onPress={handleViewChat}
                  style={styles.containerRowinfoGap}
                >
                  <IonIcons
                    accessibilityRole="button"
                    size={16}
                    color={"white"}
                    name="chatbubble-outline"
                  />
                  <Text style={{ color: "white" }}>
                    <FormattedMessage
                      id="goToChat"
                      defaultMessage="Go to chat"
                    />
                  </Text>
                </Pressable>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default OrderDetails;
