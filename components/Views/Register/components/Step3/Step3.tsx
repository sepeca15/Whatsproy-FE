import { Switch, View, VStack } from "native-base";
import { styles } from "./Step3Styles";
import InputField from "@/components/InputField";
import CustomText from "@/components/CustomText";
import AlertText from "../AlertText";
import { useIntl } from "react-intl"; // Importa useIntl

interface IStep3 {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  errors: any;
  tipoServicio: number | null;
}

const Step3 = ({
  formData,
  errors,
  handleInputChange,
  tipoServicio,
}: IStep3) => {
  const intl = useIntl(); // Usa useIntl para obtener la instancia de intl

  return (
    <VStack space={4}>
      <View>
        <InputField
          label={intl.formatMessage({ id: "email", defaultMessage: "Email" })}
          placeholder={intl.formatMessage({
            id: "enterEmailCompani",
            defaultMessage: "Enter your company's email",
          })}
          value={formData.userEmail}
          onChangeText={(value) => handleInputChange("userEmail", value)}
        />
        {errors.userEmail && <AlertText text={errors.userEmail} />}
      </View>

      <View>
        <InputField
          type={"password"}
          label={intl.formatMessage({
            id: "password",
            defaultMessage: "Password",
          })}
          placeholder=""
          value={formData.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />
        {errors.password && <AlertText text={errors.password} />}
      </View>

      <View>
        <InputField
          type={"password"}
          label={intl.formatMessage({
            id: "confirmPassword",
            defaultMessage: "Confirm Password",
          })}
          placeholder=""
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange("confirmPassword", value)}
        />
        {errors.confirmPassword && <AlertText text={errors.confirmPassword} />}
      </View>
      {tipoServicio === 2 && (
        <View display={"flex"} flexDir={"row"} alignItems={"center"}>
          <CustomText style={{ marginRight: 6 }}>
            {intl.formatMessage({
              id: "notifyReservationHours",
              defaultMessage: "Do you want to notify reservation hours?",
            })}
          </CustomText>
          <Switch
            isChecked={formData.notificarReservaHoras}
            onToggle={() =>
              handleInputChange(
                "notificarReservaHoras",
                !formData.notificarReservaHoras,
              )
            }
            size="lg"
            colorScheme="primary"
          />
        </View>
      )}
    </VStack>
  );
};

export default Step3;
