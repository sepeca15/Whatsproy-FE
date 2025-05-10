import { useEffect, useState } from "react";
import api from "@/services/api/admin";

interface Order {
  id: number;
  createdAt: string;
  total: number;
  status: string;
  infoLinesJson: string;
}

export const useSubscriptionStatus = () => {
  const [subStatus, setSubStatus] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSubscriptionStatus = async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await api.order.subOrderStatus();
      setSubStatus(response);
    } catch (err: any) {
      console.error("Error en useSubscriptionStatus:", err);
      const errorMessage =
        err.response?.data?.message || `Error ${err.response?.status}: ${err.response?.statusText}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscriptionStatus();
  }, []);

  return { subStatus, refreshSubscriptionStatus, loading, error };
};
