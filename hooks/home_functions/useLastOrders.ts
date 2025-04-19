//  ← Últimos 3 pedidos, formateados

import { useEffect, useState } from "react";
import api from "@/services/api/admin";

const getTimeAgo = (date: string): string => {
  const now = new Date();
  const createdAt = new Date(date);
  const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `hace ${days} día${days > 1 ? "s" : ""}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  return "hace unos segundos";
};

interface Order {
  id: number;
  createdAt: string;
  total: number;
  status: string;
  infoLinesJson: string;
}

interface FormattedOrder {
  id: number;
  time: string;
  amount: string;
  icon: string;
  address: string;
  status: string;
}

export const useLastOrders = () => {
  const [lastOrders, setLastOrders] = useState<FormattedOrder[]>([]);
  const [rawOrders, setRawOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshLastOrders = async () => {
    setLoading(true);
    try {
      const response = await api.order.lastThreeOrders();
      const orders = response.data;
      setRawOrders(orders);

      const formatted = orders.map((order: Order) => {
        let address = "No disponible";
        let status = "sin status";

        try {
          const info = JSON.parse(order.infoLinesJson);
          address = info.Direccion?.trim() || "No disponible";
          status = order.status?.trim() || "sin status";
        } catch (error) {
          console.error("Error al parsear infoLinesJson", error);
        }

        return {
          id: order.id,
          time: getTimeAgo(order.createdAt),
          amount: `$${order.total}`,
          icon: "receipt",
          address,
          status,
        };
      });

      setLastOrders(formatted);
    } catch (err) {
      console.error("Error en useLastOrders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLastOrders();
  }, []);

  return { lastOrders, rawOrders, refreshLastOrders, loading };
};
