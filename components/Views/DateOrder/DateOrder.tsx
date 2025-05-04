import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./DateOrderStyles";
import api from "@/services/api/admin";
import CustomText from "@/components/CustomText";
import DateOrderCard from "./components/DateOrderCard";
import ModalCreateOrderDate from "./components/ModalCreateOrderDate";
import IonIcons from "react-native-vector-icons/Ionicons";
import MaterialIconss from "react-native-vector-icons/MaterialIcons";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { useToastContext } from "@/contexts/ToastContext";
import { FormattedMessage } from "react-intl"; // Importa FormattedMessage
import Animated from "react-native-reanimated";
import ModalConfirmAction from "@/components/ModalConfirmAction/ModalConfirmAction";
import { initPaymentSheet } from "@stripe/stripe-react-native";

const ItemsTable = ["Name", "Type", "Required", "isDefect", ""];

const DateOrder: React.FC = () => {
  const [orderDate, setOrderDate] = React.useState<any[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<any>({});
  const [stateModal, setStateModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = React.useState<boolean>(false);
  const [stateModalConfirm, setstateModalConfirm] = React.useState<boolean>(false)
  const [itemToDeleteId, setItemToDeleteId] = React.useState<number | null>(null);

  const { showToast } = useToastContext();

  const toggleModalConfirm = () => setstateModalConfirm((prev) => !prev)

  const updateOrderData = (newOrderData: any) => {
    setOrderDate((prevState) => [...prevState, newOrderData]);
  };

  const openConfirmModal = (id: number) => {
    setItemToDeleteId(id);
    setstateModalConfirm(true);
  };

  const getAllOrderDate = async () => {
    setLoading(true);
    try {
      const data = await api.dataOrder.getAll();
      setOrderDate(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onOpenModal = (item: any) => {
    item && setSelectedItem(item);
    setStateModal(true);
  };

  const onCloseModal = () => {
    setSelectedItem({});
    setStateModal(false);
  };

  const onDeleteItem = async (id: number) => {
    setLoadingDelete(true)
    try {
      const data = await api.dataOrder.delete(id);
      if (data) {
        const allItems = orderDate.filter((item) => item.id !== id);
        setOrderDate(allItems);
        showToast({
          title: <FormattedMessage id="orderDeletedSuccess" />,
          status: "success",
        });
      }
    } catch (error: any) {
      showToast({
        title: <FormattedMessage id="error" />,
        description: error.response.data.message,
        status: "error",
      });
      console.log(error);
    } finally {
      setLoadingDelete(false)
    }
  };

  React.useEffect(() => {
    getAllOrderDate();
  }, []);

  return loading ? (
    <View style={styles.progress}>
      <Progress.Circle
        color={Colors.light.primary}
        indeterminate={true}
        size={100}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <Animated.View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <CustomText
              style={styles.businessName}
              accessibilityLabel="Pedidos"
            >
              <FormattedMessage id="orderData" />
            </CustomText>
          </View>
        </View>
      </Animated.View>

      <View style={styles.message}>
        <MaterialIconss
          style={{ marginTop: 3 }}
          color={Colors.light.secondary}
          size={16}
          name="error-outline"
        />
        <CustomText style={{ flex: 1, color: Colors.light.secondary }}>
          <FormattedMessage id="manageOrderData" />
        </CustomText>
      </View>
      <View style={styles.containerInfoLineTable}>
        <View style={styles.tableHeader}>
          {ItemsTable.map((item, index) => {
            return (
              <View
                key={index}
                style={
                  item === "Name"
                    ? styles.columnName
                    : item === ""
                      ? styles.columnDelete
                      : styles.column
                }
              >
                <CustomText style={styles.text}>{item}</CustomText>
              </View>
            );
          })}
        </View>
        <View style={styles.tableBody}>
          {orderDate?.map((item, index) => {
            const isPar = index % 2 === 0;
            return (
              <DateOrderCard
                isPar={isPar}
                key={index}
                onDeleteItem={()=> openConfirmModal(item.id)}
                data={item}
              />
            );
          })}
        </View>
      </View>
      <Pressable style={styles.button} onPress={onOpenModal}>
        <IonIcons color={"white"} size={25} name="add-sharp" />
      </Pressable>
      {stateModal && (
        <ModalCreateOrderDate
          updateOrder={updateOrderData}
          onClose={onCloseModal}
          data={selectedItem}
        />
      )}
      <ModalConfirmAction
        isOpen={stateModalConfirm}
        onClose={toggleModalConfirm}
        loading={loadingDelete}
        onContinue={() => onDeleteItem(itemToDeleteId ?? 0)}
        title="Delete order data"
      />
    </View>
  );
};

export default DateOrder;
