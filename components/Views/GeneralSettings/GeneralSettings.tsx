import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import InputField from "@/components/InputField";
import { TipoServicio } from "@/enums/TipoServicio";
import { useUser } from "@/hooks/redux/useUser";
import { ScrollView, Switch, View, VStack } from "native-base";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { FormattedMessage, useIntl } from "react-intl"; // Importa FormattedMessage y useIntl
import Animated from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "./GeneralSettingsStyles";
import { Colors } from "@/constants/Colors";

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
  const router = useRouter();

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
    <ScrollView>
      <View style={styles.container}>
        <Animated.View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <AntDesign name="arrowleft" size={22} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <CustomText
                style={styles.businessName}
                accessibilityLabel="Pedidos"
              >
                <FormattedMessage
                  id="generalConfigTitle"
                  defaultMessage="Configuración General"
                />
              </CustomText>
            </View>
          </View>
        </Animated.View>
        <View style={styles.containerGlobal}>
          <View style={styles.form}>
            <View style={styles.container1}>
              <View style={styles.inputContainer}>
                <CustomText style={styles.textInput}>
                  <FormattedMessage id="openingTimeLabel" defaultMessage={'Hora de apertura'} />
                </CustomText>
                <InputField
                  icon={
                    <SimpleLineIcons
                      style={{ marginLeft: 12 }}
                      color={"#b6b6b6"}
                      name="clock"
                      size={16}
                    />
                  }
                  placeholder={intl.formatMessage({
                    id: "enterOpeningTime",
                    defaultMessage: "Ingresa la hora de apertura",
                  })}
                  value={form.hora_apertura}
                  onChangeText={(value) =>
                    handleInputChange("hora_apertura", value)
                  }
                />
              </View>
              <View style={styles.inputContainer}>
                <CustomText style={styles.textInput}>
                  <FormattedMessage id="closingTimeLabel" defaultMessage={'Hora de cierre'} />
                </CustomText>
                <InputField
                  icon={
                    <SimpleLineIcons
                      style={{ marginLeft: 12 }}
                      color={"#b6b6b6"}
                      name="clock"
                      size={16}
                    />
                  }
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
                  <CustomText style={styles.textInput}>
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
            </View>

            {user.empresa_id !== TipoServicio.RESERVA && (
              <View style={styles.colum}>
                <View style={styles.notifReserva}>
                  <View style={styles.containerNotifReserva}>
                    <View style={styles.row1Custom}>
                      <CustomText style={styles.textInput}>
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
                            !form.notificarReservaHoras
                          )
                        }
                        size="lg"
                        colorScheme="primary"
                      />
                    </View>
                    <CustomText style={{ fontSize: 12, color: 'gray' }}>
                      <FormattedMessage
                        id="notifyReservationDescription"
                        defaultMessage="Si activas esta opción, se le notificará al usuario el tiempo antes de realizarse la reserva"
                      />
                    </CustomText>

                  </View>
                </View>
                <View style={styles.containerHorasReserva}>
                  <View style={styles.inputContainer}>
                    <CustomText style={styles.textInput}>
                      <FormattedMessage
                        id="intervalBetweenReservationsLabel"
                        defaultMessage="Intervalo entre reservas"
                      />
                    </CustomText>
                    <InputField
                      keyboardType={"number"}
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
                    <View style={styles.inputContainer}>
                      <CustomText style={styles.textInput}>
                        <FormattedMessage
                          id="notifyUserXHoursBeforeLabel"
                          defaultMessage="Notificar al usuario X horas antes"
                        />
                      </CustomText>
                      <InputField
                        icon={
                          <SimpleLineIcons
                            style={{ marginLeft: 12 }}
                            color={"#b6b6b6"}
                            name="clock"
                            size={20}
                          />
                        }
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
                <CustomButton
                  colorSpiner="white"
                  disabled={!hasChanges}
                  onPress={updateCompany}
                  loading={loadingApi}
                  style={[
                    styles.button,
                    {
                      backgroundColor: hasChanges ? Colors.light.primary : "#b6b6b6",
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
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default GeneralConfig;
