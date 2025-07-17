import { Center, Select, View, VStack } from "native-base";
import { styles } from "./AlertTextStyles";
import { Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface IAlertText {
  text: string;
}

const AlertText = ({ text }: IAlertText) => {
  return (
    <VStack style={styles.container}>
      <MaterialIcons
        name="error-outline"
        style={styles.icon}
        color={"#ce0202"}
        size={20}
      />
      <Text allowFontScaling={false} style={styles.text}>{text}</Text>
    </VStack>
  );
};

export default AlertText;
