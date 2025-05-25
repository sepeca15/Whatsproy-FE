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
  odLoadOrdersActive,
  onLoadingApiAction,
  onFinishLoadingApiAction,
  finishOrderActive,
  setOffsetPending,
  setOffsetActive,
  setOffsetFinished
} from "@/services/redux/Slices/ordersSlice/orderSlice";
import { useDispatch, useSelector } from "react-redux";

export const useOrders = () => {
  const Dispatch = useDispatch();
  const limit = 20;
  const { loadingApi, ordersFinished, ordersPending, ordersActive, loadingApiAction, offsetFinished, offsetPending, offsetActive, totalItemsFinished, totalItemsPending, totalItemsActive } = useSelector(
    (state: any) => state.orders,
  );
  const { showToast } = useToastContext();

  const handleLoadOrdersFinished = async () => {
    Dispatch(onLoadingApi());
    try {
      const data = await api.order.getFinished(offsetFinished, limit);

      if (data.ok === true && data.data.length > 0) {
        Dispatch(onLoadOrdersFinished({ data: data.data, total: data.totalItems }));
        Dispatch(setOffsetFinished(offsetFinished + limit))
      }
    } catch (error: any) {
      console.log("error", error.response.data.message);
    } finally {
      Dispatch(onFinishLoadingApi());
    }
  };

  const handleFinishOrderActive = (order: any) => {
    try {
      Dispatch(finishOrderActive(order))

    } catch (error) {
      console.log(error);
    }
  }

  const handleLoadOrdersPending = async () => {
    Dispatch(onLoadingApi());
    try {
      const data = await api.order.getPending(offsetPending, limit);

      console.log(data);
      

      if (data.ok === true && data.data.length > 0) {
        Dispatch(onLoadOrdersPending({ data: data.data, total: data.totalItems }));
        Dispatch(setOffsetPending(offsetPending + limit))
      }

    } catch (error: any) {
      console.log("errorr", error.response.data.message);
    } finally {
      Dispatch(onFinishLoadingApi());
    }
  };

  const handleLoadingOrdersActive = async () => {
    Dispatch(onLoadingApi());
    try {
      const data = await api.order.getActive(offsetActive, limit);

      console.log(data);

      if (data.ok === true && data.data.length > 0) {
        Dispatch(odLoadOrdersActive({ data: data.data, total: data.totalItems }));
        Dispatch(setOffsetActive(offsetActive + limit))
      }
    } catch (error: any) {
      console.log("error", error.response.data.message);
    } finally {
      Dispatch(onFinishLoadingApi());
    }
  };

  const confirmOrder = async (infoOrder: any) => {
    Dispatch(onLoadingApiAction());

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
    } finally {
      Dispatch(onFinishLoadingApiAction());
    }
  };

  const handleDeleteOrder = async (id: number, key: "pending" | "finished") => {
    Dispatch(onLoadingApiAction());
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
    } finally {
      Dispatch(onFinishLoadingApiAction());
    }
  };

  const handleAddNewOrderPending = (newOrder: any) => {
    Dispatch(onAddOrderPending(newOrder));
  };

  const addOffsetToOrdersPending = () => {
    try {
      Dispatch(setOffsetPending(offsetPending + 1))
    } catch (error) {
      console.log(error);
    }
  }


  
  return {
    loadingApiAction,
    loadingApi,
    ordersFinished,
    ordersPending,
    ordersActive,
    totalItemsFinished,
    totalItemsPending,
    totalItemsActive,
    handleLoadOrdersFinished,
    handleLoadOrdersPending,
    confirmOrder,
    handleDeleteOrder,
    handleAddNewOrderPending,
    handleLoadingOrdersActive,
    handleFinishOrderActive,
    addOffsetToOrdersPending
  };
};
