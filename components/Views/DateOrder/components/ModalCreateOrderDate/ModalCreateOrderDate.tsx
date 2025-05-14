import * as React from "react";
import { Modal, View, StyleSheet, Pressable } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Button, FormControl, Text } from "native-base";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import CustomText from "@/components/CustomText";
import InputField from "@/components/InputField";
import { useUser } from "@/hooks/redux/useUser";
import api from "@/services/api/admin";
import { useToastContext } from "@/contexts/ToastContext";
import { FormattedMessage, useIntl } from "react-intl";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";

interface IDateOrder {
  es_defecto: boolean;
  id?: number;
  id_tipo_servicio?: number;
  nombre: string;
  requerido: boolean;
  tipo: string;
}

interface IProps {
  data?: IDateOrder;
  onClose: () => void;
  updateOrder: (newOrder: IDateOrder) => void;
}

const initialValues = {
  es_defecto: false,
  id_tipo_servicio: 1,
  nombre: "",
  requerido: false,
  tipo: "",
};

const ModalCreateOrderDate = ({ data, onClose, updateOrder }: IProps) => {
  const { user } = useUser();
  const { showToast } = useToastContext();
  const intl = useIntl();
  const [loadingApi, setloadingApi] = React.useState<boolean>(false)
  const [stateModalConfirm, setstateModalConfirm] = React.useState<boolean>(false)

  const [form, setForm] = React.useState<IDateOrder>(
    data ? data : initialValues,
  );
  const isValidData = !!form.nombre && !!form.requerido && !!form.tipo;

  const handleChangeValue = (key: string, value: any) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };


  const createOrderData = async () => {
    setloadingApi(true)
    try {
      const data = await api.dataOrder.create({
        ...form,
        id_tipo_servicio: user.tipo_servicio,
      });
      if (data) {
        updateOrder(data);
        onClose();
        showToast({
          title: <FormattedMessage id="orderCreatedSuccess" />,
          status: "success",
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setloadingApi(false)
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={styles.container}>
        <View
          style={styles.containerContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.headerContent}>
            <View style={styles.decorateDiv}></View>

            <View style={styles.containerCreate}>
              <View style={styles.containerTitle}>
                <Button variant="unstyled" hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} bg={'transparent'} onPress={onClose}>
                  <EvilIcons name="close" size={25} color={"white"} />
                </Button>
                <CustomText style={{ color: "white", fontSize: 20 }}>
                  <FormattedMessage id="create" />
                </CustomText>
              </View>
              <Button
                variant="unstyled"
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                style={{ padding: 4 }}
                onPress={createOrderData}
                disabled={!isValidData}
                bg={'transparent'}
                isLoading={loadingApi}

              >
                <CustomText
                  style={{ color: isValidData ? "white" : "#696969" }}
                >
                  <FormattedMessage id="save" />
                </CustomText>
              </Button>
            </View>
          </View>
          <View style={styles.bodyContent}>
            <InputField
              value={form.nombre}
              onChangeText={(text) => handleChangeValue("nombre", text)}
              label={<Text mx={1}> <FormattedMessage id="name" /> </Text>}
              placeholder={"Enter name"}
            />

            <FormControl isRequired style={styles.containerInput}>
              <FormControl.Label>
                <Text mx={1}>
                  <FormattedMessage id="required" />
                </Text>
              </FormControl.Label>
              <View style={styles.input}>
                <RNPickerSelect
                  value={form.requerido}
                  onValueChange={(value) =>
                    handleChangeValue("requerido", value)
                  }
                  items={[
                    { label: "Si", value: true },
                    { label: "No", value: false },
                  ]}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    inputAndroid: styles.inputElement,
                    inputIOS: styles.inputElement,
                  }}
                />
              </View>
            </FormControl>
            <FormControl isRequired style={styles.containerInput}>
              <FormControl.Label>
                <Text mx={1}>
                  <FormattedMessage id="type" />
                </Text>
              </FormControl.Label>
              <View style={styles.input}>
                <RNPickerSelect
                  value={form.tipo}
                  onValueChange={(value) => handleChangeValue("tipo", value)}
                  items={[
                    { label: intl.formatMessage({ id: "dateOrderTypeText" }), value: "string" },
                    { label: intl.formatMessage({ id: "dateOrderTypeNumber" }), value: "number" },
                    { label: intl.formatMessage({ id: "dateOrderTypeBoolean" }), value: "boolean" },
                    { label: intl.formatMessage({ id: "dateOrderTypeDate" }), value: "date" },
                  ]}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    inputAndroid: styles.inputElement,
                    inputIOS: styles.inputElement,
                  }}
                />
              </View>
            </FormControl>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ModalCreateOrderDate;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 12,
  },
  headerContent: {
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    paddingHorizontal: 8,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#2C2C2C",
    alignItems: "center",
  },
  containerCreate: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  containerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingVertical: 30,
  },
  input: {
    marginTop: 5,
    width: "100%",
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 5,
  },
  inputElement: {
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: 8,
    lineHeight: 40,
    fontSize: 16,
    color: 'black',
    includeFontPadding: false, // 👈 solo en Android: remueve padding interno de la fuente
    textAlignVertical: 'center', // 👈 centra el texto verticalmente en Android
  },
  decorateDiv: {
    marginBottom: 12,
    width: "60%",
    height: 12,
    borderRadius: 12,
    backgroundColor: "#818181",
  },
  containerInput: {
    marginTop: 15,
    width: "100%",
  },
});
