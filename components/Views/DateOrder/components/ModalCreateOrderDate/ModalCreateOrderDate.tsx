import * as React from "react";
import { Modal, Text, View, Pressable, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Button, FormControl } from "native-base";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import CustomText from "@/components/CustomText";
import InputField from "@/components/InputField";
import { useUser } from "@/hooks/redux/useUser";
import api from "@/services/api/admin";
import { useToastContext } from "@/contexts/ToastContext";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage

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
                <Pressable onPress={onClose}>
                  <EvilIcons name="close" size={25} color={"white"} />
                </Pressable>
                <CustomText style={{ color: "white", fontSize: 20 }}>
                  <FormattedMessage id="create" />
                </CustomText>
              </View>
              <Pressable
                style={{ padding: 4 }}
                onPress={createOrderData}
                disabled={!isValidData}
              >
                <CustomText
                  style={{ color: isValidData ? "white" : "#696969" }}
                >
                  <FormattedMessage id="save" />
                </CustomText>
              </Pressable>
            </View>
          </View>
          <View style={styles.bodyContent}>
            <InputField
              value={form.nombre}
              onChangeText={(text) => handleChangeValue("nombre", text)}
              label={<FormattedMessage id="name" />}
              placeholder={<FormattedMessage id="enterName" />}
            />
            <FormControl isRequired style={styles.containerInput}>
              <FormControl.Label>
                <FormattedMessage id="required" />
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
                  style={{
                    inputAndroid: styles.inputElement,
                    inputIOS: styles.inputElement,
                  }}
                  placeholder={{
                    label: <FormattedMessage id="selectRequired" />,
                    value: null,
                  }}
                />
              </View>
            </FormControl>
            <FormControl isRequired style={styles.containerInput}>
              <FormControl.Label>
                <FormattedMessage id="type" />
              </FormControl.Label>
              <View style={styles.input}>
                <RNPickerSelect
                  value={form.tipo}
                  onValueChange={(value) => handleChangeValue("tipo", value)}
                  items={[
                    { label: "string", value: "string" },
                    { label: "number", value: "number" },
                    { label: "boolean", value: "boolean" },
                  ]}
                  style={{
                    inputAndroid: styles.inputElement,
                    inputIOS: styles.inputElement,
                  }}
                  placeholder={{
                    label: <FormattedMessage id="selectType" />,
                    value: null,
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
    paddingHorizontal: 16,
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
    gap: 12,
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
  inputElement: {},
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
