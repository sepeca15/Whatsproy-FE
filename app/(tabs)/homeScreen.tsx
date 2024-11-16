import { StyleSheet } from "react-native";
import CustomText from "@/components/CustomText";
import { router } from "expo-router";
import { View } from "native-base";

export default function HomeScreen() {
  return (
    <View
    >
      <CustomText
        onPress={() => router.push("/(auth)/login")}
        style={styles.textBlue500}
      >
        Loginnn xd
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  textBlue500: {
    color: "#3b82f6",
  },
});
