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
import LottieView from "lottie-react-native";

const Step3 = ({ onNext }: { onNext: any }) => {
  const { handleUpdateApiConfigured } = useUser();
  const [statusAccount, setStatusAccount] = React.useState<boolean>(false);

  const getResponseFromMyBe = async () => {
    const intervalId = setInterval(async () => {
      try {
        const response = await api.products.isEmpresaAvailable();
        console.log("response", response)
        if (response === 200) {
          clearInterval(intervalId);
          setStatusAccount(true);
          onNext();
        } else {
          console.log("Respuesta 500, reintentando...");
        }
      } catch (error) {
        console.log("error", error)
      }
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
        <LottieView
          source={require("../../../../../constants/Animation-waiting.json")}
          loop={true}
          autoPlay={true}
          style={{
            width: 400,
            height: 250,
          }}
        />
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
