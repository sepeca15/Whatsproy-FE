import React, { useState } from "react";
import { View } from "react-native";
import { styles } from "./CardNewPedidoStyles";
import CustomText from "@/components/CustomText";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import IonIcons from "react-native-vector-icons/Ionicons";
import MaterialIconss from "react-native-vector-icons/MaterialCommunityIcons";
import { useOrders } from "@/hooks/redux/useOrders";
import { useRouter } from "expo-router";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Pressable, Spinner } from "native-base";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";

interface IOrderData {
  clientName: string;
  direccion: string[];
  numberSender: string;
  total: number;
  status?: boolean;
  transferUrl?: any;
  estado: any;
  orderId: number;
  createdAt?: string;
  reclamo?: {
    createdAt: string;
    texto: string;
  };
}

interface ICardNewPedido {
  pending: boolean;
  orderData: IOrderData;
}

const CardNewPedido = ({ pending, orderData }: ICardNewPedido) => {
  const [loading, setLoading] = useState({
    deleteState: false,
    confirmState: false,
  });

  console.log("orderData", orderData)

  const router = useRouter();
  const [statusModalDelete, setStateModalDelete] = useState<boolean>(false);
  const { handleDeleteOrder, confirmOrder, loadingApiAction } = useOrders();
  const keyDeleteType = pending ? "pending" : "finished";
  const { clientName, numberSender, orderId, total } = orderData;

  const direccion = orderData?.direccion ?? "No direction";
  const intl = useIntl();
  const createdAt = orderData?.createdAt;
  const fromNow = createdAt ? moment(createdAt)?.fromNow() : "";
  const [reason, setReason] = useState("");

  const toggleOptionLoading = (key: string) => {
    setLoading((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSendPageDetails = () => {
    router.push({
      pathname: "/(tabs)/orderDetails",
      params: { orderId: orderId, keyDeleteType: keyDeleteType },
    });
  };

  const handleModal = (value: boolean) => {
    setStateModalDelete(value);
  };

  const handleConfirmOrder = async () => {
    toggleOptionLoading("confirmState");
    try {
      await confirmOrder(orderData);
    } catch (error) {
    } finally {
      toggleOptionLoading("confirmState");
    }
  };

  const handleDeleteEntryOrder = async () => {
    toggleOptionLoading("deleteState");
    try {
      await handleDeleteOrder(orderId, keyDeleteType, reason);
    } catch (error) {
    } finally {
      toggleOptionLoading("deleteState");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <View style={styles.row1}>
          <View style={styles.column}>
            <View style={styles.row3}><View style={styles.column}>
              <CustomText style={styles.name}>
                <FormattedMessage id="client" defaultMessage="Client" />: {clientName}
              </CustomText>
              <CustomText style={{ color: "#abcbfb", fontSize: 12 }}>
                {fromNow ?? "-"}
              </CustomText>
              <View style={styles.miniSeparator}></View>
              <CustomText style={styles.text}>{direccion}</CustomText>
              <View style={styles.separator}></View>
              <CustomText style={styles.text}>
                {intl.formatMessage({ id: "phone", defaultMessage: "Tel" })}: {numberSender}
              </CustomText>
            </View>
              <View style={styles.column2}>
                <View style={styles.buttonsTop}>
                  <CustomText style={styles.nuevo}>
                    {!orderData?.status
                      ? intl.formatMessage({ id: "new", defaultMessage: "New" })
                      : orderData?.estado?.nombre}
                  </CustomText>
                </View>
                <CustomText style={styles.semiBold}>
                  {intl.formatMessage({ id: "total", defaultMessage: "Total" })}: ${total}
                </CustomText>
              </View></View>
            {orderData?.reclamo && pending && (
              <View style={styles.reclamoBox}>
                <View style={styles.reclamoRow}>
                  <MaterialIconss name="alert-circle-outline" size={18} color="#f59e0b" />
                  <CustomText style={styles.reclamoText}>
                    <FormattedMessage id="hasClaim" defaultMessage="Has a claim" />
                  </CustomText>
                </View>
                <CustomText style={styles.reclamoDate}>
                  {moment(orderData.reclamo.createdAt).fromNow()}
                </CustomText>
              </View>
            )}


            {orderData.transferUrl && (
              <View
                style={{
                  backgroundColor: "#e0f2fe",
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <MaterialIcons name="attach-file" size={16} color="#0284c7" />
                <CustomText style={{ marginLeft: 6, fontSize: 13, color: "#0284c7" }}>
                  <FormattedMessage
                    id="attachedTransferProof"
                    defaultMessage="Comprobante de transferencia adjunto"
                  />
                </CustomText>
              </View>
            )}


          </View>

        </View>
        <View style={styles.row2}>
          <Pressable
            accessibilityRole={"button"}
            onPress={handleSendPageDetails}
            style={styles.detalles}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <AntDesign color={"black"} name="eyeo" size={16} />
            <CustomText style={{ color: "black" }}>
              <FormattedMessage id="details" defaultMessage="Details" />
            </CustomText>
          </Pressable>
          {pending === true ? (
            <View style={styles.buttons}>
              <Button
                isLoading={loading.deleteState}
                isDisabled={loadingApiAction}
                onPress={() => handleModal(true)}
                style={styles.buttonTransparent}
                spinner={<Spinner color="black" />}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {!loadingApiAction && (
                  <EvilIcons color={"black"} name="close" size={22} />
                )}
              </Button>
              <Button
                style={styles.buttonTransparent}
                onPress={handleConfirmOrder}
                isLoading={loading.confirmState}
                spinner={<Spinner color="black" />}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <IonIcons color={"black"} name="checkmark-done" size={20} />
              </Button>
            </View>
          ) : (
            <Pressable
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              onPress={() => handleModal(true)}
              style={styles.deleteButton}
            >
              <MaterialIconss name="delete" size={20} color={"#FF6F6F"} />
            </Pressable>
          )}
        </View>
      </View>
      {statusModalDelete && (
        <ModalConfirmAction
          loading={loading.deleteState}
          onContinue={handleDeleteEntryOrder}
          title={intl.formatMessage({
            id: "deleteOrderTitle",
            defaultMessage: "Delete order",
          })}
          message={intl.formatMessage({
            id: "deleteOrderMessage",
            defaultMessage:
              "If you delete this order, you will not see it here but it will affect your company's statistics.",
          })}
          withReason={true}
          onClose={() => handleModal(false)}
          reason={reason}
          setReason={setReason}
          isOpen={statusModalDelete}
        />
      )}
    </View>
  );
};

export default CardNewPedido;
