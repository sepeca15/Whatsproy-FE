import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useOrders } from "@/hooks/redux/useOrders";
import * as Progress from "react-native-progress";
import CustomText from "@/components/CustomText";
import { io } from "socket.io-client";
import {styles} from "./ordersPendingStyles";
import { useUser } from "@/hooks/redux/useUser";
import CardNewPedido from "../CardNewPedido.tsx/index";
import { FormattedMessage } from "react-intl"; 

const OrdersPending = () => {
  const { user } = useUser();
  const {
    loadingApi,
    ordersPending,
    handleLoadOrdersPending,
    handleAddNewOrderPending,
  } = useOrders();

  React.useEffect(() => {
    const socketIo = io(user.apiUrl);

    socketIo.on("sendOrderRealTime", (data) => {
      handleAddNewOrderPending(data);
    });

    if (ordersPending.length === 0) {
      handleLoadOrdersPending();
    }

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      {loadingApi ? (
        <View style={styles.containerSpiner}>
          <Progress.Circle color={"#075e54"} indeterminate={true} size={100} />
        </View>
      ) : ordersPending.length > 0 ? (
        ordersPending?.map((order: any) => {
          return (
            <CardNewPedido
              key={order.orderId}
              orderData={order}
              pending={true}
            />
          );
        })
      ) : (
        <View style={styles.containerImage}>
          <Image
            source={require("../../../../../assets/images/no-records.png")}
            style={{ width: 350, height: 250, objectFit: "contain" }}
          />
          <CustomText>
            <FormattedMessage
              id="noOrdersAvailable"
              defaultMessage="No orders available"
            />
          </CustomText>
        </View>
      )}
    </View>
  );
};



export default OrdersPending;