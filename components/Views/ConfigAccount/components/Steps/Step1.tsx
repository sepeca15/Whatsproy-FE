import * as React from "react";
import { View } from "native-base";
import { styles } from "../../ConfigAccountStyles";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { useUser } from "@/hooks/redux/useUser";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import { useIntl } from "react-intl";

const Step1 = ({ onNext }: { onNext: any }) => {
  const { handleUpdateUser } = useUser();
  const [formData, setFormData] = React.useState({
    nombre: "",
    apellido: "",
  });
  const { formatMessage } = useIntl();
  const intl = useIntl();

  const handleChangeInputs = (key: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const saveDataUser = async () => {
    try {
      const resp = await handleUpdateUser({
        nombre: formData.nombre,
        apellido: formData.apellido,
      });
      onNext();
    } catch (error) {
      console.log("no se pudo", error);
    }
  };

  return (
    <View style={styles.containerStep1}>
      <View style={styles.containerForm}>
        <InputField
          marginTop={20}
          type="text"
          label={formatMessage({ id: "enterFirstName" })}
          placeholder={"John"}
          onChangeText={(text) => handleChangeInputs("nombre", text)}
        />
        <InputField
          marginTop={20}
          type="text"
          label={formatMessage({ id: "enterLastName" })}
          placeholder="Due"
          onChangeText={(text) => handleChangeInputs("apellido", text)}
        />
      </View>
      <View style={styles.ContainerFooter}>
        <CustomButton
          borderRadius={8}
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
