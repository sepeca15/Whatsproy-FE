import * as React from "react";
import { View, Image } from "native-base";
import { styles } from "./LoadQRStyles";
import CustomText from "@/components/CustomText";
import api from "@/services/api/admin";
import { useUser } from "@/hooks/redux/useUser";
import * as Progress from "react-native-progress";
import { FormattedMessage } from 'react-intl'; // Importa FormattedMessage

interface ILoadQR {
  QRCode: string | null,
  handleUpdateData: (key:string,value:string)=> void
}

const LoadQR = ({QRCode, handleUpdateData} : ILoadQR) => {
  const [loading, setloading] = React.useState<boolean>(false);
  const { user } = useUser();

  const LoadQr = async () => {
    setloading(true)
    try {
      const data = await api.company.loadQR({ id_empresa: user.id_empresa });
      const qrMessage = data?.qr?.message;

      if (!qrMessage || typeof qrMessage !== "string") {
        throw new Error("El mensaje QR no es válido");
      }
      handleUpdateData('QRCode',`data:image/png;base64,${qrMessage}` )
    } catch (error) {
      console.log("Error al cargar el QR:", error);
    } finally{
      setloading(false)

    }
  };

  React.useEffect(() => {
    if(!QRCode) {
      LoadQr();
    }
  }, []);

  return (
    <View style={styles.container}>
      <CustomText><FormattedMessage id="qrCode" /></CustomText>
      {loading ? (
        <Progress.Circle style={{marginVertical:20}} indeterminate={true} size={50} />
      ) : QRCode ? (
        <Image
          source={{ uri: QRCode }}
          alt="QR Code"
          style={{ width: 200, height: 200 }}
        />
      ) : (
        <CustomText><FormattedMessage id="qrCodeError" /></CustomText>
      )}
    </View>
  );
};

export default LoadQR;