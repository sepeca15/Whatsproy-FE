import * as React from "react";
import { TouchableOpacity } from "react-native";
import {
  Button,
  View,
  Text,
  IconButton,
  Center,
  HStack,
  Alert,
} from "native-base";
import InputField from "@/components/InputField";
import { useUser } from "@/hooks/redux/useUser";
import api from "@/services/api/admin";
import { TipoServicio } from "../enums/TipoServicio";
import MultiSelectInput from "@/components/MultiSelectInput";
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
  InfoLineDTO,
} from "@/services/api/dateOrder/dataOrder.type";
import { DEFAULT_ESTADO_CREADO } from "@/services/api/estado/estado.type";
import GlobalModal from "./Modal";
import { useToastContext } from "@/contexts/ToastContext";
import {
  filterOnlyHours,
  getHourNumber,
  removeAmPm,
} from "@/utils/date";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import TimePicker from "./TimePicker";
import { useIntl } from "react-intl";
import { useHomeData } from "@/hooks/redux/useHomeData";
import CustomButton from "./CustomButton";

interface IProps {
  onClose: () => void;
  defaultDate?: any;
  tipoServicio: TipoServicioType;
  onSuccess?: () => void;
  selectedWorkerId?: any;
  currentOrders?: any[];
  availableDates?: string[];
  horarios?: any[];
}

const initialValues: CreateOrderDTO = {
  confirmado: true,
  estadoId: OrderEstadoDefault.CREADO,
  clientName: "",
  clienteId: 0,
  products: [],
  numberSender: 0,
  empresaType: "",
  messages: [],
  detalles: "",
  infoLinesJson: {},
  fecha: undefined,
};

interface prodItems {
  prodId: number;
  cantidad: number;
}

const CreateOrderModal = ({
  onClose,
  selectedWorkerId,
  defaultDate,
  tipoServicio,
  onSuccess,
  currentOrders,
  horarios,
  availableDates = [],
}: IProps) => {
  const { showToast } = useToastContext();
  const { user } = useUser();
  const { handleAddNewOrder } = useHomeData()
  const intl = useIntl();
  const [form, setForm] = React.useState({
    ...initialValues,
  });

  const [clients, setClients] = React.useState<Cliente[]>([]);
  const [products, setProducts] = React.useState<Producto[]>([]);
  const [loadingClients, setLoadingClients] = React.useState(false);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
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
  const [allOcupped, setAllOcupped] = React.useState(false);

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
          .map((infoline: InfoLineDTO) => {
            if (infoline.nombre === "Fecha y Hora" && tipoServicio === TipoServicio.RESERVA) {
              return {
                ...infoline,
                show: false,
              }
            }
            return {
              ...infoline,
              show: true,
            }

          })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleFindClients = async (query: string) => {
    try {
      setLoadingClients(true);
      const resp = await findClientsWithQuery(query, user?.id_empresa);
      console.log('la ressp de clients es', resp);
      
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
    if (defaultDate) {
      handleLoadNextAvaialbleDateForSignleDay();
    }
  }, [defaultDate]);

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
    if (tipoServicio === TipoServicio.RESERVA && !defaultDate) {
      errors["date"] = "Debes agregar al menos un producto";
    }
    infoLines.filter((itm) => itm?.show).forEach((infoline) => {
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
    try {
      setLoadingCreate(true);
      setIsDirty(true);
      let isValidForm = handleValidateForm();
      if (!isValidForm) {
        return;
      }

      let dataToSend: any = {
        ...form,
        tipoServicio: tipoServicio,
        confirmado: true,
        empresaType: EmpresaTypeStr[tipoServicio],
        products: selectedProductsIds.map((prod) => {
          const productSend = prodCant.find(
            (product) => product.prodId === parseInt(prod)
          );
          return {
            productoId: prod,
            cantidad: productSend?.cantidad,
          };
        }),
        withIA: false,
        clienteId: form?.clienteId,
        clientName: form?.clientName,
        numberSender: form?.numberSender,
        infoLinesJson: JSON.stringify(form.infoLinesJson),
        estadoId: DEFAULT_ESTADO_CREADO.id,
        fecha: form.fecha ? moment(form?.fecha).format("YYYY-MM-DD HH:mm") : moment(),
      };

      if (tipoServicio === TipoServicio.RESERVA) {
        dataToSend.userId = selectedWorkerId;
        let infoLines = JSON.parse(dataToSend.infoLinesJson);
        const fechaMoment = moment.tz(infoLines["Fecha y Hora"], user.timeZone);
        infoLines["Fecha y Hora"] = fechaMoment.format("YYYY-MM-DD HH:mm")
        dataToSend.infoLinesJson = JSON.stringify(infoLines);
      }

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
        description: error?.message?.data?.message ?? error?.message ?? "Error desconocido creando cuenta",
        status: "error",
      });
    } finally {
      setLoadingCreate(false)
    }
  };

  const handleLoadNextAvaialbleDateForSignleDay = async () => {
    try {
      setLoadingNextDateAvailable(true);
      const availableDates = await api.order.getNextDateAvailableForSingleDay(moment(defaultDate)?.format("YYYY-MM-DD"), selectedWorkerId);
      if (availableDates && availableDates?.length > 0) {
        handleChangeValue("fecha", moment(availableDates[0]));
      } else {
        showToast({
          title: intl.formatMessage({ id: "dispErrorTitle" }),
          description: intl.formatMessage({ id: "dispErrorDesc" }),
          status: "error",
        });
        setAllOcupped(true);
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
      label={`${intl.formatMessage({ id: "add" })} ${tipoServicio === ID_TIPOSERVICIO_RESERVA ? intl.formatMessage({ id: "newReserva" }) : intl.formatMessage({ id: "newOrder" })}`}
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
            {intl.formatMessage({ id: "cancel" })}
          </Text>
        </Button>,
        <CustomButton
          isLoading={loadingCreate || loadingNextDateAvailable}
          onPress={() => createOrderData()}
          size="sm"
          isDisabled={allOcupped}
          marginLeft={2}
          backgroundColor={"#2C2C2C"}
          borderRadius={"6"}
          fontWeight={700}
        >
          <Text fontWeight={500} color={"white"}>
            {intl.formatMessage({ id: "modalCreate" })}{" "}
            {tipoServicio === ID_TIPOSERVICIO_RESERVA
              ? intl.formatMessage({ id: "createEvent" })
              : intl.formatMessage({ id: "order" })}
          </Text>
        </CustomButton>,
      ]}
      content={
        <>
          {!allOcupped && <Center mb={4}>
            <HStack space={2} alignItems="center">
              <Ionicons name="calendar-outline" size={20} color={Colors.light.primary} />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                {intl.formatMessage({ id: "reservation.addTo" })}{" "}
                <Text color={Colors.light.primary}>
                  {moment(defaultDate).format("dddd, DD MMMM YYYY")}
                </Text>
              </Text>
            </HStack>
          </Center>}
          {allOcupped && (
            <Alert status="warning" variant="left-accent" borderRadius="md" mb={4}>
              <HStack space={2} alignItems="center">
                <Alert.Icon />
                <Text fontSize="sm" color="gray.800">
                  {intl.formatMessage({ id: "allTimesOccupied", defaultMessage: "No hay horarios disponibles para esta fecha." })}
                </Text>
              </HStack>
            </Alert>
          )}
          {tipoServicio === ID_TIPOSERVICIO_RESERVA && (
            <>
              <TimePicker
                setAllOcupped={setAllOcupped}
                type="time"
                horario={horarios}
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
                checkAvailable={(hour: string) => availableDates.includes(hour)}
                date={form?.fecha}
                setDate={(val: any) => {
                  handleChangeValue("fecha", val)

                }}
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
                <TouchableOpacity onPress={() => handleLoadNextAvaialbleDateForSignleDay()}>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      fontSize: 14,
                      cursor: "pointer",
                      marginBottom: 0,
                      color: Colors.light.primary,
                    }}
                  >
                    {intl.formatMessage({ id: "nextDateAvailable" })}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <MultiSelectInput
            isRequired
            error={errors["products"]}
            withAdd={false}
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
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    style={{ paddingBottom: 10, paddingRight: 4 }}
                  >
                    <View
                      style={{ gap: 5 }}
                      flexDirection="row"
                      alignItems="center"
                      flex={1}
                      minWidth={0}
                    >
                      <View
                        width={36}
                        height={36}
                        borderRadius={6}
                        backgroundColor="gray.400"
                      />
                      <View
                        flexDirection="column"
                        justifyContent="flex-start"
                        flex={1}
                        minWidth={0}
                      >
                        <Text
                          color="gray.800"
                          fontSize={16}
                          fontWeight="medium"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {prod?.nombre ?? ""}
                          {cantidad && " x" + cantidad}
                        </Text>
                        <Text
                          fontSize={12}
                          color="gray.600"
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {prod?.descripcion ?? ""}
                        </Text>
                      </View>
                    </View>

                    <View
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      paddingLeft={5}
                    >
                      <Text
                        marginRight={2}
                        fontWeight="semibold"
                        color="yellow.800"
                        fontSize={14}
                      >
                        ${prod?.precio}
                      </Text>

                      {selectedProductsIds.includes(`${prod?.id ?? ""}`) && (
                        <View
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          borderWidth={1}
                          borderColor="gray.300"
                          borderRadius={8}
                          padding={1}
                          marginLeft={2}
                        >
                          <IconButton
                            onPress={() => addCantForProduct(prod?.id, "more")}
                            icon={<SimpleLineIcons size={14} name="arrow-up" />}
                            _icon={{ color: "green.600" }}
                            size="sm"
                            variant="ghost"
                          />
                          <IconButton
                            onPress={() => addCantForProduct(prod?.id, "less")}
                            icon={
                              <SimpleLineIcons size={14} name="arrow-down" />
                            }
                            _icon={{ color: "red.600" }}
                            size="sm"
                            variant="ghost"
                          />
                        </View>
                      )}
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
              const clientId = parseInt(data[0]) as any;
              const clientInfo = clients?.find((c) => c.id === clientId);

              handleChangeValue("clienteId", clientId);
              handleChangeValue("clientName", clientInfo?.nombre ?? "");
              handleChangeValue("numberSender", clientInfo?.telefono ?? "");
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
            infoLines={infoLines.filter((itm) => itm?.show)}
            value={form.infoLinesJson ?? {}}
            setValue={(val) => handleChangeValue("infoLinesJson", val)}
          />
        </>
      }
    />
  );
};

export default CreateOrderModal;
