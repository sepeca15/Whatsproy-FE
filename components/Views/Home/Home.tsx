import * as React from "react";
import CustomText from "@/components/CustomText";
import { View } from "native-base";
import { removeData } from "@/storage/localStorage";
import { router } from "expo-router";
import { styles } from "./HomeStyles";
import { FormattedMessage } from 'react-intl'; // Importa FormattedMessage

const Home = () => {

  const logout = async () => {
    await removeData('token');
    router.push('/(auth)/login');
  };

  return (
    <View>
      <CustomText
        onPress={() => logout()}
        style={styles.textBlue500}
      >
        <FormattedMessage id="logout" defaultMessage="Logout" />
      </CustomText>
      <CustomText
        onPress={() => router.push("/(tabs)/calendar")}
        style={styles.textBlue500}
      >
        <FormattedMessage id="calendar" defaultMessage="Calendar" />
      </CustomText>
    </View>
  );
};

export default Home;