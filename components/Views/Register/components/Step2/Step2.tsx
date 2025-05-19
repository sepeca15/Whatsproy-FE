import { Center, Select, View, VStack } from "native-base";
import { styles } from "./Step2Styles";
import InputField from "@/components/InputField";
import CustomText from "@/components/CustomText";
import { useTransition } from "react";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import AlertText from "../AlertText";
import { useIntl } from "react-intl";
import { Alert } from "react-native";
import {
  ID_TIPOSERVICIO_DELIVERY,
  ID_TIPOSERVICIO_RESERVA,
} from "@/services/api/tiposervicio/tiposervicio.type";
import DateTimeInputField from "@/components/DateTimePickerField";
import InputHours from "../InputHours";
import InformativeText from "@/components/InformativeText";

interface IDataStep2 {
  hora_apertura: string;
  hora_cierre: string;
  tipoServicioId: number | null;
}

interface IStep2 {
  formData: IDataStep2;
  handleInputChange: (key: string, value: any) => void;
  errors: any;
}

const Step2 = ({ formData, errors, handleInputChange }: IStep2) => {
  const intl = useIntl();
  const services = [
    {
      id: ID_TIPOSERVICIO_DELIVERY,
      nombre: intl.formatMessage({
        id: "deliveryService",
        defaultMessage: "Delivery/Envio",
      }),
    },
    {
      id: ID_TIPOSERVICIO_RESERVA,
      nombre: intl.formatMessage({
        id: "agendaService",
        defaultMessage: "Agenda/Reserva",
      }),
    },
  ];

  return (
    <VStack space={4}>

      <InformativeText text={intl.formatMessage({
        id: "registerCompanyHours",
        defaultMessage: "registerCompanyHours",
      })} />

      <InputHours
        label={intl.formatMessage({ id: "openingTime", defaultMessage: "Opening Time" })}
        value={formData.hora_apertura}
        onChange={(value) => handleInputChange("hora_apertura", value)}
        error={errors.hora_apertura}
        isRequired
        dateLocal={new Date()}
      />


      <InputHours
        label={intl.formatMessage({ id: "closingTime", defaultMessage: "Closing time" })}
        value={formData.hora_cierre}
        onChange={(value) => handleInputChange("hora_cierre", value)}
        error={errors.hora_cierre}
        isRequired
        dateLocal={new Date()}
      />

      <View>
        <CustomText style={{ marginBottom: 6 }}>
          {intl.formatMessage({
            id: "serviceType",
            defaultMessage: "Service Type",
          })}
        </CustomText>
        <Select
          selectedValue={formData.tipoServicioId?.toString()}
          placeholder={intl.formatMessage({
            id: "selectServiceType",
            defaultMessage: "Select a service type",
          })}
          borderRadius={8}
          onValueChange={(value) => {
            handleInputChange("tipoServicioId", value);
          }}
        >
          {services.map((service) => (
            <Select.Item
              key={service.id}
              label={service.nombre}
              value={service.id.toString()}
            />
          ))}
        </Select>
        {errors.tipoServicioId && <AlertText text={errors.tipoServicioId} />}
      </View>
    </VStack>
  );
};

export default Step2;
