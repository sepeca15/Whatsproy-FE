import { View, VStack } from "native-base";
import { styles } from "./Step1Styles";
import InputField from "@/components/InputField";
import CustomText from "@/components/CustomText";
import * as ImagePicker from "expo-image-picker";
import { Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AlertText from "../AlertText";
import SelectTimeZone from "../SelectTimeZone";
import * as moment from "moment-timezone";
import { FormattedMessage, useIntl } from "react-intl";
import { useState } from "react";
import api from "@/services/api/admin";

interface IDataStep1 {
  nombre: string;
  descripcion: string;
  logo: string;
  timeZone: string;
}

interface IStep1 {
  formData: IDataStep1;
  handleInputChange: (key: string, value: any) => void;
  errors: any;
}

const Step1 = ({ formData, handleInputChange, errors }: IStep1) => {
  const timeZones = moment.tz.names();
  const [uri, setUri] = useState("");
  const intl = useIntl();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const { uri, fileName } = result.assets[0];

        const file = {
          uri: result.assets[0].uri,
          type: "image/png",
          name: "image.png",
        };
        setUri(file.uri);
        const uploadResponse = await api.image.upload(file);
        handleInputChange("logo", uploadResponse.url);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }
  };

  return (
    <VStack space={2} style={styles.container}>
      <View style={styles.containerImage}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri:
                uri ||
                "https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
            }}
            style={styles.image}
          />
          <Ionicons
            name="camera"
            size={30}
            color="#fff"
            style={styles.imagePicker}
          />
        </TouchableOpacity>
      </View>
      <CustomText style={styles.textCenterLg}>
        {intl.formatMessage({
          id: "registerCompany",
          defaultMessage:
            "Register your company and start managing your orders and reservations",
        })}
      </CustomText>
      <View>
        <InputField
          label={intl.formatMessage({
            id: "companyName",
            defaultMessage: "Company Name",
          })}
          placeholder={intl.formatMessage({
            id: "enterCompanyName",
            defaultMessage: "Enter your company name",
          })}
          value={formData.nombre}
          onChangeText={(value) => handleInputChange("nombre", value)}
        />
        {errors.nombre && <AlertText text={errors.nombre} />}
      </View>
      <View>
        <InputField
          label={intl.formatMessage({
            id: "description",
            defaultMessage: "Description",
          })}
          placeholder={intl.formatMessage({
            id: "enterDescription",
            defaultMessage: "Brief description",
          })}
          value={formData.descripcion}
          onChangeText={(value) => handleInputChange("descripcion", value)}
          isTextArea={true}
          rows={4}
        />
        {errors.descripcion && <AlertText text={errors.descripcion} />}
      </View>

      <View>
        <SelectTimeZone
          selectTimeZone={(valueTz: string) =>
            handleInputChange("timeZone", valueTz)
          }
          timeZoneSelected={formData.timeZone}
          timeZones={timeZones}
        />
        {errors.timeZone && <AlertText text={errors.timeZone} />}
      </View>
    </VStack>
  );
};

export default Step1;
