
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
    </View>
  );
}

export default Home
