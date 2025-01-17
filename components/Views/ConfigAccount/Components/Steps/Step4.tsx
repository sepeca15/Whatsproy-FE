import * as React from "react";
import { Button, useToast, View } from "native-base";
import CustomText from "@/components/CustomText";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import LoadAuthCode from "../LoadAuthCode";
import LoadQR from "../LoadQR";
import { useUser } from "@/hooks/redux/useUser";
import {io} from 'socket.io-client'
import CustomButton from "@/components/CustomButton";
import { useToastContext } from "@/contexts/ToastContext";
type buttons = 'Auth' | 'QR'

const Step4 = () => {
  const {user:{apiUrl}, handleUpdateGreenApiConfig} = useUser()
  const [selectedButton, setSelectedButton] = React.useState<buttons | null>(null);
  const [data, setData] = React.useState({
    QRCode: null,
    AuthCode: null
  })
  const {showToast} = useToastContext()
  

  React.useEffect(()=> {
    const socketIo = io(apiUrl)

    socketIo.on('greenApiStatusResponse',(data)=> {
      FinishConfigGreenApi()
    })

    return () => {
      socketIo.disconnect();
    };

  },[])

  const FinishConfigGreenApi = async() => {
    try {
      await handleUpdateGreenApiConfig()
      showToast({
        description:"Ya hemos terminado de configurar todo.",
        title:'Configuracion exitosa',
        status:'success'
      })

    } catch (error:any) {
      console.log(error?.message);
    }
  }

  const handleButtonSelect = (button: buttons) => {
    setSelectedButton(button);
  };

  const handleUpdateData = (key: String, value: string) => {
    setData((prevState) => ({
      ...prevState,
      [key as any]: value
    }))
  }

  return (
    <View style={styles.container}>
      {
        !data.AuthCode && !data.QRCode &&
        <CustomText style={styles.centerText}>Elije como deseas conectar tu numero de whatsapp</CustomText>
      }
      <View style={styles.containerButtons}>
        <Button
          style={[
            styles.button,
            styles.buttonLeft,
            selectedButton === "QR" && styles.selectedButton,
          ]}
          onPress={() => handleButtonSelect("QR")}
        >
          <CustomText
            style={[
              styles.buttonText,
              selectedButton === "QR" ? styles.selectedText : styles.defaultText,
            ]}
          >
            With QR
          </CustomText>
        </Button>
        <Button
          style={[
            styles.button,
            styles.buttonRight,
            selectedButton === "Auth" && styles.selectedButton,
          ]}
          onPress={() => handleButtonSelect("Auth")}
        >
          <CustomText
            style={[
              styles.buttonText,
              selectedButton === "Auth" ? styles.selectedText : styles.defaultText,
            ]}
          >
            Auth code
          </CustomText>
        </Button>
      </View>
      <View style={styles.content}>
        <CustomButton onPress={FinishConfigGreenApi}>OK</CustomButton>
        {
          selectedButton === 'Auth' ?
            <LoadAuthCode AuthCode={data.AuthCode} handleUpdateData={handleUpdateData} />
            :
            selectedButton === "QR" ?
              <LoadQR QRCode={data.QRCode} handleUpdateData={handleUpdateData} />
              :
              <CustomText>Por favor elija una opcion</CustomText>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  containerButtons: {
    marginVertical: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    textAlign: "center",
  },
  button: {
    width: 150,
    height: 50,
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  selectedButton: {
    backgroundColor: Colors.light.primary,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 12,
  },
  defaultText: {
    color: Colors.dark.primary,
  },
  selectedText: {
    color: "#FFF",
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonLeft: {
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15, 
    borderColor: Colors.light.primary, 
    borderWidth: 1
  },
  buttonRight: {
    borderBottomRightRadius: 15, 
    borderTopRightRadius: 15, 
    borderColor: Colors.light.primary, 
    borderWidth: 1
  }
});

export default Step4;
