import { useToastContext } from "@/contexts/ToastContext";
import api from "@/services/api/admin";
import {
  onAddOrderPending,
  onConfirmOrder,
  onDeleteOrder,
  onFinishLoadingApi,
  onLoadingApi,
  onLoadOrdersFinished,
  onLoadOrdersPending,
  odLoadOrdersActive
} from "@/services/redux/Slices/ordersSlice/orderSlice";
import { useDispatch, useSelector } from "react-redux";

export const useOrders = () => {
  const Dispatch = useDispatch();
  const { loadingApi, ordersFinished, ordersPending, ordersActive } = useSelector(
    (state: any) => state.orders,
  );
  const { showToast } = useToastContext();

  const handleLoadOrdersFinished = async () => {
    Dispatch(onLoadingApi());
    try {
      const data = await api.order.getFinished();

      if (data.ok === true && data.data.length > 0) {
        Dispatch(onLoadOrdersFinished(data.data));
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      Dispatch(onFinishLoadingApi());
    }
  };

  const handleLoadOrdersPending = async () => {
    Dispatch(onLoadingApi());
    try {
      const data = await api.order.getPending();

      if (data.ok === true && data.data.length > 0) {
        Dispatch(onLoadOrdersPending(data.data));
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      Dispatch(onFinishLoadingApi());
    }
  };

  const handleLoadingOrdersActive = async () => {
    Dispatch(onLoadingApi());
    try {
      const data = await api.order.getActive();

      if (data.ok === true && data.data.length > 0) {
        Dispatch(odLoadOrdersActive(data.data));
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      Dispatch(onFinishLoadingApi());
    }
  };

  const confirmOrder = async (infoOrder: any) => {
    try {
      const data = await api.order.confirm(infoOrder.orderId);

      if (data.ok === true) {
        Dispatch(onConfirmOrder(infoOrder));
        showToast({
          title: "Orden confirmada exitosamente",
          status: "success",
        });
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
      });
      console.log("error", error);
    }
  };

  const handleDeleteOrder = async (id: number, key: "pending" | "finished") => {
    try {
      const data = await api.order.remove(id);

      if (data.ok === true) {
        Dispatch(onDeleteOrder({ orderId: id, key: key }));
        showToast({
          title: "Orden eliminada exitosamente",
          status: "success",
        });
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
      });
    }
  };

  const handleAddNewOrderPending = (newOrder: any) => {
    Dispatch(onAddOrderPending(newOrder));
  };

  return {
    loadingApi,
    ordersFinished,
    ordersPending,
    ordersActive,
    handleLoadOrdersFinished,
    handleLoadOrdersPending,
    confirmOrder,
    handleDeleteOrder,
    handleAddNewOrderPending,
    handleLoadingOrdersActive
  };
};
