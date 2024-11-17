
import CustomText from "@/components/CustomText";
import { View } from "native-base";
import { removeData } from "@/storage/localStorage";
import { router } from "expo-router";
import { useUser } from "@/hooks/redux/useUser";
import { styles } from "./HomeStyles";

export default function Home() {
  const { Mensaje } = useUser()


  Mensaje()
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
