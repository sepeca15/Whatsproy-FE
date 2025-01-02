
import * as React from "react"
import CustomText from "@/components/CustomText";
import { View } from "native-base";
import { removeData } from "@/storage/localStorage";
import { router } from "expo-router";
import { styles } from "./HomeStyles";

const Home = () => {

  const logout = async() => {
    await removeData('token')
    router.push('/(auth)/login')
  }
  
  return (
    <View
    >
      <CustomText
        onPress={() => logout()}
        style={styles.textBlue500}
      >
        logout
      </CustomText>
      <CustomText
        onPress={() => router.push("/(tabs)/calendar")}
        style={styles.textBlue500}
      >
        Calendar
      </CustomText>
    </View>
  );
}

export default Home
