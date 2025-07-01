"use client";

import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import InputField from "@/components/InputField";
import { TipoServicio } from "@/enums/TipoServicio";
import { useUser } from "@/hooks/redux/useUser";
import { ScrollView, Switch, View, VStack, Image } from "native-base";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { FormattedMessage, useIntl } from "react-intl";
import Animated from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "./GeneralSettingsStyles";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/components/globalStyles";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useToastContext } from "@/contexts/ToastContext";
import CustomHeader from "@/components/CustomHeader/CustomHeader";

interface IForm {
  hora_apertura: string;
  assistentEnabled?: boolean;
  hora_cierre: string;
  abierto: boolean;
  intervaloTiempoCalendario: number;
  notificarReservaHoras: boolean;
  remaindersHorsRemainder: number;
  retiroEnSucursal?: boolean;
  logo?: string;
  notificarMenuDiario?: boolean;
  direccion?: string;
}

const GeneralConfig = () => {
  const { handleUpdateCompany, user } = useUser();
  const intl = useIntl();
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  const [hasChanges, setHasChanges] = React.useState<boolean>(false);
  const [uploadingLogo, setUploadingLogo] = React.useState<boolean>(false);

  const isAdmin = user?.isAdmin;
  const isDeliveryService = user?.tipo_servicio === TipoServicio.DELIVERY;
  const { showToast } = useToastContext();

  const [form, setForm] = React.useState<IForm>({
    hora_apertura: user.hora_apertura,
    hora_cierre: user.hora_cierre,
    abierto: user.abierto,
    assistentEnabled: user?.assistentEnabled,
    intervaloTiempoCalendario: user.intervaloTiempoCalendario,
    notificarReservaHoras: user.notificarReservaHoras,
    remaindersHorsRemainder: user.remaindersHorsRemainder,
    retiroEnSucursal: user?.retiroEnSucursal,
    logo: user?.logo,
    notificarMenuDiario: user?.notificarMenuDiario,
    direccion: user?.direccion,
  });
  const router = useRouter();

  const handleInputChange = (key: string, value: any) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        showToast({
          status: "success",
          title: intl.formatMessage({
            id: "permissionRequired",
            defaultMessage: "Permiso requerido",
          }),
          description: intl.formatMessage({
            id: "cameraPermissionMessage",
            defaultMessage: "Se necesita permiso para acceder a la galería",
          }),
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingLogo(true);
        const imageUri = result.assets[0].uri;

        setTimeout(() => {
          handleInputChange("logo", imageUri);
          setUploadingLogo(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setUploadingLogo(false);
    }
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
        <CustomHeader
          title={
            <FormattedMessage
              id="generalConfigTitle"
              defaultMessage="Configuración General"
            />
          }
          onBack={() => router.back()}
          showBackButton
        />

        <View style={styles.containerGlobal}>
          <View style={styles.logoSection}>
            <View style={styles.logoHeader}>
              <MaterialIcons
                name="business"
                size={20}
                color={Colors.light.primary}
              />
              <CustomText style={styles.sectionTitle}>
                <FormattedMessage
                  id="logoSection"
                  defaultMessage="Logo de la empresa"
                />
              </CustomText>
            </View>

            <TouchableOpacity
              style={styles.logoContainer}
              onPress={pickImage}
              disabled={uploadingLogo}
              activeOpacity={0.8}
            >
              {form.logo ? (
                <>
                  <Image
                    source={{ uri: form.logo }}
                    style={styles.logoImage}
                    alt="Company Logo"
                  />
                  <View style={styles.logoEditOverlay}>
                    <MaterialIcons name="edit" size={16} color="white" />
                  </View>
                </>
              ) : (
                <View style={styles.logoPlaceholder}>
                  <View style={styles.logoIconContainer}>
                    <MaterialIcons
                      name="add-photo-alternate"
                      size={32}
                      color={Colors.light.primary}
                    />
                  </View>
                  <CustomText style={styles.logoPlaceholderText}>
                    <FormattedMessage
                      id="addLogo"
                      defaultMessage="Agregar logo"
                    />
                  </CustomText>
                </View>
              )}

              {uploadingLogo && (
                <View style={styles.logoLoadingOverlay}>
                  <View style={styles.logoSpinner} />
                  <CustomText style={styles.uploadingText}>
                    <FormattedMessage
                      id="uploadingLogo"
                      defaultMessage="Subiendo..."
                    />
                  </CustomText>
                </View>
              )}
            </TouchableOpacity>

            <CustomText style={styles.logoHint}>
              <MaterialIcons
                name="touch-app"
                size={14}
                color={Colors.light.icon}
              />{" "}
              <FormattedMessage
                id="logoHint"
                defaultMessage={
                  form.logo ? "Toca para cambiar" : "Toca para agregar tu logo"
                }
              />
            </CustomText>
          </View>

          <View style={styles.addressSection}>
            <View style={styles.addressHeader}>
              <MaterialIcons
                name="location-on"
                size={20}
                color={Colors.light.primary}
              />
              <CustomText style={styles.sectionTitle}>
                <FormattedMessage
                  id="companyAddress"
                  defaultMessage="Dirección de la empresa"
                />
              </CustomText>
            </View>

            <View style={styles.addressInputContainer}>
              <InputField
                icon={
                  <MaterialIcons
                    name="place"
                    size={20}
                    color={Colors.light.icon}
                    style={{ marginLeft: 12 }}
                  />
                }
                placeholder={intl.formatMessage({
                  id: "enterCompanyAddress",
                  defaultMessage: "Ingresa la dirección de tu empresa",
                })}
                value={form.direccion || ""}
                onChangeText={(value) => handleInputChange("direccion", value)}
                multiline={true}
                numberOfLines={2}
                style={styles.addressInput}
              />
              <CustomText style={styles.addressHint}>
                <FormattedMessage
                  id="addressHint"
                  defaultMessage="Esta dirección aparecerá en los pedidos y será visible para los clientes"
                />
              </CustomText>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.container1}>
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

              <View style={styles.notifReserva}>
                <View style={styles.row1}>
                  <CustomText style={styles.textInput}>
                    <FormattedMessage
                      id="assistentEnabled"
                      defaultMessage="Asistente habilitado"
                    />
                  </CustomText>
                  <Switch
                    isChecked={form.assistentEnabled}
                    onToggle={() =>
                      handleInputChange(
                        "assistentEnabled",
                        !form.assistentEnabled
                      )
                    }
                    size="lg"
                    colorScheme="primary"
                  />
                </View>
              </View>

              <View style={styles.notifReserva}>
                <View style={styles.containerNotifReserva}>
                  <View style={styles.row1Custom}>
                    <CustomText style={styles.textInput}>
                      <FormattedMessage
                        id="notifyDailyMenuLabel"
                        defaultMessage="Notificar menú diario"
                      />
                    </CustomText>
                    <Switch
                      isChecked={form.notificarMenuDiario}
                      onToggle={() =>
                        handleInputChange(
                          "notificarMenuDiario",
                          !form.notificarMenuDiario
                        )
                      }
                      size="lg"
                      colorScheme="primary"
                    />
                  </View>
                  <CustomText style={{ fontSize: 12, color: "gray" }}>
                    <FormattedMessage
                      id="notifyDailyMenuDescription"
                      defaultMessage="Permite enviar notificaciones del menú diario a los clientes seleccionados"
                    />
                  </CustomText>
                </View>
              </View>

              {isDeliveryService && (
                <View style={styles.notifReserva}>
                  <View style={styles.containerNotifReserva}>
                    <View style={styles.row1Custom}>
                      <CustomText style={styles.textInput}>
                        <FormattedMessage
                          id="pickupInStoreLabel"
                          defaultMessage="Retiro en sucursal"
                        />
                      </CustomText>
                      <Switch
                        isChecked={form.retiroEnSucursal}
                        onToggle={() =>
                          handleInputChange(
                            "retiroEnSucursal",
                            !form.retiroEnSucursal
                          )
                        }
                        size="lg"
                        colorScheme="primary"
                      />
                    </View>
                    <CustomText style={{ fontSize: 12, color: "gray" }}>
                      <FormattedMessage
                        id="pickupInStoreDescription"
                        defaultMessage="Permite a los clientes retirar sus pedidos directamente en tu local"
                      />
                    </CustomText>
                  </View>
                </View>
              )}
            </View>

            {user.tipo_servicio === TipoServicio.RESERVA && (
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
                    <CustomText style={{ fontSize: 12, color: "gray" }}>
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
              </View>
            )}

            {isAdmin && (
              <CustomButton
                colorSpiner="white"
                disabled={!hasChanges}
                onPress={updateCompany}
                loading={loadingApi}
                style={[
                  styles.button,
                  {
                    backgroundColor: hasChanges
                      ? Colors.light.primary
                      : "#b6b6b6",
                  },
                ]}
              >
                <VStack style={styles.rowButton}>
                  <CustomText style={{ color: "white" }}>
                    <FormattedMessage
                      id="saveButton"
                      defaultMessage="Guardar"
                    />
                  </CustomText>
                </VStack>
              </CustomButton>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default GeneralConfig;
