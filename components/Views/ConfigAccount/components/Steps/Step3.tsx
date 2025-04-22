import * as React from "react";
import { View } from "native-base";
import { styles } from "../../ConfigAccountStyles";
import * as Progress from "react-native-progress";
import api from "@/services/api/admin";
import CustomText from "@/components/CustomText";
import { useUser } from "@/hooks/redux/useUser";
import { Colors } from "react-native/Libraries/NewAppScreen";
import CustomButton from "@/components/CustomButton";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage

const Step3 = () => {
  const { handleUpdateApiConfigured } = useUser();
  const [statusAccount, setStatusAccount] = React.useState<boolean>(false);

  const getResponseFromMyBe = async () => {
    const intervalId = setInterval(async () => {
      try {
        const response = await api.products.getAll();
        if (response?.status === 200) {
          clearInterval(intervalId);
          setStatusAccount(true);
        } else {
          console.log("Respuesta 500, reintentando...");
        }
      } catch (error) {}
    }, 5000);
  };

  React.useEffect(() => {
    getResponseFromMyBe();
  }, []);

  const Next = () => {
    handleUpdateApiConfigured();
  };

  return (
    <View style={styles.containerStep3}>
      {!statusAccount ? (
        <Progress.Circle color={Colors.light.primary} indeterminate={true} />
      ) : (
        <View style={{ flex: 1 }}>
          <CustomText style={{ textAlign: "center" }}>
            <FormattedMessage id="backendConfigured" />
          </CustomText>
          <View style={styles.ContainerFooter}>
            <CustomButton isDisabled={!statusAccount} onPress={Next}>
              <FormattedMessage id="continue" />
            </CustomButton>
          </View>
        </View>
      )}
    </View>
  );
};

export default Step3;
