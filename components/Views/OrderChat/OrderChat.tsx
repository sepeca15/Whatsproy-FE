import React from "react";
import { View } from "native-base";
import { styles } from "./OrderChatStyles";
import { useLocalSearchParams } from "expo-router";

const OrderChat: React.FC = () => {
  const { chatId } = useLocalSearchParams();
  console.log(chatId);

  return <View style={styles.container}></View>;
};

export default OrderChat;
