import * as React from "react";
import { View } from "native-base";
import { styles } from "../../ConfigAccountStyles";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { useUser } from "@/hooks/redux/useUser";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import { useIntl } from "react-intl";

const Step1 = () => {
  const { handleUpdateUser } = useUser();
  const [formData, setFormData] = React.useState({
    nombre: "",
    apellido: "",
  });
  const { formatMessage } = useIntl();

  const handleChangeInputs = (key: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const saveDataUser = async () => {
    try {
      await handleUpdateUser({
        nombre: formData.nombre,
        apellido: formData.apellido,
      });
    } catch (error) {
      console.log('no se pudo',error);
    }
  };

  return (
    <View style={styles.containerStep1}>
      <View style={styles.containerForm}>
        <InputField
          marginTop={20}
          type="text"
          label={<FormattedMessage id="enterFirstName" />}
          placeholder={formatMessage({ id: "firstNamePlaceholder" })}
          onChangeText={(text) => handleChangeInputs("nombre", text)}
        />
        <InputField
          marginTop={20}
          type="text"
          label={<FormattedMessage id="enterLastName" />}
          placeholder="Last name"
          onChangeText={(text) => handleChangeInputs("apellido", text)}
        />
      </View>
      <View style={styles.ContainerFooter}>
        <CustomButton
          isDisabled={!formData.nombre || !formData.apellido}
          onPress={saveDataUser}
        >
          {formatMessage({ id: "continue" })}
        </CustomButton>
      </View>
    </View>
  );
};

export default Step1;
