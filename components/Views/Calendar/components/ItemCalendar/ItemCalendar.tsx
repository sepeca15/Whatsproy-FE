import { Pressable, StyleSheet, View, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import api from "@/services/api/admin";
import type { IOrderDetails } from "@/components/Views/OrderDetails/OrderDetailsTypes";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/redux/useUser";
import { FormattedMessage } from "react-intl";
import { styles } from "./ItemCalendarStyles";
import { ID_TIPOSERVICIO_RESERVA_ESPACIO } from "@/services/api/tiposervicio/tiposervicio.type";
import * as moment from "moment-timezone";

const primaryColor = "#075e54";
const secondaryColor = "#128c7e";

const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    primary: primaryColor,
    secondary: secondaryColor,
    warning: "#F39C12",
    border: "#e1e1e1",
    success: "#2ECC71",
    error: "#ef4444",
    textSecondary: "#666",
    danger: "#E74C3C",
    icon: "#687076",
    muted: "#f8f9fa",
  },
};

interface IInfoItem {
  orderId: number;
  date: string;
  product: string;
  status?: boolean;
}

interface IItemCalendar {
  InfoItem: any;
  deleteOrder: (orderId: number) => void;
  confirmOrder: (orderId: number) => void;
  confirmed: boolean;
}

interface IDataDetails {
  info: IOrderDetails | null;
  loadingApi: boolean;
}

const ItemCalendar = ({
  InfoItem,
  confirmOrder,
  deleteOrder,
  confirmed,
}: IItemCalendar) => {
  console.log("confirmed", confirmed)
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [dataDetails, setDataDetails] = useState<IDataDetails>({
    info: null,
    loadingApi: true,
  });


  console.log(InfoItem);
  console.log(dataDetails);


  const keyDeleteType = confirmed ? "pending" : "finished";
  const animationHeight = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

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

    // Animación de altura
    Animated.timing(animationHeight, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Animación de rotación del ícono
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (expanded && !dataDetails.info) {
      onLoadingDetails();
    }
  }, [expanded, dataDetails.info]);

  const formatDate = (dateString: any) => {
    const date = moment.utc(dateString);
    return date.format("DD/MM/YYYY, HH:mm");
  };

  const confirmOrderFunction = async () => {
    try {
      setLoading(true);
      await confirmOrder(InfoItem.orderId);
    } catch (error) {
      console.log("error is", error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetailsOrder = () => {
    router.push({
      pathname: "/(tabs)/orderDetails",
      params: { orderId: InfoItem.orderId, keyDeleteType: keyDeleteType },
    });
  };

  const productsText = () => {
    let productsText = "";
    dataDetails.info?.products.map((product, index) => {
      const isEnd = dataDetails.info?.products.length === index + 1;
      productsText += product.productoInfo.nombre + (isEnd ? "" : ", ");
    });
    return productsText;
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const formatDisplayDate = () => {
    if (user.tipo_servicio === ID_TIPOSERVICIO_RESERVA_ESPACIO) {
      const start = moment.utc(InfoItem.fecha_inicio).format("DD/MM/YYYY, HH:mm");
      const end = moment.utc(InfoItem.fecha_fin).format("HH:mm");
      return `${start} - ${end}`;
    }

    // Comportamiento normal
    return moment.tz(InfoItem.date, "America/Montevideo").format("DD/MM/YYYY");
  };

  const productDisplayText = () => {
    if (user.tipo_servicio === ID_TIPOSERVICIO_RESERVA_ESPACIO) {
      const espacio = InfoItem.espacio?.nombre || "";
      const cliente = InfoItem.clientName || "";
      const detalle = InfoItem.espacio?.descripcion || "";
      return `${espacio} - ${cliente} (${detalle})`;
    }
    return InfoItem.product;
  };

  const getEstimateTime = () => {
    if (!InfoItem?.fecha_inicio || !InfoItem?.fecha_fin || !InfoItem?.precio?.tipo_intervalo) return "0";

    const start = moment.tz(InfoItem.fecha_inicio, "America/Montevideo");
    const end = moment.tz(InfoItem.fecha_fin, "America/Montevideo");

    const diffMinutes = end.diff(start, "minutes");

    switch (InfoItem.precio.tipo_intervalo) {
      case "minutos":
        return `${diffMinutes} min`;
      case "horas":
        const hours = Math.ceil(diffMinutes / 60);
        return `${hours} h`;
      case "dias":
        const days = Math.ceil(diffMinutes / 60 / 24);
        return `${days} d`;
      case "segundos":
        const seconds = diffMinutes * 60;
        return `${seconds} s`;
      default:
        return `${diffMinutes} min`;
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable style={styles.cardHeader} onPress={toggleExpand}>
        <View style={styles.headerLeft}>
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: confirmed
                    ? Colors.light.success
                    : Colors.light.warning,
                },
              ]}
            />
          </View>
          <View style={styles.headerContent}>
            <Text
              allowFontScaling={false}
              style={styles.productName}
              numberOfLines={1}
            >
              {productDisplayText()}
            </Text>

            <View style={styles.dateRow}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={Colors.light.icon}
              />
              <Text allowFontScaling={false} style={styles.dateText}>
                {formatDisplayDate()}
              </Text>
            </View>
          </View>
        </View>

        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Ionicons name="chevron-down" size={20} color={Colors.light.icon} />
        </Animated.View>
      </Pressable>

      <Animated.View
        style={[
          styles.expandedContainer,
          {
            height: animationHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 280],
            }),
          },
        ]}
      >
        {expanded && (
          <View style={styles.expandedContent}>
            {dataDetails.loadingApi ? (
              <View style={styles.loadingContainer}>
                <Progress.Circle
                  color={Colors.light.primary}
                  indeterminate={true}
                  size={30}
                />
              </View>
            ) : (
              <>
                <View style={styles.section}>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color={Colors.light.icon}
                    />
                    <Text allowFontScaling={false} style={styles.infoText}>
                      {dataDetails.info?.client?.name || (
                        <FormattedMessage id="clientName" />
                      )}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="call-outline"
                      size={16}
                      color={Colors.light.icon}
                    />
                    <Text allowFontScaling={false} style={styles.infoText}>
                      {dataDetails.info?.client?.phone || (
                        <FormattedMessage id="clientPhone" />
                      )}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={Colors.light.icon}
                    />
                    <Text allowFontScaling={false} style={styles.infoText}>
                      {getEstimateTime() || (
                        <FormattedMessage id="estimateTime" />
                      )}{" "}
                      {
                        user.tipo_servicio !== 3 && "min"
                      }
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={Colors.light.icon}
                    />
                    <Text allowFontScaling={false} style={styles.infoText}>
                      {formatDate(dataDetails.info?.date) || (
                        <FormattedMessage id="date" />
                      )}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="bag-outline"
                      size={16}
                      color={Colors.light.icon}
                    />
                    <Text
                      allowFontScaling={false}
                      style={styles.infoText}
                      numberOfLines={2}
                    >
                      {InfoItem?.espacio?.nombre || productsText()}
                    </Text>
                  </View>
                </View>

                <View style={styles.totalSection}>
                  <View style={styles.totalRow}>
                    <Text allowFontScaling={false} style={styles.totalLabel}>
                      <FormattedMessage id="total" />
                    </Text>
                    <View style={styles.totalValue}>
                      <Ionicons
                        name="cash-outline"
                        size={16}
                        color={Colors.light.success}
                      />
                      <Text allowFontScaling={false} style={styles.totalAmount}>
                        ${dataDetails.info?.total}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionButton}>
                  <View style={styles.actionSectionRow}>
                    {(
                      <Pressable
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={async () => {
                          try {
                            setLoadingDelete(true);
                            await deleteOrder(InfoItem.orderId);
                          } catch (error) {
                            console.error(error);
                          } finally {
                            setLoadingDelete(false);
                          }
                        }}
                        disabled={loading || loadingDelete}
                      >
                        {loadingDelete ? (
                          <Progress.Circle
                            color={Colors.light.danger}
                            indeterminate={true}
                            size={16}
                          />
                        ) : (
                          <Ionicons
                            name="trash-outline"
                            size={16}
                            color={Colors.light.danger}
                          />
                        )}
                        <Text
                          allowFontScaling={false}
                          style={styles.deleteButtonText}
                        >
                          <FormattedMessage id="deleteOrder" />
                        </Text>
                      </Pressable>
                    )}

                    {!confirmed && <Pressable
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={confirmOrderFunction}
                      disabled={loading || loadingDelete}
                    >
                      {loading ? (
                        <Progress.Circle
                          color="white"
                          indeterminate={true}
                          size={16}
                        />
                      ) : (
                        <Ionicons
                          name={"checkmark-circle-outline"}
                          size={16}
                          color="white"
                        />
                      )}
                      <Text
                        allowFontScaling={false}
                        style={styles.primaryButtonText}
                      >
                        <FormattedMessage id="confirmOrder" />
                      </Text>
                    </Pressable>}

                    {confirmed && (
                      <Pressable
                        style={[styles.actionButton, styles.primaryButton]}
                        onPress={viewDetailsOrder}
                        disabled={loading || loadingDelete}
                      >
                        {loading ? (
                          <Progress.Circle
                            color="white"
                            indeterminate={true}
                            size={16}
                          />
                        ) : (
                          <Ionicons
                            name={"eye-outline"}
                            size={16}
                            color="white"
                          />
                        )}
                        <Text
                          allowFontScaling={false}
                          style={styles.primaryButtonText}
                        >
                          <FormattedMessage id="viewDetails" />
                        </Text>
                      </Pressable>
                    )}
                  </View>


                </View>
              </>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default ItemCalendar;
