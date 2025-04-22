import * as React from "react";
import { View } from "native-base";
import { styles } from "./LoadAuthCodeStyles";
import CustomText from "@/components/CustomText";
import api from "@/services/api/admin";
import { useUser } from "@/hooks/redux/useUser";
import { Image, Text, TextInput } from "react-native";
import CustomButton from "@/components/CustomButton";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage

interface ILoadAuthCode {
  AuthCode: string | null;
  handleUpdateData: (key: string, value: string) => void;
}

const LoadAuthCode = ({ AuthCode, handleUpdateData }: ILoadAuthCode) => {
  const [numberPhone, setNumberPhone] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const { user } = useUser();

  const LoadAuthCode = async () => {
    setLoading(true);
    try {
      const data = await api.company.loadAuthCode({
        id_empresa: user.id_empresa,
        numberPhone: parseInt(numberPhone),
      });
      handleUpdateData("AuthCode", data.resAuth.code);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return AuthCode ? (
    <View>
      <View>
        <Text style={{ textAlign: "center" }}>
          <FormattedMessage id="openWhatsApp" />
        </Text>
      </View>
      <CustomText style={styles.AuthCodeText}>{AuthCode}</CustomText>
    </View>
  ) : (
    <View style={styles.container}>
      <CustomText>
        <FormattedMessage id="enterPhoneNumber" />
      </CustomText>
      <View>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={numberPhone}
          onChangeText={(num) => setNumberPhone(num)}
          placeholder="Ej: 59891443445"
        />
        <CustomButton
          loading={loading}
          colorSpiner="white"
          isDisabled={!numberPhone}
          onPress={LoadAuthCode}
        >
          <FormattedMessage id="getCode" />
        </CustomButton>
      </View>
    </View>
  );
};

export default LoadAuthCode;
