import { useUser } from "@/hooks/redux/useUser";
import api from "@/services/api/admin";
import {
  FECHA_HORA_INFOLINE_RESERVA,
  InfoLineDTO,
  TipoInfoLine,
} from "@/services/api/dateOrder/dataOrder.type";
import { FormControl, Switch, View, Text } from "native-base";
import DateTimePickerField from "./DateTimePickerField";
import InputField from "./InputField";

interface Props {
  value: Record<string, any>;
  setValue: (val: Record<string, any>) => void;
  infoLines: InfoLineDTO[];
  errors: any;
}

const InfoLineForm = ({ setValue, value, infoLines, errors }: Props) => {
  if (infoLines?.length === 0) {
    return null;
  }

  const handleRenderInfoLineInput = (infoLine: InfoLineDTO) => {
    const inputValue = value[infoLine.nombre];
    const error = errors[infoLine.nombre];

    switch (infoLine.tipo) {
      case TipoInfoLine.boolean:
        return (
          <FormControl isInvalid={error}>
            <View flexDirection="row" alignItems="center">
              <FormControl.Label>
                <Text mr={2}>{infoLine.nombre}</Text>
              </FormControl.Label>
              <Switch
                isChecked={!!inputValue}
                onToggle={(val) =>
                  setValue({
                    ...value,
                    [infoLine.nombre]: val,
                  })
                }
              />
            </View>
            {error && (
              <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
            )}
          </FormControl>
        );
      case TipoInfoLine.number:
        return (
          <InputField
            error={error}
            keyboardType="numeric"
            label={infoLine?.nombre}
            placeholder={`Ingresar ${infoLine.nombre}`}
            value={inputValue?.toString() || ""}
            onChangeText={(text) =>
              setValue({
                ...value,
                [infoLine.nombre]: parseFloat(text) || "",
              })
            }
          />
        );
      case TipoInfoLine.string:
        return (
          <InputField
            label={infoLine.nombre}
            placeholder={`Ingresar ${infoLine.nombre}`}
            value={inputValue || ""}
            type="text"
            error={error}
            onChangeText={(text) =>
              setValue({
                ...value,
                [infoLine.nombre]: text,
              })
            }
          />
        );
      case TipoInfoLine.date:
        return (
          <DateTimePickerField
            error={error}
            date={inputValue || new Date()}
            setDate={(val: any) => {
              setValue({
                ...value,
                [infoLine.nombre]: val,
              });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View
      width="100%"
      display="flex"
      flexDir="column"
      style={{ gap: 5 }}
      alignItems="center"
      justifyContent="center"
    >
      {infoLines?.map((infoLine) => (
        <FormControl key={infoLine.nombre} isRequired={infoLine.requerido}>
          {handleRenderInfoLineInput(infoLine)}
        </FormControl>
      ))}
    </View>
  );
};

export default InfoLineForm;
