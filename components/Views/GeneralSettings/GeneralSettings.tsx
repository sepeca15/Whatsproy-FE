import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import DateTimeInputField from "@/components/DateTimePickerField";
import InputField from "@/components/InputField";
import { TipoServicio } from "@/enums/TipoServicio";
import { useUser } from "@/hooks/redux/useUser";
import { Button, Switch, Text, View, VStack } from "native-base";
import * as React from "react";
import { StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { FormattedMessage, useIntl } from "react-intl"; // Importa FormattedMessage y useIntl

interface IForm {
  hora_apertura: string;
  hora_cierre: string;
  abierto: boolean;
  intervaloTiempoCalendario: number;
  notificarReservaHoras: boolean;
  remaindersHorsRemainder: number;
}

const GeneralConfig = () => {
  const { handleUpdateCompany, user } = useUser();
  const intl = useIntl(); 
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  const [hasChanges, setHasChanges] = React.useState<boolean>(false);

  const [form, setForm] = React.useState<IForm>({
    hora_apertura: user.hora_apertura,
    hora_cierre: user.hora_cierre,
    abierto: user.abierto,
    intervaloTiempoCalendario: user.intervaloTiempoCalendario,
    notificarReservaHoras: user.notificarReservaHoras,
    remaindersHorsRemainder: user.remaindersHorsRemainder,
  });

  const handleInputChange = (key: string, value: any) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const updateCompany = async () => {
    setLoadingApi(true);
    try {
      await handleUpdateCompany(form);
      setHasChanges(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingApi(false);
    }
  };

  const detectChanges = () => {
    let hasChanges = false;
    Object.keys(form).map((item) => {
      const key = item as keyof IForm;
      if (form[key] !== user[key]) {
        hasChanges = true;
      }
    });

    return hasChanges;
  };

  React.useEffect(() => {
    const changes = detectChanges();
    setHasChanges(changes);
  }, [form]);

  return (
    <View style={styles.container}>
      <CustomText
        style={{
          fontSize: 30,
          textAlign: "center",
          fontWeight: "bold",
          paddingTop: 20,
        }}
      >
        <FormattedMessage
          id="generalConfigTitle"
          defaultMessage="Configuración General"
        />
      </CustomText>
      <CustomText
        style={{ textAlign: "center", color: "#b6b6b6", paddingBottom: 20 }}
      >
        <FormattedMessage
          id="generalConfigSubtitle"
          defaultMessage="Ajusta los parámetros de tu negocio"
        />
      </CustomText>
      <View style={styles.form}>
        <View>
          <InputField
            label={intl.formatMessage({
              id: "openingTimeLabel",
              defaultMessage: "Hora de apertura",
            })}
            placeholder={intl.formatMessage({
              id: "enterOpeningTime",
              defaultMessage: "Ingresa la hora de apertura",
            })}
            value={form.hora_apertura}
            onChangeText={(value) => handleInputChange("hora_apertura", value)}
          />
        </View>
        <View>
          <InputField
            label={intl.formatMessage({
              id: "closingTimeLabel",
              defaultMessage: "Hora de cierre",
            })}
            placeholder={intl.formatMessage({
              id: "enterClosingTime",
              defaultMessage: "Ingresa la hora de cierre",
            })}
            value={form.hora_cierre}
            onChangeText={(value) => handleInputChange("hora_cierre", value)}
          />
        </View>
        <View style={styles.notifReserva}>
          <View style={styles.row1}>
            <CustomText>
              <FormattedMessage
                id="openCloseLabel"
                defaultMessage="Abrir/Cerrar local"
              />
            </CustomText>
            <Switch
              isChecked={form.abierto}
              onToggle={() => handleInputChange("abierto", !form.abierto)}
              size="lg"
              colorScheme="primary"
            />
          </View>
        </View>

        {user.empresa_id !== TipoServicio.RESERVA && (
          <View style={styles.colum}>
            <View style={styles.notifReserva}>
              <View style={styles.row1}>
                <CustomText>
                  <FormattedMessage
                    id="notifyReservationLabel"
                    defaultMessage="Notificar Reserva?"
                  />
                </CustomText>
                <Switch
                  isChecked={form.notificarReservaHoras}
                  onToggle={() =>
                    handleInputChange(
                      "notificarReservaHoras",
                      !form.notificarReservaHoras,
                    )
                  }
                  size="lg"
                  colorScheme="primary"
                />
              </View>
              <View style={styles.row2}>
                <MaterialIcons
                  style={{ marginRight: 6 }}
                  name="error-outline"
                  color={"black"}
                  size={20}
                />
                <CustomText style={{ maxWidth: "95%" }}>
                  <FormattedMessage
                    id="notifyReservationDescription"
                    defaultMessage="Si activas esta opción, se le notificará al usuario el tiempo antes de realizarse la reserva"
                  />
                </CustomText>
              </View>
            </View>
            <View>
              <InputField
                keyboardType={"number"}
                label={intl.formatMessage({
                  id: "intervalBetweenReservationsLabel",
                  defaultMessage: "Intervalo entre reservas",
                })}
                placeholder={intl.formatMessage({
                  id: "enterIntervalBetweenReservations",
                  defaultMessage: "Ingresa el intervalo entre reservas",
                })}
                value={form.intervaloTiempoCalendario.toString()}
                onChangeText={(value) =>
                  handleInputChange("intervaloTiempoCalendario", value)
                }
              />
            </View>
            {form.notificarReservaHoras && (
              <View>
                <InputField
                  icon={
                    <SimpleLineIcons
                      style={{ marginLeft: 12 }}
                      color={"#b6b6b6"}
                      name="clock"
                      size={20}
                    />
                  }
                  label={intl.formatMessage({
                    id: "notifyUserXHoursBeforeLabel",
                    defaultMessage: "Notificar al usuario X horas antes",
                  })}
                  placeholder={intl.formatMessage({
                    id: "enterNotificationInterval",
                    defaultMessage: "Ingresa el intervalo",
                  })}
                  value={form.remaindersHorsRemainder.toString()}
                  onChangeText={(value) =>
                    handleInputChange("remaindersHorsRemainder", value)
                  }
                />
              </View>
            )}
          </View>
        )}
      </View>
      <CustomButton
        colorSpiner="white"
        disabled={!hasChanges}
        onPress={updateCompany}
        loading={loadingApi}
        style={[
          styles.button,
          {
            backgroundColor: hasChanges ? "black" : "#b6b6b6",
          },
        ]}
      >
        <VStack style={styles.rowButton}>
          <CustomText style={{ color: "white" }}>
            <FormattedMessage id="saveButton" defaultMessage="Guardar" />
          </CustomText>
        </VStack>
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    margin: "auto",
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 20,
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  notifReserva: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  row1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row2: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  colum: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  button: {
    width: "100%",
    height: 50,
    display: "flex",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  rowButton: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default GeneralConfig;
