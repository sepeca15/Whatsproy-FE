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
  const [error, setError] = useState<string | null>(null);

  const refreshPendingOrders = async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await api.order.getPending();
      setPendingOrders(response.data);
    } catch (err: any) {
      console.error("Error en usePendingOrders:", err);
      const errorMessage =
        err.response?.data?.message || `Error ${err.response?.status}: ${err.response?.statusText}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPendingOrders();
  }, []);

  return { pendingOrders, refreshPendingOrders, loading, error };
};
