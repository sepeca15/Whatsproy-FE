import { useState } from "react";
import { View } from "react-native";
import { styles } from "./CardNewPedidoStyles";
import CustomText from "@/components/CustomText";
import { useOrders } from "@/hooks/redux/useOrders";
import { useRouter } from "expo-router";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Pressable, Spinner } from "native-base";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

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
  isDomicilio?: boolean;
  reclamo?: {
    createdAt: string;
    texto: string;
  };
}

interface ICardNewPedido {
  pending: boolean;
  orderData: IOrderData;
  active?: boolean;
  trashIcon?: boolean;
}

const CardNewPedido = ({
  pending,
  orderData,
  trashIcon = true,
  active,
}: ICardNewPedido) => {
  const [loading, setLoading] = useState({
    deleteState: false,
    confirmState: false,
  });

  const router = useRouter();
  const [statusModalDelete, setStateModalDelete] = useState<boolean>(false);
  const { handleDeleteOrder, confirmOrder, loadingApiAction } = useOrders();
  const keyDeleteType = active ? "active" : pending ? "pending" : "finished";
  const { clientName, numberSender, orderId, total, isDomicilio } = orderData;

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
    <View style={[styles.orderSummaryCard, formalStyles.cardContainer]}>
      <View style={formalStyles.cardHeader}>
        <View style={formalStyles.clientSection}>
          <View style={formalStyles.clientInfo}>
            <CustomText numberOfLines={1} style={formalStyles.clientName}>
              {clientName}
            </CustomText>
            <CustomText style={formalStyles.timeText}>
              {fromNow ?? "-"}
            </CustomText>
          </View>
        </View>

        <View style={formalStyles.statusSection}>
          <View style={[styles.statusBadge, formalStyles.statusBadge]}>
            <CustomText style={[styles.statusText, formalStyles.statusText]}>
              {!orderData?.estado
                ? intl.formatMessage({ id: "new", defaultMessage: "Nuevo" })
                : orderData?.estado?.nombre}
            </CustomText>
          </View>
        </View>
      </View>

      <View style={formalStyles.deliverySection}>
        <View style={formalStyles.deliveryInfo}>
          <View style={formalStyles.deliveryIconContainer}>
            {isDomicilio ? (
              <Feather name="truck" size={14} color={Colors.light.secondary} />
            ) : (
              <Feather name="map-pin" size={14} color={Colors.light.warning} />
            )}
          </View>
          <View style={formalStyles.deliveryTextContainer}>
            <CustomText style={formalStyles.deliveryTypeText}>
              {isDomicilio ? (
                <FormattedMessage
                  id="homeDelivery"
                  defaultMessage="Envío a domicilio"
                />
              ) : (
                <FormattedMessage
                  id="storePickup"
                  defaultMessage="Retiro en sucursal"
                />
              )}
            </CustomText>
            <CustomText style={formalStyles.addressText} numberOfLines={1}>
              {direccion}
            </CustomText>
          </View>
        </View>

        <View style={formalStyles.totalSection}>
          <CustomText style={formalStyles.totalLabel}>
            <FormattedMessage id="total" defaultMessage="Total" />
          </CustomText>
          <CustomText style={formalStyles.totalValue}>
            ${Number(total).toFixed(2)}
          </CustomText>
        </View>
      </View>

      <View style={formalStyles.contactSection}>
        <Feather name="phone" size={12} color={Colors.light.icon} />
        <CustomText style={formalStyles.phoneText}>{numberSender}</CustomText>
      </View>

      {orderData?.reclamo && (
        <View style={formalStyles.claimSection}>
          <Feather name="alert-triangle" size={14} color="#f59e0b" />
          <CustomText style={formalStyles.claimText}>
            <FormattedMessage id="hasClaim" defaultMessage="Tiene reclamo" />
          </CustomText>
          <CustomText style={formalStyles.claimDate}>
            {moment(orderData.reclamo.createdAt).fromNow()}
          </CustomText>
        </View>
      )}

      {orderData.transferUrl && (
        <View style={formalStyles.transferSection}>
          <Feather name="paperclip" size={14} color="#0284c7" />
          <CustomText style={formalStyles.transferText}>
            <FormattedMessage
              id="attachedTransferProof"
              defaultMessage="Comprobante adjunto"
            />
          </CustomText>
        </View>
      )}

      <View style={styles.divider} />

      <View style={formalStyles.actionsSection}>
        <Pressable
          accessibilityRole={"button"}
          onPress={handleSendPageDetails}
          style={formalStyles.detailsButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="eye" size={16} color={Colors.light.primary} />
          <CustomText style={formalStyles.detailsButtonText}>
            <FormattedMessage id="details" defaultMessage="Detalles" />
          </CustomText>
        </Pressable>

        {pending === true ? (
          <View style={formalStyles.pendingActions}>
            <Button
              isLoading={loading.deleteState}
              isDisabled={loadingApiAction}
              onPress={() => handleModal(true)}
              style={formalStyles.rejectButton}
              spinner={<Spinner color="#dc2626" size="sm" />}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {!loadingApiAction && (
                <Feather name="x" size={12} color="#dc2626" />
              )}
            </Button>
            <Button
              style={formalStyles.acceptButton}
              onPress={handleConfirmOrder}
              isLoading={loading.confirmState}
              spinner={<Spinner color="white" size="sm" />}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="check" size={14} color="white" />
            </Button>
          </View>
        ) : trashIcon ? (
          <Pressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => handleModal(true)}
            style={formalStyles.deleteButton}
          >
            <Feather name="trash-2" size={16} color="#dc2626" />
          </Pressable>
        ) : (
          <></>
        )}
      </View>

      {statusModalDelete && (
        <ModalConfirmAction
          loading={loading.deleteState}
          onContinue={handleDeleteEntryOrder}
          title={intl.formatMessage({
            id: "deleteOrderTitle",
            defaultMessage: "Eliminar pedido",
          })}
          message={intl.formatMessage({
            id: "deleteOrderMessage",
            defaultMessage:
              "Si eliminas este pedido, no lo verás aquí pero afectará las estadísticas de tu empresa.",
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

const formalStyles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  clientSection: {
    flex: 1,
  },
  clientInfo: {
    flexDirection: "column",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  statusSection: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  deliverySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: 16,
  },
  deliveryIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(7, 94, 84, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryTypeText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  totalSection: {
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 11,
    color: Colors.light.icon,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  contactSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  phoneText: {
    fontSize: 12,
    color: Colors.light.icon,
    marginLeft: 6,
  },
  claimSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  claimText: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "500",
    marginLeft: 6,
    flex: 1,
  },
  claimDate: {
    fontSize: 10,
    color: "#92400e",
  },
  transferSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  transferText: {
    fontSize: 12,
    color: "#0284c7",
    fontWeight: "500",
    marginLeft: 6,
  },
  actionsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(7, 94, 84, 0.1)",
  },
  detailsButtonText: {
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: "500",
    marginLeft: 6,
  },
  pendingActions: {
    flexDirection: "row",
    gap: 8,
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    borderWidth: 1,
    borderColor: "#dc2626",
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(220, 38, 38, 0.1)",
  },
});

export default CardNewPedido;
