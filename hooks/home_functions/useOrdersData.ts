import { useState, useCallback, useRef, useEffect } from "react";
import api from "@/services/api/admin";

const getFormattedDate = (): string => new Date().toISOString().split("T")[0];

const getTimeAgo = (date: string): string => {
  const now = new Date();
  const createdAt = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `hace ${days} día${days > 1 ? "s" : ""}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  return "hace unos segundos";
};

const useOrdersData = () => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [lastOrders, setLastOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);

  const getOrders = useCallback(async () => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      setLoading(true);
      const response = await api.order.lastThreeOrders();
      const formattedOrders = response.data.map((order: any) => {
        let costo = 0;
        try {
          const infoExtra = JSON.parse(order.infoLinesJson);
          costo = infoExtra.Costo || 0;
        } catch (error) {
          console.error("Error parsing infoLinesJson:", error);
        }

        return {
          id: order.id,
          time: getTimeAgo(order.createdAt),
          amount: `$${costo}`,
          icon: "receipt",
        };
      });
      setLastOrders(formattedOrders);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  }, []);

  const getOrdersByDate = useCallback(async () => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      const today = getFormattedDate();
      const response = await api.order.getOrdersByDate(today);
      setOrdersCount(response.ordersDay || 0);
    } catch (error) {
      console.error("Error al obtener pedidos por fecha:", error);
    } finally {
      isFetching.current = false;
    }
  }, []);

  const moneyinday = useCallback(async () => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      const today = getFormattedDate();
      const response = await api.order.moneyinday(today);
      setDailyRevenue(response.ganancia ?? 0);
    } catch (error) {
      console.error("Error al obtener ingresos del día:", error);
    } finally {
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    getOrders();
    getOrdersByDate();
    moneyinday();
  }, [getOrders, getOrdersByDate, moneyinday]);

  return {
    ordersCount,
    dailyRevenue,
    lastOrders,
    loading,
    refreshData: async () => {
      await Promise.all([getOrders(), getOrdersByDate(), moneyinday()]);
    },
  };
};

export default useOrdersData;
