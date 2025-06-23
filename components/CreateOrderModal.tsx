"use client";

import * as React from "react";
import { TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Text,
  IconButton,
  HStack,
  Avatar,
  VStack,
  Box,
  Divider,
  Badge,
  View,
} from "native-base";
import InputField from "@/components/InputField";
import { useUser } from "@/hooks/redux/useUser";
import api from "@/services/api/admin";
import { TipoServicio } from "../enums/TipoServicio";
import MultiSelectInput from "@/components/MultiSelectInput";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import type { Cliente } from "@/services/api/clients/cliente.types";
import type { Producto } from "@/services/api/products/product.types";
import { findClientsWithQuery } from "@/services/api/clients/clients";
import { findProductsWithQuery } from "@/services/api/products/products";
import moment from "moment";
import {
  type CreateOrderDTO,
  OrderEstadoDefault,
} from "@/services/api/order/order.type";
import InfoLineForm from "@/components/InfoLineForm";
import {
  EmpresaTypeStr,
  ID_TIPOSERVICIO_RESERVA,
  type TipoServicioType,
} from "@/services/api/tiposervicio/tiposervicio.type";
import type { InfoLineDTO } from "@/services/api/dateOrder/dataOrder.type";
import { DEFAULT_ESTADO_CREADO } from "@/services/api/estado/estado.type";
import { useToastContext } from "@/contexts/ToastContext";
import { filterOnlyHours, getHourNumber, removeAmPm } from "@/utils/date";
import TimePicker from "./TimePicker";
import { useIntl, FormattedMessage } from "react-intl";
import { useHomeData } from "@/hooks/redux/useHomeData";
import CustomButton from "./CustomButton";
import GenericModal from "./Views/ConfigAccount/components/GenericModal/GenericModal";

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
  const { handleAddNewOrder } = useHomeData();
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
        data
          ?.filter((infoline: InfoLineDTO) => {
            if (infoline.id_tipo_servicio === user.tipo_servicio) {
              return true;
            } else {
              return false;
            }
          })
          .map((infoline: InfoLineDTO) => {
            if (
              infoline.nombre === "Fecha y Hora" &&
              tipoServicio === TipoServicio.RESERVA
            ) {
              return {
                ...infoline,
                show: false,
              };
            }
            return {
              ...infoline,
              show: true,
            };
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
      if (resp) {
        setClients(resp);
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
    const errors: any = {};
    if (selectedProductsIds?.length <= 0) {
      errors["products"] = intl.formatMessage({
        id: "createOrder.validation.productsRequired",
        defaultMessage: "Debes agregar al menos un producto",
      });
    }
    if (tipoServicio === TipoServicio.RESERVA && !defaultDate) {
      errors["date"] = intl.formatMessage({
        id: "createOrder.validation.dateRequired",
        defaultMessage: "Debes seleccionar una fecha",
      });
    }
    infoLines
      .filter((itm) => itm?.show)
      .forEach((infoline) => {
        if (infoline) {
          if (infoline?.requerido && !form.infoLinesJson[infoline.nombre]) {
            errors[infoline.nombre] = intl.formatMessage(
              {
                id: "createOrder.validation.fieldRequired",
                defaultMessage: "El campo {field} es requerido",
              },
              { field: infoline.nombre }
            );
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
      const isValidForm = handleValidateForm();
      if (!isValidForm) {
        return;
      }

      const dataToSend: any = {
        ...form,
        tipoServicio: tipoServicio,
        confirmado: true,
        empresaType: EmpresaTypeStr[tipoServicio],
        products: selectedProductsIds.map((prod) => {
          const productSend = prodCant.find(
            (product) => product.prodId === Number.parseInt(prod)
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
        fecha: form.fecha
          ? moment(form?.fecha).format("YYYY-MM-DD HH:mm")
          : moment(),
      };

      if (tipoServicio === TipoServicio.RESERVA) {
        dataToSend.userId = selectedWorkerId;
        const infoLines = JSON.parse(dataToSend.infoLinesJson);
        const fechaMoment = moment.tz(infoLines["Fecha y Hora"], user.timeZone);
        infoLines["Fecha y Hora"] = fechaMoment.format("YYYY-MM-DD HH:mm");
        dataToSend.infoLinesJson = JSON.stringify(infoLines);
      }

      const data = await api.order.create(dataToSend);

      if (data?.ok) {
        showToast({
          title: intl.formatMessage({
            id: "createOrder.success.title",
            defaultMessage: "¡Evento creado!",
          }),
          description: intl.formatMessage({
            id: "createOrder.success.description",
            defaultMessage:
              "Su evento fue agregado al calendario exitosamente.",
          }),
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
        title: intl.formatMessage({
          id: "createOrder.error.title",
          defaultMessage: "Error creando evento",
        }),
        description:
          error?.message?.data?.message ??
          error?.message ??
          intl.formatMessage({
            id: "createOrder.error.unknown",
            defaultMessage: "Error desconocido creando evento",
          }),
        status: "error",
      });
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleLoadNextAvaialbleDateForSignleDay = async () => {
    try {
      setLoadingNextDateAvailable(true);
      const availableDates = await api.order.getNextDateAvailableForSingleDay(
        moment(defaultDate)?.format("YYYY-MM-DD"),
        selectedWorkerId
      );
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
          title: intl.formatMessage({
            id: "createOrder.client.error.title",
            defaultMessage: "Error creando Cliente",
          }),
          description: intl.formatMessage({
            id: "createOrder.client.error.exists",
            defaultMessage: "Ya existe un cliente con este numero.",
          }),
          status: "error",
        });
      } else {
        showToast({
          title: intl.formatMessage({
            id: "createOrder.client.success",
            defaultMessage: "Cliente creado Exitosamente",
          }),
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
          (item: any) => item.prodId === Number.parseInt(value)
        );
        if (!productExists) {
          return [...prev, { prodId: Number.parseInt(value), cantidad: 1 }];
        }
        return prev;
      });
    } else {
      setProdCant((prev: any) =>
        prev.filter((item: any) => item.prodId !== Number.parseInt(value))
      );
    }
  };

  const searchCant = (idProd: number) => {
    const prod = prodCant.find((producto) => producto.prodId === idProd);
    return prod?.cantidad;
  };

  const getTotalAmount = () => {
    return selectedProductsIds.reduce((total, prodId) => {
      const product = products.find((p) => p.id === Number.parseInt(prodId));
      const quantity = searchCant(Number.parseInt(prodId)) || 1;
      return total + (product?.precio || 0) * quantity;
    }, 0);
  };

  const renderDateHeader = () => {
    if (allOcupped) {
      return (
        <Box style={styles.warningHeader}>
          <HStack space={3} alignItems="center">
            <Box style={[styles.iconContainer, { backgroundColor: "#FEE2E2" }]}>
              <MaterialIcons name="event-busy" size={24} color="#DC2626" />
            </Box>
            <VStack flex={1}>
              <Text fontSize="md" fontWeight="600" color="red.700">
                <FormattedMessage
                  id="createOrder.noAvailableTimes.title"
                  defaultMessage="No hay horarios disponibles"
                />
              </Text>
              <Text fontSize="sm" color="red.600">
                <FormattedMessage
                  id="createOrder.noAvailableTimes.subtitle"
                  defaultMessage="Intenta seleccionar otra fecha"
                />
              </Text>
            </VStack>
          </HStack>
        </Box>
      );
    }

    return (
      <Box style={styles.dateHeader}>
        <HStack space={3} alignItems="center">
          <Box style={[styles.iconContainer, { backgroundColor: "#DBEAFE" }]}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color={Colors.light.primary}
            />
          </Box>
          <VStack flex={1}>
            <Text fontSize="md" fontWeight="600" color="gray.800">
              <FormattedMessage
                id="createOrder.addToDate"
                defaultMessage="Agregar a la fecha"
              />
            </Text>
            <Text fontSize="lg" fontWeight="700" color={Colors.light.primary}>
              {moment(defaultDate).format("dddd, DD MMMM YYYY")}
            </Text>
          </VStack>
        </HStack>
      </Box>
    );
  };

  const renderProductCard = (prod: Producto) => {
    const cantidad = searchCant(prod.id);
    const isSelected = selectedProductsIds.includes(`${prod.id}`);

    return (
      <Box
        key={prod.id}
        style={[styles.productCard, isSelected && styles.selectedProductCard]}
      >
        <HStack space={3} alignItems="center">
          <Avatar
            size="md"
            source={{ uri: prod?.imagen || undefined }}
            bg={Colors.light.primary}
            _text={{ color: "white", fontWeight: "bold" }}
          >
            {prod.nombre?.charAt(0).toUpperCase()}
          </Avatar>

          <VStack flex={1} space={1}>
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack flex={1} flexDir={"column"} space={1}>
                <Text
                  fontSize="md"
                  fontWeight="600"
                  color="gray.800"
                  numberOfLines={1}
                >
                  {prod.nombre}
                </Text>
                <Text fontSize="sm" color="gray.600" numberOfLines={2}>
                  {prod.descripcion}
                </Text>
              </VStack>

              <VStack alignItems="flex-end" space={2}>
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color={Colors.light.secondary}
                >
                  ${prod.precio}
                </Text>

                {isSelected && (
                  <HStack space={1} alignItems="center">
                    <IconButton
                      onPress={() => addCantForProduct(prod.id, "less")}
                      icon={<Feather name="minus" size={16} />}
                      bg="red.100"
                      _icon={{ color: "red.600" }}
                      size="sm"
                      borderRadius="full"
                    />
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      minW="8"
                      textAlign="center"
                    >
                      {cantidad}
                    </Text>
                    <IconButton
                      onPress={() => addCantForProduct(prod.id, "more")}
                      icon={<Feather name="plus" size={16} />}
                      bg="green.100"
                      _icon={{ color: "green.600" }}
                      size="sm"
                      borderRadius="full"
                    />
                  </HStack>
                )}
              </VStack>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    );
  };

  const renderClientCard = (client: Cliente) => (
    <Box key={client.id} style={styles.clientCard}>
      <HStack space={3} alignItems="center">
        <Box
          style={[
            styles.iconContainer,
            { backgroundColor: Colors.light.primary },
          ]}
        >
          <Ionicons name="person" size={24} color="white" />
        </Box>
        <VStack flex={1} space={1}>
          <Text fontSize="md" fontWeight="600" color="gray.800">
            {client.nombre}
          </Text>
          <HStack space={2} alignItems="center">
            <Feather name="phone" size={14} color={Colors.light.icon} />
            <Text fontSize="sm" color="gray.600">
              {client.telefono}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );

  const renderOrderSummary = () => {
    if (selectedProductsIds.length === 0) return null;

    return (
      <Box style={styles.summaryCard}>
        <HStack justifyContent="space-between" alignItems="center" mb="3">
          <Text fontSize="lg" fontWeight="600" color="gray.800">
            {tipoServicio === ID_TIPOSERVICIO_RESERVA ? <FormattedMessage
              id="createOrder.orderSummaryReserva"
              defaultMessage="Resumen de la reserva"
            /> : <FormattedMessage
              id="createOrder.orderSummary"
              defaultMessage="Resumen del pedido"
            />}
          </Text>
          <Badge colorScheme="primary" variant="solid" borderRadius="full">
            <FormattedMessage
              id="createOrder.productsCount"
              defaultMessage="{count} productos"
              values={{ count: selectedProductsIds.length }}
            />
          </Badge>
        </HStack>

        <VStack space={2}>
          {selectedProductsIds.map((prodId) => {
            const product = products.find(
              (p) => p.id === Number.parseInt(prodId)
            );
            const quantity = searchCant(Number.parseInt(prodId)) || 1;
            if (!product) return null;

            return (
              <HStack
                key={prodId}
                justifyContent="space-between"
                alignItems="center"
              >
                <HStack space={2} flex={1}>
                  <Text fontSize="sm" color="gray.600">
                    {quantity}x
                  </Text>
                  <Text
                    fontSize="sm"
                    color="gray.800"
                    flex={1}
                    numberOfLines={1}
                  >
                    {product.nombre}
                  </Text>
                </HStack>
                <Text fontSize="sm" fontWeight="600" color="gray.800">
                  ${(product.precio * quantity).toFixed(2)}
                </Text>
              </HStack>
            );
          })}

          <Divider my="2" />

          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="md" fontWeight="600" color="gray.800">
              <FormattedMessage id="createOrder.total" defaultMessage="Total" />
            </Text>
            <Text fontSize="lg" fontWeight="700" color={Colors.light.primary}>
              ${getTotalAmount().toFixed(2)}
            </Text>
          </HStack>
        </VStack>
      </Box>
    );
  };

  const modalTitle = intl.formatMessage(
    {
      id:
        tipoServicio === ID_TIPOSERVICIO_RESERVA
          ? "createOrder.newReservation"
          : "createOrder.newOrder",
      defaultMessage:
        tipoServicio === ID_TIPOSERVICIO_RESERVA
          ? "Nueva Reserva"
          : "Nuevo Pedido",
    },
    {}
  );

  return (
    <GenericModal visible={true} onClose={onClose} title={modalTitle}>
      <View style={styles.modalContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <VStack space={6}>
            {renderDateHeader()}

            {tipoServicio === ID_TIPOSERVICIO_RESERVA && (
              <Box style={styles.sectionCard}>
                <HStack space={2} alignItems="center" mb="4">
                  <Feather
                    name="clock"
                    size={20}
                    color={Colors.light.primary}
                  />
                  <Text fontSize="lg" fontWeight="600" color="gray.800">
                    <FormattedMessage
                      id="createOrder.selectTime"
                      defaultMessage="Seleccionar horario"
                    />
                  </Text>
                </HStack>

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
                  checkAvailable={(hour: string) =>
                    availableDates.includes(hour)
                  }
                  date={form?.fecha}
                  setDate={(val: any) => {
                    handleChangeValue("fecha", val);
                  }}
                />

                <TouchableOpacity
                  onPress={() => handleLoadNextAvaialbleDateForSignleDay()}
                  style={styles.nextDateButton}
                >
                  <HStack space={2} alignItems="center" justifyContent="center">
                    <Ionicons
                      color={Colors.light.primary}
                      name="sparkles-outline"
                      size={20}
                    />
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color={Colors.light.primary}
                    >
                      <FormattedMessage
                        id="createOrder.nextAvailableDate"
                        defaultMessage="Próxima fecha disponible"
                      />
                    </Text>
                  </HStack>
                </TouchableOpacity>
              </Box>
            )}

            <Box style={styles.sectionCard}>
              <HStack space={2} alignItems="center" mb="4">
                <Feather
                  name="package"
                  size={20}
                  color={Colors.light.primary}
                />
                <Text fontSize="lg" fontWeight="600" color="gray.800">
                  <FormattedMessage
                    id="createOrder.products"
                    defaultMessage="Productos"
                  />
                </Text>
                {errors["products"] && (
                  <Badge colorScheme="red" variant="solid" borderRadius="full">
                    <FormattedMessage
                      id="createOrder.required"
                      defaultMessage="Requerido"
                    />
                  </Badge>
                )}
              </HStack>

              <MultiSelectInput
                isRequired
                error={errors["products"]}
                withAdd={false}
                setItemsSelected={setSelectedProductsIds}
                handleProductSelection={handleProductSelection}
                isMultiple
                placeholder={intl.formatMessage({
                  id: "createOrder.searchProducts",
                  defaultMessage: "Buscar productos...",
                })}
                label={intl.formatMessage({
                  id: "createOrder.products",
                  defaultMessage: "Productos",
                })}
                loading={loadingProducts}
                options={products?.map((prod) => ({
                  label: renderProductCard(prod),
                  placeholder: prod?.nombre,
                  value: prod?.id ?? "",
                  subText: ` (x${prodCant.find((producto) => producto.prodId === prod?.id)?.cantidad || 1})`,
                }))}
                onSearch={(query: string) => {
                  handleFindProducts(query);
                }}
              />
            </Box>

            {renderOrderSummary()}

            <Box style={styles.sectionCard}>
              <HStack space={2} alignItems="center" mb="4">
                <Feather name="user" size={20} color={Colors.light.primary} />
                <Text fontSize="lg" fontWeight="600" color="gray.800">
                  <FormattedMessage
                    id="createOrder.client"
                    defaultMessage="Cliente"
                  />
                </Text>
              </HStack>

              <MultiSelectInput
                actionToAddItem={(data: any) => addClient(data)}
                setItemsSelected={(data: string[]) => {
                  const clientId = Number.parseInt(data[0]) as any;
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
                placeholder={intl.formatMessage({
                  id: "createOrder.searchClient",
                  defaultMessage: "Buscar cliente...",
                })}
                label={intl.formatMessage({
                  id: "createOrder.client",
                  defaultMessage: "Cliente",
                })}
                options={clients?.map((client) => ({
                  label: renderClientCard(client),
                  placeholder: client?.nombre,
                  value: client?.id ?? "",
                }))}
              />
            </Box>

            <Box style={styles.sectionCard}>
              <HStack space={2} alignItems="center" mb="4">
                <Feather
                  name="file-text"
                  size={20}
                  color={Colors.light.primary}
                />
                <Text fontSize="lg" fontWeight="600" color="gray.800">
                  <FormattedMessage
                    id="createOrder.additionalDetails"
                    defaultMessage="Detalles adicionales"
                  />
                </Text>
              </HStack>

              <InputField
                isRequired={false}
                isTextArea
                value={form.detalles}
                onChangeText={(text) => handleChangeValue("detalles", text)}
                placeholder={intl.formatMessage({
                  id: "createOrder.detailsPlaceholder",
                  defaultMessage: "Agregar detalles del pedido...",
                })}
                style={styles.textAreaInput}
              />
            </Box>

            {infoLines.filter((itm) => itm?.show).length > 0 && (
              <Box style={styles.sectionCard}>
                <HStack space={2} alignItems="center" mb="4">
                  <Feather name="info" size={20} color={Colors.light.primary} />
                  <Text fontSize="lg" fontWeight="600" color="gray.800">
                    <FormattedMessage
                      id="createOrder.additionalInfo"
                      defaultMessage="Información adicional"
                    />
                  </Text>
                </HStack>

                <InfoLineForm
                  errors={errors}
                  infoLines={infoLines.filter((itm) => itm?.show)}
                  value={form.infoLinesJson ?? {}}
                  setValue={(val) => handleChangeValue("infoLinesJson", val)}
                />
              </Box>
            )}
          </VStack>
        </ScrollView>

        <Box style={styles.actionButtonsContainer}>
          <HStack space={3} justifyContent="flex-end">
            <Button onPress={() => onClose()} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>
                <FormattedMessage
                  id="createOrder.cancel"
                  defaultMessage="Cancelar"
                />
              </Text>
            </Button>

            <CustomButton
              isLoading={loadingCreate || loadingNextDateAvailable}
              onPress={() => createOrderData()}
              isDisabled={allOcupped}
              style={styles.actionButton}
            >
              <HStack space={2} alignItems="center">
                <Feather name="check" size={16} color="white" />
                <Text style={styles.actionButtonText}>
                  <FormattedMessage
                    id={
                      tipoServicio === ID_TIPOSERVICIO_RESERVA
                        ? "createOrder.createReservation"
                        : "createOrder.createOrder"
                    }
                    defaultMessage={
                      tipoServicio === ID_TIPOSERVICIO_RESERVA
                        ? "Crear Reserva"
                        : "Crear Pedido"
                    }
                  />
                </Text>
              </HStack>
            </CustomButton>
          </HStack>
        </Box>
      </View>
    </GenericModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  scrollContent: {
    paddingBottom: 100,
    paddingLeft: 2,
    paddingRight: 2,
  },

  sectionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  productCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
  },

  selectedProductCard: {
    borderColor: Colors.light.primary,
    backgroundColor: "rgba(7, 94, 84, 0)",
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.1,
  },

  clientCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    width: "100%",
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  summaryCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  dateHeader: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },

  warningHeader: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  nextDateButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 12,
  },

  textAreaInput: {
    borderRadius: 12,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },

  actionButtonsContainer: {
    position: "absolute",
    bottom: 0,
    borderRadius: 16,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  actionButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9ca3af",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CreateOrderModal;
