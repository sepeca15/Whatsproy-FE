import React from "react";
import { View, Image } from "react-native";
import { styles } from "./OrdersFinishedStyles";
import CardNewPedido from "../CardNewPedido.tsx";
import { useOrders } from "@/hooks/redux/useOrders";
import * as Progress from "react-native-progress";
import CustomText from "@/components/CustomText";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import { FlatList } from "native-base";

<Progress.Circle
  style={{ marginVertical: 20 }}
  indeterminate={true}
  size={50}
/>;

const OrdersFinished = () => {
  const { loadingApi, ordersFinished, handleLoadOrdersFinished, totalItemsFinished } = useOrders();

  React.useEffect(() => {
    if (ordersFinished.length === 0) {
      handleLoadOrdersFinished();
    }
  }, []);

  return (
    <View style={styles.container}>
      {(loadingApi && ordersFinished.length === 0) ? (
        <View style={styles.containerSpiner}>
          <Progress.Circle color={"#075e54"} indeterminate={true} size={100} />
        </View>
      ) : ordersFinished.length > 0 ? (
        <FlatList
          data={ordersFinished}
          renderItem={({ item }: { item: any }) => <CardNewPedido
            key={item.orderId}
            orderData={item}
            pending={true}
          />}
          keyExtractor={(item) => item.orderId.toString()}
          onEndReached={() => {
            if (ordersFinished.length < totalItemsFinished && !loadingApi) {
              handleLoadOrdersFinished();
            }
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            (loadingApi && ordersFinished.length > 0) && (
              <View style={styles.spinerCenter}>
                <Progress.Circle color={"#075e54"} indeterminate={true} size={40} />
              </View>
            )
          }
        /> 
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
