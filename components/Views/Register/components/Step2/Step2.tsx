import { Center, Select, View, VStack } from "native-base";
import CustomText from "@/components/CustomText";
import AlertText from "../AlertText";
import { useIntl } from "react-intl";
import {
  ID_TIPOSERVICIO_DELIVERY,
  ID_TIPOSERVICIO_RESERVA,
  ID_TIPOSERVICIO_RESERVA_ESPACIO,
} from "@/services/api/tiposervicio/tiposervicio.type";
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
    {
      id: ID_TIPOSERVICIO_RESERVA_ESPACIO,
      nombre: intl.formatMessage({
        id: "agendaSpacesService",
        defaultMessage: "Agenda/Reserva de espacios",
      }),
    },
  ];

  return (
    <VStack space={4}>

      <InformativeText text={intl.formatMessage({
        id: "registerCompanyHours",
        defaultMessage: "registerCompanyHours",
      })} />

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
