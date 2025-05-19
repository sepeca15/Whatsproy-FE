import * as React from "react";
import { Button, useToast, View } from "native-base";
import CustomText from "@/components/CustomText";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import LoadAuthCode from "../LoadAuthCode";
import LoadQR from "../LoadQR";
import { useUser } from "@/hooks/redux/useUser";
import CustomButton from "@/components/CustomButton";
import { useToastContext } from "@/contexts/ToastContext";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import TutorialGreenApi from "../../TotorialGreenApi";

type buttons = "Auth" | "QR";

const Step4 = () => {
  const {
    user: { apiUrl },
    handleUpdateGreenApiConfig,
    isGreenApiConfigured,
  } = useUser();
  const [selectedButton, setSelectedButton] = React.useState<buttons | null>(
    null
  );
  const [openTutorial, setOpenTutorial] = React.useState(false);
  const [loadingChecking, setLoadingChecking] = React.useState(false);
  const [data, setData] = React.useState({
    QRCode: null,
    AuthCode: null,
  });
  const { showToast } = useToastContext();

  const FinishConfigGreenApi = async () => {
    try {
      setLoadingChecking(true);
      const resp = await isGreenApiConfigured();
      if (resp?.isDone) {
        showToast({
          description: <FormattedMessage id="configSuccessDescription" />,
          title: <FormattedMessage id="configSuccessTitle" />,
          status: "success",
        });
      } else {
        showToast({
          description: <FormattedMessage id="configErrorDesc" />,
          title: <FormattedMessage id="ooops" />,
          status: "error",
        });
      }
    } catch (error: any) {
      console.log(error?.message);
    } finally {
      setLoadingChecking(false);
    }
  };

  const handleButtonSelect = (button: buttons) => {
    setSelectedButton(button);
  };

  const handleUpdateData = (key: string, value: string) => {
    setData((prevState) => ({
      ...prevState,
      [key as any]: value,
    }));
  };

  return (
    <View style={styles.container}>
      {openTutorial && (
        <TutorialGreenApi open={openTutorial} setOpen={setOpenTutorial} />
      )}
      {!selectedButton && (
        <CustomText style={styles.centerText}>
          <FormattedMessage id="chooseConnectionMethod" />
        </CustomText>
      )}
      <View style={styles.containerButtons}>
        <Button
          style={[
            styles.button,
            styles.buttonLeft,
            selectedButton === "QR" && styles.selectedButton,
          ]}
          borderRightRadius={0}
          onPress={() => handleButtonSelect("QR")}
        >
          <CustomText
            style={[
              styles.buttonText,
              selectedButton === "QR"
                ? styles.selectedText
                : styles.defaultText,
            ]}
          >
            <FormattedMessage id="withQR" />
          </CustomText>
        </Button>
        <Button
          style={[
            styles.button,
            styles.buttonRight,
            selectedButton === "Auth" && styles.selectedButton,
          ]}
          borderLeftRadius={0}
          onPress={() => handleButtonSelect("Auth")}
        >
          <CustomText
            style={[
              styles.buttonText,
              selectedButton === "Auth"
                ? styles.selectedText
                : styles.defaultText,
            ]}
          >
            <FormattedMessage id="authCode" />
          </CustomText>
        </Button>
      </View>
      <View style={styles.content}>
        {selectedButton === "Auth" ? (
          <LoadAuthCode
            AuthCode={data.AuthCode}
            handleUpdateData={handleUpdateData}
          />
        ) : (
          selectedButton === "QR" && (
            <LoadQR QRCode={data.QRCode} handleUpdateData={handleUpdateData} />
          )
        )}
        <View
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          style={{ gap: 4, marginTop: 4 }}
        >
          <CustomText>{<FormattedMessage id="needHelp" />}</CustomText>{" "}
          <TouchableOpacity onPress={() => setOpenTutorial(!openTutorial)}>
            <CustomText
              style={{
                color: "#128c7e",
                textDecorationColor: "#128c7e",
                textDecorationLine: "underline",
              }}
            >
              <FormattedMessage id="seeTutorial" />
            </CustomText>
          </TouchableOpacity>
        </View>

        <View width={"100%"}>
          <CustomButton
            loading={loadingChecking}
            marginRight={0}
            marginTop={5}
            onPress={FinishConfigGreenApi}
          >
            <FormattedMessage id="verify" />
          </CustomButton>
        </View>
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
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonLeft: {
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: Colors.light.primary,
    borderWidth: 1,
  },
  buttonRight: {
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    borderColor: Colors.light.primary,
    borderWidth: 1,
  },
});

export default Step4;
