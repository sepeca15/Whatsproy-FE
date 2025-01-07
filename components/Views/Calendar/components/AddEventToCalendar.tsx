import * as React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Button, FormControl, View, Text } from "native-base";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import CustomText from "@/components/CustomText";
import InputField from "@/components/InputField";
import { useUser } from "@/hooks/redux/useUser";
import api from "@/services/api/admin";
import { TipoServicio } from "../../../../enums/TipoServicio";
import DateTimePickerField from "@/components/DateTimePickerField";
import MultiSelectInput from "@/components/MultiSelectInput";
import { ModalStyles } from "@/components/ModalStyles";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Cliente } from "@/services/api/clients/cliente.types";
import { Producto } from "@/services/api/products/product.types";
import { findClientsWithQuery } from "@/services/api/clients/clients";
import { findProductsWithQuery } from "@/services/api/products/products";

interface IProps {
  onClose: () => void;
  defaultDate?: any;
  handleAddOrUpdate: (data: any) => void;
}

const initialValues = {
  es_defecto: false,
  detalles: "",
  id_tipo_servicio: 1,
  nombre: "",
  requerido: false,
  tipo: "",
  date: new Date(),
  productsIds: [],
};

const AddEventToCalendarModal = ({ onClose, handleAddOrUpdate, defaultDate }: IProps) => {
  const { user } = useUser();
  const [form, setForm] = React.useState({
    ...initialValues,
    date: defaultDate ? new Date(defaultDate) : new Date(),
  });
  const isValidData =
    !!form.nombre && form.productsIds?.length > 0 && !!form.tipo && !!form.date;

  const [clients, setClients] = React.useState<Cliente[]>([]);
  const [products, setProducts] = React.useState<Producto[]>([]);
  const [loadingClients, setLoadingClients] = React.useState(false);
  const [loadingProducts, setLoadingProducts] = React.useState(false);

  const handleChangeValue = (key: string, value: any) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleFindClients = async (query: string) => {
    try {
      setLoadingClients(true);
      const resp = await findClientsWithQuery(query, user?.id_empresa);
      if (resp.data) {
        setClients(resp.data);
      }
    } catch (error) {
      console.error("error loading clients");
    } finally {
      setLoadingClients(false);
    }
  };

  const handleFindProducts = async (query: string) => {
    try {
      setLoadingProducts(true);
      const resp = await findProductsWithQuery(query);
      if (resp.data) {
        setProducts(resp.data);
      }
    } catch (error) {
      console.error("error loading products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const createOrderData = async () => {
    try {
      const data = await api.dataOrder.create({
        ...form,
        id_tipo_servicio: TipoServicio.RESERVA,
      });
      handleAddOrUpdate(data);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} style={ModalStyles.container}>
        <View
          style={ModalStyles.containerContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={ModalStyles.headerContent}>
            <View style={ModalStyles.decorateDiv}></View>

            <View style={ModalStyles.containerCreate}>
              <View style={ModalStyles.containerTitle}>
                <Pressable onPress={onClose}>
                  <EvilIcons name="close" size={25} color={"white"} />
                </Pressable>
                <CustomText style={{ color: "white", fontSize: 20 }}>
                  Agregar nuevo evento
                </CustomText>
              </View>
              <Pressable onPress={createOrderData} disabled={!isValidData}>
                <CustomText
                  style={{ color: isValidData ? "white" : "#696969" }}
                >
                  Crear evento
                </CustomText>
              </Pressable>
            </View>
          </View>
          <View style={ModalStyles.bodyContent}>
            <DateTimePickerField
              date={form.date}
              setDate={(val: any) => handleChangeValue("detalles", val)}
            />
             <View
              display="flex"
              style={{ gap: 8 }}
              flexDirection={"row"}
              alignItems={"center"}
            >
              <Ionicons
                color={Colors.light.primary}
                name="sparkles-outline"
                size={24}
              />
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontSize: 16,
                  cursor: "pointer",
                  marginBottom: 0,
                  color: Colors.light.primary,
                }}
              >
                Mostrar siguiente horario disponible
              </Text>
            </View>
            <MultiSelectInput
              isRequired
              setItemsSelected={(data: string[]) =>
                handleChangeValue("productIds", data)
              }
              isMultiple
              placeholder="Seleccionar productos"
              label="Productos"
              loading={loadingProducts}
              options={products?.map((prod) => {
                return {
                  label: (
                    <View
                      display={"flex"}
                      flexDirection={"row"}
                      alignItems={"center"}
                      justifyContent={"start"}
                      width={'100%'}
                      height={'100%'}
                      style={{ gap: 5, paddingBottom: 10 }}
                    >
                      <View width={36} height={36} borderRadius={6} backgroundColor={'gray.400'} />
                      <View
                        display={"flex"}
                        flexDirection={"column"}
                        flexGrow={1}
                        style={{ gap: 0 }}
                        justifyContent={"start"}
                      >
                        <Text
                          color={"gray.800"}
                          fontSize={16}
                          fontWeight={"medium"}
                        >
                          {prod?.nombre ?? ""}
                        </Text>
                        <Text fontSize={12} lineHeight={15} color={"gray.600"}>
                          {prod?.descripcion ?? ""}
                        </Text>
                      </View>
                      <View paddingRight={10}>
                        <Text marginTop={3} fontWeight={'semibold'} color={'yellow.800'}>${prod?.precio}</Text>
                      </View>
                    </View>
                  ),
                  placeholder: prod?.nombre,
                  value: prod?.id ?? "",
                };
              })}
              onSearch={(query: string) => {
                handleFindProducts(query);
              }}
            />
            <InputField
              isRequired={false}
              isTextArea
              value={form.detalles}
              onChangeText={(text) => handleChangeValue("detalles", text)}
              label="Detalles"
              placeholder="Agregar detalles"
            />
            <MultiSelectInput
              setItemsSelected={(data: string[]) =>
                handleChangeValue("productIds", data)
              }
              isMultiple={false}
              onSearch={(query: string) => {
                handleFindClients(query);
              }}
              loading={loadingClients}
              placeholder="Seleccionar cliente"
              label="Clientes"
              options={clients?.map((client) => {
                return {
                  label: (
                    <View
                      display={"flex"}
                      flexDirection={"row"}
                      alignItems={"center"}
                      justifyContent={"start"}
                      style={{ gap: 5, paddingBottom: 10 }}
                    >
                      <Ionicons
                        color={Colors.light.primary}
                        name="person-circle"
                        size={36}
                      />
                      <View
                        display={"flex"}
                        flexDirection={"column"}
                        style={{ gap: 2 }}
                        justifyContent={"start"}
                      >
                        <Text
                          color={"gray.800"}
                          fontSize={16}
                          fontWeight={"medium"}
                        >
                          {client?.nombre ?? ""}
                        </Text>
                        <Text fontSize={12} lineHeight={15} color={"gray.600"}>
                          {client?.telefono ?? ""}
                        </Text>
                      </View>
                    </View>
                  ),
                  placeholder: client?.nombre,
                  value: client?.id ?? "",
                };
              })}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default AddEventToCalendarModal;
