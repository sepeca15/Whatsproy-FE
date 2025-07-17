import React, { useMemo } from "react";
import { FormControl, Switch, View, Text, VStack } from "native-base";
import DateTimePickerField from "./DateTimePickerField";
import InputField from "./InputField";
import { useUser } from "@/hooks/redux/useUser";
import * as moment from "moment-timezone";
import {
  InfoLineDTO,
  TipoInfoLine,
} from "@/services/api/dateOrder/dataOrder.type";

interface Props {
  value: Record<string, any>;
  setValue: (val: Record<string, any>) => void;
  infoLines: InfoLineDTO[];
  errors: Record<string, string>;
}

const InfoLineForm: React.FC<Props> = ({
  value,
  setValue,
  infoLines,
  errors,
}) => {
  const { user } = useUser();

  // fallback memoizado para la zona horaria
  const defaultDate = useMemo(() => {
    const tz = user?.timeZone ?? moment.tz.guess();
    return moment.tz(tz);
  }, [user?.timeZone]);

  if (infoLines.length === 0) return null;
  

  return (
    <VStack space={4} width="100%">
      {infoLines.map((infoLine, index) => {
        const fieldVal = value[infoLine.nombre];
        const errorMsg = errors[infoLine.nombre];

        return (
          <FormControl
            key={infoLine.nombre + index}
            isInvalid={!!errorMsg}
            isRequired={infoLine.requerido}
          >
            <FormControl.Label>
              <Text allowFontScaling={false}>{infoLine.nombre}</Text>
            </FormControl.Label>

            {infoLine.tipo === TipoInfoLine.boolean && (
              <Switch
                isChecked={!!fieldVal}
                onToggle={(val) =>
                  setValue({ ...value, [infoLine.nombre]: val })
                }
              />
            )}

            {infoLine.tipo === TipoInfoLine.number && (
              <InputField
                placeholder={`Ingresar ${infoLine.nombre}`}
                keyboardType="numeric"
                value={fieldVal?.toString() ?? ""}
                onChangeText={(t) =>
                  setValue({
                    ...value,
                    [infoLine.nombre]: parseFloat(t) || "",
                  })
                }
                error={errorMsg}
              />
            )}

            {infoLine.tipo === TipoInfoLine.string && (
              <InputField
                placeholder={`Ingresar ${infoLine.nombre}`}
                value={fieldVal ?? ""}
                onChangeText={(t) =>
                  setValue({ ...value, [infoLine.nombre]: t })
                }
                error={errorMsg}
              />
            )}

            {infoLine.tipo === TipoInfoLine.date && (
              <DateTimePickerField
                onlyDate={true}
                type="datetime"
                date={fieldVal ?? defaultDate}
                setDate={(dt: any) =>
                  setValue({ ...value, [infoLine.nombre]: dt })
                }
                error={errorMsg}
              />
            )}

            {errorMsg && (
              <FormControl.ErrorMessage>
                {errorMsg}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        );
      })}
    </VStack>
  );
};

export default React.memo(InfoLineForm);
