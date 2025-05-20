//← Cantidad de pedidos + ganancia del día

import { useEffect, useState } from "react";
import api from "@/services/api/admin";

const getFormattedDate = () => new Date().toISOString().split("T")[0];

export const useDailyStats = () => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshDailyStats = async () => {
    setLoading(true);
    const today = getFormattedDate();
    try {
      const [orders, revenue] = await Promise.all([
        api.order.getOrdersByDate(today),
        api.order.moneyinday(today),
      ]);
      setOrdersCount(orders.ordersDay || 0);
      setDailyRevenue(revenue.ganancia ?? 0);
    } catch (err) {
      console.error("Error en useDailyStats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDailyStats();
  }, []);

  return { ordersCount, dailyRevenue, refreshDailyStats, loading };
};
