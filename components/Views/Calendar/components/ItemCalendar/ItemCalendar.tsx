import { Pressable, StyleSheet, View, Animated } from "react-native";
import { IInfoItem } from "../../types";
import { useState, useRef, useEffect } from "react";
import { Button, Container, ScrollView, Text } from "native-base";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ion from "react-native-vector-icons/Ionicons";
import * as Progress from "react-native-progress";
import api from "@/services/api/admin";
import { IOrderDetails } from "@/components/Views/OrderDetails/OrderDetailsTypes";
import { useRouter } from "expo-router";
import { styles } from "./ItemCalendarStyles";
import * as moment from "moment-timezone";
import { useUser } from "@/hooks/redux/useUser";
import Icon from "react-native-vector-icons/Feather";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import CustomButton from "@/components/CustomButton";
import DateTimeInputField from "@/components/DateTimePickerField";

interface IItemCalendar {
  InfoItem: IInfoItem;
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
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [dataDetails, setDataDetails] = useState<IDataDetails>({
    info: null,
    loadingApi: true,
  });

  const keyDeleteType = confirmed ? "pending" : "finished";
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
    const date = moment.utc(dateString);
    const datePart = date.format("DD-MM-YYYY, HH:mm");

    return datePart;
  };

  const validateFunction = async () => {
    if (confirmed) {
      router.push({
        pathname: "/(tabs)/orderDetails",
        params: { orderId: InfoItem.orderId, keyDeleteType: keyDeleteType },
      });
    } else {
      try {
        setLoading(true);
        const resp = await confirmOrder(InfoItem.orderId);
        console.log("resp is", resp)
      } catch (error) {
        console.log("error is", error)
      } finally {
        setLoading(false);
      }
    }
  };

  const productsText = () => {
    let productsText = "";
    dataDetails.info?.products.map((product, index) => {
      const isEnd = dataDetails.info?.products.length === index + 1;
      productsText += product.productoInfo.nombre + (isEnd ? "" : ", ");
    });

    return productsText;
  };

  return (
    <View style={{ paddingRight: 10 }}>
      <View
        style={[
          styles.container,
          { backgroundColor: confirmed === true ? "#128c7e" : "#A9A9A9" },
        ]}
      >
        <View style={styles.mainInfo}>
          <Container
            color={"white"}
            display={"flex"}
            flexDir={"row"}
            style={{ gap: 5 }}
            alignItems={"center"}
            fontWeight={"medium"}
          >
            <Text color={"white"}>{InfoItem.product}</Text>
          </Container>
          <View style={styles.containerRight}>
            <Container
              flexDirection={"row"}
              alignItems={"center"}
              style={{ gap: 4 }}
            >
              <Ion color={"white"} name="time-outline" size={16} />
              <Text color={"white"} fontWeight={"500"}>
                {InfoItem?.date?.split("T")[0]}
              </Text>
            </Container>
            <Pressable style={{ padding: 3 }} onPress={toggleExpand}>
              <EvilIcons
                color={"white"}
                size={30}
                name={expanded ? "chevron-up" : "chevron-down"}
              />
            </Pressable>
          </View>
        </View>
        <Animated.View
          style={[styles.expandedContent, { minHeight: animationHeight }]}
        >
          {expanded &&
            (dataDetails.loadingApi ? (
              <View style={styles.containerSpiner}>
                <Progress.Circle
                  color={"white"}
                  indeterminate={true}
                  size={40}
                />
              </View>
            ) : (
              <View style={styles.additionalInfo}>
                <View style={styles.rowInfo}>
                  <AntDesign name="user" size={16} color={"white"} />
                  <Text color={"white"}>
                    {dataDetails.info?.client?.name || (
                      <FormattedMessage id="clientName" />
                    )}
                  </Text>
                </View>
                <View style={styles.rowInfo}>
                  <AntDesign name="phone" size={16} color={"white"} />
                  <Text color={"white"}>
                    {dataDetails.info?.client?.phone || (
                      <FormattedMessage id="clientPhone" />
                    )}
                  </Text>
                </View>
                <View style={styles.rowInfo}>
                  <MaterialIcons name="access-time" size={16} color={"white"} />
                  <Text color={"white"}>
                    {dataDetails.info?.estimateTime || (
                      <FormattedMessage id="estimateTime" />
                    )}{" "}
                    mn
                  </Text>
                </View>
                <View style={styles.rowInfo}>
                  <AntDesign name="calendar" size={16} color={"white"} />
                  <Text color={"white"}>
                    {formatDate(dataDetails.info?.date) || (
                      <FormattedMessage id="date" />
                    )}
                  </Text>
                </View>
                <View style={styles.rowInfo}>
                  <Icon name="shopping-bag" size={16} color="white" />
                  <Text color={"white"}>{productsText()}</Text>
                </View>
                <View style={styles.total}>
                  <Text fontSize={18} fontWeight={"bold"} color={"white"}>
                    <FormattedMessage id="total" />:
                  </Text>
                  <View style={styles.rowInfo}>
                    <FontAwesome name="money" size={12} color={"white"} />
                    <Text fontSize={18} fontWeight={"bold"} color={"white"}>
                      {dataDetails.info?.total}
                    </Text>
                  </View>
                </View>
                <View style={styles.buttons}>
                  {!confirmed && (
                    <CustomButton
                      loading={loadingDelete}
                      disabled={loading || loadingDelete}
                      style={[
                        styles.buttonNormal,
                        {
                          backgroundColor: confirmed ? "128c7e" : "transparent",
                        },
                      ]}
                      onPress={async () => {
                        try {
                          setLoadingDelete(true);
                          await deleteOrder(InfoItem.orderId);
                        } catch (error) {
                        } finally {
                          setLoadingDelete(false);
                        }
                      }}
                    >
                      <Text color={"white"} fontSize={12}>
                        <FormattedMessage id="deleteOrder" />
                      </Text>
                      <EvilIcons
                        style={{ paddingTop: 2 }}
                        color={"white"}
                        name="close"
                        size={16}
                      />
                    </CustomButton>
                  )}
                  <CustomButton
                    loading={loading}
                    disabled={loading || loadingDelete}
                    onPress={validateFunction}
                    style={[
                      styles.buttonConfirm,
                      { backgroundColor: confirmed ? "#1eab9b" : "black" },
                    ]}
                  >
                    <Text color={"white"} fontSize={13}>
                      {confirmed ? (
                        <FormattedMessage id="viewDetails" />
                      ) : (
                        <FormattedMessage id="confirmOrder" />
                      )}
                    </Text>
                  </CustomButton>
                </View>
              </View>
            ))}
        </Animated.View>
      </View>
    </View>
  );
};

export default ItemCalendar;
