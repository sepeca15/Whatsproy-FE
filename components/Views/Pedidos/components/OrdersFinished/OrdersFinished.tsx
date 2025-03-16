import React from "react";
import { View, Image } from "react-native";
import { styles } from "./OrdersFinishedStyles";
import CardNewPedido from "../CardNewPedido.tsx";
import { useOrders } from "@/hooks/redux/useOrders";
import * as Progress from "react-native-progress";
import CustomText from "@/components/CustomText";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage

<Progress.Circle
  style={{ marginVertical: 20 }}
  indeterminate={true}
  size={50}
/>;

const OrdersFinished = () => {
  const { loadingApi, ordersFinished, handleLoadOrdersFinished } = useOrders();

  React.useEffect(() => {
    if (ordersFinished.length === 0) {
      handleLoadOrdersFinished();
    }
  }, []);

  return (
    <View style={styles.container}>
      {loadingApi ? (
        <View style={styles.containerSpiner}>
          <Progress.Circle color={"#075e54"} indeterminate={true} size={100} />
        </View>
      ) : ordersFinished.length > 0 ? (
        ordersFinished.map((order: any) => {
          return (
            <CardNewPedido
              key={order.orderId}
              orderData={order}
              pending={false}
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

export default OrdersFinished;
