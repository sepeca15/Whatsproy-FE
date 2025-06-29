import {
  onAddNewOrder,
  onAddStaticsAndData,
} from "@/services/redux/Slices/homeDataSlice/homeDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLastOrders } from "../home_functions/useLastOrders";
import api from "@/services/api/admin";
import { useState } from "react";

export const useHomeData = () => {
  const { refreshLastOrders } = useLastOrders();
  const [loaidngStatitics, setLoadingStatitics] = useState(false);

  const Dispatch = useDispatch();
  const {
    numberPedidos,
    numberClientes,
    numberIngresos,
    lastThreeOrders,
    loaded,
  } = useSelector((state: any) => state.homeData);

  const handleAddStatistics = async (filterType: any) => {
    setLoadingStatitics(true);
    try {
      const [lastOrders, statistics] = await Promise.all([
        await refreshLastOrders(),
        await api.order.getStatitics(filterType),
      ]);

      Dispatch(
        onAddStaticsAndData({
          ...(statistics as Record<string, any>),
          lastOrders,
        })
      );
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setLoadingStatitics(false);
    }
  };

  const handleAddNewOrder = (data: any) => {
    Dispatch(
      onAddNewOrder({
        ...data,
        time: data.createdAt,
        amount: data.total,
        address: data.direccion,
      })
    );
  };

  const handleAddNewOrderNormal = (data: any) => {
    Dispatch(onAddNewOrder({ ...data }));
  };

  return {
    loaded,
    numberPedidos,
    numberClientes,
    numberIngresos,
    lastThreeOrders,
    handleAddStatistics,
    handleAddNewOrder,
    handleAddNewOrderNormal,
    loaidngStatitics,
  };
};
