import * as React from "react";
import { Modal, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import {
  Button,
  FormControl,
  View,
  Text,
  IconButton,
  VStack,
} from "native-base";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import CustomText from "@/components/CustomText";
import InputField from "@/components/InputField";
import { useUser } from "@/hooks/redux/useUser";
import api from "@/services/api/admin";
import { TipoServicio } from "../enums/TipoServicio";
import MultiSelectInput from "@/components/MultiSelectInput";
import { ModalStyles } from "@/components/ModalStyles";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Cliente } from "@/services/api/clients/cliente.types";
import { Producto } from "@/services/api/products/product.types";
import { findClientsWithQuery } from "@/services/api/clients/clients";
import { findProductsWithQuery } from "@/services/api/products/products";
import moment from "moment";
import {
  CreateOrderDTO,
  OrderEstadoDefault,
} from "@/services/api/order/order.type";
import InfoLineForm from "@/components/InfoLineForm";
import {
  EmpresaTypeStr,
  ID_TIPOSERVICIO_RESERVA,
  TipoServicioType,
} from "@/services/api/tiposervicio/tiposervicio.type";
import {
  FECHA_HORA_INFOLINE_RESERVA,
  InfoLineDTO,
} from "@/services/api/dateOrder/dataOrder.type";
import { DEFAULT_ESTADO_CREADO } from "@/services/api/estado/estado.type";
import GlobalModal from "./Modal";
import CustomButton from "./CustomButton";
import Toast from "react-native-toast-message";
import { useToastContext } from "@/contexts/ToastContext";
import { data } from "./Views/Pedidos/components/data";
import { getNextDateAvailable } from "@/services/api/order/order";
import {
  filterOnlyHours,
  getHourNumber,
  removeAmPm,
  removeTimeZone,
} from "@/utils/date";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import TimePicker from "./TimePicker";

interface IProps {
  onClose: () => void;
  defaultDate?: any;
  tipoServicio: TipoServicioType;
  onSuccess?: () => void;
  currentOrders?: any[];
}

const initialValues: CreateOrderDTO = {
  confirmado: true,
  estadoId: OrderEstadoDefault.CREADO,
  clientName: "",
  products: [],
  empresaType: "",
  messages: [],
  detalles: "",
  infoLinesJson: {},
  fecha: new Date(),
};

interface prodItems {
  prodId: number;
  cantidad: number;
}

const CreateOrderModal = ({
  onClose,
  defaultDate,
  tipoServicio,
  onSuccess,
  currentOrders,
}: IProps) => {
  const { showToast } = useToastContext();
  const { user } = useUser();
  const localDate = new Date((defaultDate || new Date()) + "T00:00");
  const [form, setForm] = React.useState({
    ...initialValues,
    fecha: localDate,
  });

  const [clients, setClients] = React.useState<Cliente[]>([]);
  const [products, setProducts] = React.useState<Producto[]>([]);
  const [loadingClients, setLoadingClients] = React.useState(false);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [loadingInfoLines, setLoadingInfoLines] = React.useState(false);
  const [loadingCreate, setLoadingCreate] = React.useState(false);
  const [selectedProductsIds, setSelectedProductsIds] = React.useState<
    string[]
  >([]);
  const [loadingNextDateAvailable, setLoadingNextDateAvailable] =
    React.useState(false);
  const [prodCant, setProdCant] = React.useState<prodItems[]>([]);
  const [isDirty, setIsDirty] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<any>({});
  const [infoLines, setInfoLines] = React.useState<InfoLineDTO[]>([]);
  const hasErrors = Object.keys(errors).length > 0;

  const handleChangeValue = (key: string, value: any) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  React.useEffect(() => {
    getAllOrderDate();
  }, []);

  const getAllOrderDate = async () => {
    setLoadingInfoLines(true);
    try {
      const data = await api.dataOrder.getAll();

      setInfoLines(
        data?.filter((infoline: InfoLineDTO) => {
          if (infoline.id_tipo_servicio === user.tipo_servicio) {
            return true;
          } else {
            return false;
          }
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingInfoLines(false);
    }
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

  React.useEffect(() => {
    handleChangeValue(
      "fecha",
      new Date(defaultDate).setHours(getHourNumber(user?.hora_apertura))
    );
  }, []);

  React.useEffect(() => {
    if (hasErrors) {
      handleValidateForm();
    }
  }, [hasErrors, form]);

  const handleValidateForm = (): boolean => {
    let errors: any = {};
    if (selectedProductsIds?.length <= 0) {
      errors["products"] = "Debes agregar al menos un producto";
    }
    if (tipoServicio === TipoServicio.RESERVA && !form.fecha) {
      errors["date"] = "Debes agregar al menos un producto";
    }
    infoLines.forEach((infoline) => {
      if (infoline) {
        if (infoline?.requerido && !form.infoLinesJson[infoline.nombre]) {
          errors[infoline.nombre] = `El campo ${infoline.nombre} es requerido`;
        }
      }
    });

    setErrors(errors);
    return Object.keys(errors)?.length === 0;
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
    setIsDirty(true);
    let isValidForm = handleValidateForm();
    if (!isValidForm) {
      return;
    }

    try {
      setLoadingCreate(true);
      const dataToSend = {
        ...form,
        tipoServicio: tipoServicio,
        confirmado: true,
        empresaType: EmpresaTypeStr[tipoServicio],
        messages: [],
        products: selectedProductsIds.map((prod) => {
          const productSend = prodCant.find(
            (product) => product.prodId === parseInt(prod)
          );
          return {
            productoId: prod,
            cantidad: productSend?.cantidad,
          };
        }),
        clienteId: form?.clienteId,
        infoLinesJson: JSON.stringify(form.infoLinesJson),
        estadoId: DEFAULT_ESTADO_CREADO.id,
        fecha: removeTimeZone(form?.fecha),
      };
      const data = await api.order.create(dataToSend);

      if (data?.ok) {
        showToast({
          title: "¡Evento creado!",
          description: "Su evento fue agregado al calendario exitosamente.",
          status: "success",
        });
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        throw new Error("Error desconocido creando event");
      }
    } catch (error: any) {
      setLoadingCreate(false);

      showToast({
        title: "Error creando evento",
        description: error?.message,
        status: "error",
      });
    }
  };

  const handleLoadNextAvaialbleDate = async () => {
    try {
      setLoadingNextDateAvailable(true);
      const resp = await api.order.getNextDateAvailable();
      if (resp) {
        handleChangeValue("fecha", moment(resp).add("hours", 3));
      }
    } catch (error) {
      console.log("error", error);
      setLoadingNextDateAvailable(false);
    } finally {
      setLoadingNextDateAvailable(false);
    }
  };

  const addClient = async (newClient: { nombre: string; telefono: string }) => {
    try {
      const data = await api.client.create({
        ...newClient,
        empresaId: user.id_empresa,
      });

      if (data?.clientName) {
        showToast({
          title: "Error creando Cliente",
          description: "Ya existe un cliente con este numero.",
          status: "error",
        });
      } else {
        showToast({
          title: "Cliente creado Exitosamente",
          status: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addCantForProduct = (productId: number, key: "more" | "less") => {
    const newState = prodCant.map((item) => {
      if (item.prodId === productId) {
        return {
          ...item,
          cantidad:
            key === "less"
              ? item.cantidad - 1 === 0
                ? 1
                : item.cantidad - 1
              : item.cantidad + 1,
        };
      } else {
        return item;
      }
    });

    setProdCant(newState);
  };

  const handleProductSelection = (value: string, isSelected: boolean) => {
    if (isSelected) {
      setProdCant((prev: any) => {
        const productExists = prev.some(
          (item: any) => item.prodId === parseInt(value)
        );
        if (!productExists) {
          return [...prev, { prodId: parseInt(value), cantidad: 1 }];
        }
        return prev;
      });
    } else {
      setProdCant((prev: any) =>
        prev.filter((item: any) => item.prodId !== parseInt(value))
      );
    }
  };

  const searchCant = (idProd: number) => {
    const prod = prodCant.find((producto) => producto.prodId === idProd);
    return prod?.cantidad;
  };

  return (
    <GlobalModal
      label={`Agregar ${tipoServicio === ID_TIPOSERVICIO_RESERVA ? "nuevo Evento" : "nueva Orden"}`}
      isVisible={true}
      onClose={onClose}
      actions={[
        <Button
          onPress={() => onClose()}
          size="sm"
          variant={"ghost"}
          borderRadius={"6"}
          fontWeight={"bold"}
        >
          <Text fontWeight={500} color={"#2C2C2C"}>
            Cancelar
          </Text>
        </Button>,
        <Button
          isLoading={loadingCreate || loadingNextDateAvailable}
          onPress={() => createOrderData()}
          size="sm"
          backgroundColor={"#2C2C2C"}
          borderRadius={"6"}
          fontWeight={700}
        >
          <Text fontWeight={500} color={"white"}>
            Crear{" "}
            {tipoServicio === ID_TIPOSERVICIO_RESERVA ? "Evento" : "Orden"}
          </Text>
        </Button>,
      ]}
      content={
        <>
          {tipoServicio === ID_TIPOSERVICIO_RESERVA && (
            <>
              <TimePicker
                type="time"
                interval={user?.intervaloTiempoCalendario ?? 30}
                startHour={getHourNumber(user?.hora_apertura)}
                endHour={getHourNumber(user?.hora_cierre)}
                error={errors["fecha"]}
                occupiedTimes={
                  currentOrders
                    ? filterOnlyHours(
                        currentOrders?.map((order) =>
                          removeAmPm(order?.date ?? "")
                        )
                      )
                    : []
                }
                date={form.fecha || localDate}
                setDate={(val: any) => handleChangeValue("fecha", val)}
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
                  size={20}
                />
                <TouchableOpacity onPress={() => handleLoadNextAvaialbleDate()}>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      fontSize: 14,
                      cursor: "pointer",
                      marginBottom: 0,
                      color: Colors.light.primary,
                    }}
                  >
                    Mostrar siguiente horario disponible
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <MultiSelectInput
            isRequired
            error={errors["products"]}
            setItemsSelected={setSelectedProductsIds}
            handleProductSelection={handleProductSelection}
            isMultiple
            placeholder="Seleccionar productos"
            label="Productos"
            loading={loadingProducts}
            options={products?.map((prod) => {
              const cantidad = searchCant(prod.id);
              return {
                label: (
                  <View
                    key={prod.id}
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    height={"100%"}
                    position={"relative"}
                    width={"100%"}
                    style={{ gap: 5, paddingBottom: 10 }}
                  >
                    <View
                      width={"70%"}
                      display={"flex"}
                      flexDir={"row"}
                      alignItems={"center"}
                      style={{ gap: 5 }}
                    >
                      <View
                        width={36}
                        height={36}
                        borderRadius={6}
                        backgroundColor={"gray.400"}
                      />
                      <View
                        display={"flex"}
                        flexDirection={"column"}
                        style={{ gap: 0 }}
                        justifyContent={"start"}
                        flexShrink={1}
                      >
                        <Text
                          maxW="100%"
                          color={"gray.800"}
                          fontSize={16}
                          fontWeight={"medium"}
                        >
                          {prod?.nombre ?? ""}
                          {cantidad && " x" + cantidad}
                        </Text>
                        <Text
                          isTruncated={false}
                          numberOfLines={2}
                          flexWrap="wrap"
                          maxW={150}
                          fontSize={12}
                          lineHeight={15}
                          color={"gray.600"}
                        >
                          {prod?.descripcion ?? ""}
                        </Text>
                      </View>
                    </View>
                    <View
                      width={"30%"}
                      display={"flex"}
                      flexDir={"row"}
                      alignItems={"center"}
                    >
                      <View>
                        <Text
                          marginRight={1}
                          fontWeight={"semibold"}
                          color={"yellow.800"}
                        >
                          ${prod?.precio}
                        </Text>
                      </View>
                      <View
                        flexDir={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <IconButton
                          onPress={() => addCantForProduct(prod?.id, "more")}
                          icon={<SimpleLineIcons size={12} name="arrow-up" />}
                        />
                        <IconButton
                          onPress={() => addCantForProduct(prod?.id, "less")}
                          icon={<SimpleLineIcons size={12} name="arrow-down" />}
                        />
                      </View>
                    </View>
                  </View>
                ),
                placeholder: prod?.nombre,
                value: prod?.id ?? "",
                subText: ` (x${prodCant.find((producto) => producto.prodId === prod?.id)?.cantidad})`,
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
            actionToAddItem={(data: any) => addClient(data)}
            setItemsSelected={(data: string[]) => {
              const clientId = data[0] as any;
              const clientInfo = clients?.find((c) => c.id === clientId);

              handleChangeValue("clienteId", clientId);
              handleChangeValue("clientName", clientInfo?.nombre ?? "");
            }}
            initialStateAdd={[
              {
                name: "nombre",
                type: "text",
              },
              {
                name: "telefono",
                type: "numeric",
              },
            ]}
            isMultiple={false}
            onSearch={(query: string) => {
              handleFindClients(query);
            }}
            loading={loadingClients}
            placeholder="Seleccionar cliente"
            label="Cliente"
            options={clients?.map((client) => {
              return {
                label: (
                  <View
                    key={client.id}
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
          <InfoLineForm
            errors={errors}
            infoLines={infoLines}
            value={form.infoLinesJson ?? {}}
            setValue={(val) => handleChangeValue("infoLinesJson", val)}
          />
        </>
      }
    />
  );
};

export default CreateOrderModal;
