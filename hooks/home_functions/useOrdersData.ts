import { useState, useCallback, useRef, useEffect } from "react";
import api from "@/services/api/admin";

const getFormattedDate = (): string => new Date().toISOString().split("T")[0];

const getTimeAgo = (date: string): string => {
  const now = new Date();
  const createdAt = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

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
  const isFetching = useRef(true);
  const [rawOrders, setRawOrders] = useState<any[]>([]);


  const getOrders = async () => {
    try {
      isFetching.current = true;
      const response = await api.order.lastThreeOrders();
      console.log('recibo', response.data);
      setRawOrders(response.data);
      const formattedOrders = response.data.map((order: any) => {
        let addres = "No disponible";
        let status = "sin status";

        try {
          const infoExtra = JSON.parse(order.infoLinesJson);
          addres = infoExtra.Direccion && infoExtra.Direccion.trim() ? infoExtra.Direccion : "No disponible";
          status = order.status && order.status.trim() ? order.status.trim() : "sin status";

        } catch (error) {
          console.error("Error parsing infoLinesJson:", error);
        }

        return {
          id: order.id,
          time: getTimeAgo(order.createdAt),
          amount: `$${order.total}`,
          icon: "receipt",
          address: addres,
          status: order.status,

        };
      });
      setLastOrders(formattedOrders);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    } finally {
      isFetching.current = false;
    }
  };

  const getOrdersByDate = async () => {
    try {
      isFetching.current = true;
      const today = getFormattedDate();
      const response = await api.order.getOrdersByDate(today);

      setOrdersCount(response.ordersDay || 0);
      console.log("Pedidos del día:", response.ordersDay);
    } catch (error) {
      console.error("Error al obtener pedidos por fecha:", error);
    } finally {
      isFetching.current = false;
    }
  };

  const moneyinday = async () => {
    try {
      isFetching.current = true;
      const today = getFormattedDate();
      const response = await api.order.moneyinday(today);
      setDailyRevenue(response.ganancia ?? 0);
    } catch (error) {
      console.error("Error al obtener ingresos del día:", JSON.stringify(error));
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    getOrders();
    getOrdersByDate();
    moneyinday();
  }, []);

  return {
    ordersCount,
    dailyRevenue,
    lastOrders,
    loading: isFetching.current,
    refreshData: async () => {
      await Promise.all([getOrders(), getOrdersByDate(), moneyinday()]);
    },
    rawOrders,
  };
};

export default useOrdersData;
