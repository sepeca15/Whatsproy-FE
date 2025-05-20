import React from "react";
import { View, Image } from "react-native";
import { styles } from "./OrdersActiveStyles";
import CardNewPedido from "../CardNewPedido.tsx";
import { useOrders } from "@/hooks/redux/useOrders";
import * as Progress from "react-native-progress";
import CustomText from "@/components/CustomText";
import { FormattedMessage } from "react-intl";
import { FlatList } from "native-base";

<Progress.Circle
  style={{ marginVertical: 20 }}
  indeterminate={true}
  size={50}
/>;

const OrdersActive = () => {
  const { loadingApi, ordersActive, handleLoadingOrdersActive, totalItemsActive } = useOrders();

  React.useEffect(() => {
    if (ordersActive.length === 0) {
      handleLoadingOrdersActive();
    }
  }, []);

  return (
    <View style={styles.container}>
      {(loadingApi && ordersActive.length === 0) ? (
        <View style={styles.containerSpiner}>
          <Progress.Circle color={"#075e54"} indeterminate={true} size={100} />
        </View>
      ) : ordersActive.length > 0 ? (
        <FlatList
          data={ordersActive}
          renderItem={({ item }: { item: any }) => <CardNewPedido
            key={item.orderId}
            orderData={item}
            pending={true}
          />}
          keyExtractor={(item) => item.orderId.toString()}
          onEndReached={() => {
            if (ordersActive.length < totalItemsActive && !loadingApi) {
              handleLoadingOrdersActive();
            }
          }}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListFooterComponent={
            (loadingApi && ordersActive.length > 0) &&(
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

export default OrdersActive;
