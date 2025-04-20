//  ← Pedidos pendientes

import { useEffect, useState } from "react";
import api from "@/services/api/admin";

interface Order {
  id: number;
  createdAt: string;
  total: number;
  status: string;
  infoLinesJson: string;
}

export const usePendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshPendingOrders = async () => {
    setLoading(true);
    try {
      const response = await api.order.getPending();
      setPendingOrders(response.data);
    } catch (err) {
      console.error("Error en usePendingOrders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPendingOrders();
  }, []);

  return { pendingOrders, refreshPendingOrders, loading };
};
