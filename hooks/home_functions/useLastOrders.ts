import { useEffect, useState } from "react";
import api from "@/services/api/admin";
import { useIntl } from "react-intl";
import moment from "moment-timezone";

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
  fecha?: string;
  icon: string;
  address?: string | null;
  status: string;
}

export const useLastOrders = () => {
  const [lastOrders, setLastOrders] = useState<FormattedOrder[]>([]);
  const [rawOrders, setRawOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const getTimeAgo = (date: string): string => {
    const now = new Date();
    const createdAt = new Date(date);
    const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0)
      return intl.formatMessage(
        { id: "orders.daysAgo" },
        { count: days, plural: days > 1 ? "s" : "" }
      );
    if (hours > 0)
      return intl.formatMessage(
        { id: "orders.hoursAgo" },
        { count: hours, plural: hours > 1 ? "s" : "" }
      );
    if (minutes > 0)
      return intl.formatMessage(
        { id: "orders.minutesAgo" },
        { count: minutes, plural: minutes > 1 ? "s" : "" }
      );

    return intl.formatMessage({ id: "orders.justNow" });
  };

  const refreshLastOrders = async () => {
    setLoading(true);
    try {
      const response = await api.order.lastThreeOrders();
      const orders = response.data;
      setRawOrders(orders);

      const formatted = orders.map((order: Order & { fecha: string }) => {
        let address = intl.formatMessage({ id: "orders.noAddress" });
        let status = intl.formatMessage({ id: "orders.noStatus" });

        try {
          const info = JSON.parse(order.infoLinesJson);
          address = info?.Direccion?.trim() || address;
          status = order.status?.trim() || status;
        } catch (error) {
          console.error("Error al parsear infoLinesJson", error);
        }

        return {
          id: order.id,
          time: getTimeAgo(order.createdAt),
          fecha: order?.fecha ? moment(order?.fecha).format("YYYY-MM-DD HH:mm") : new Date(),
          amount: intl.formatMessage({ id: "orders.currencyPrefix" }, { amount: order.total }),
          icon: "receipt",
          address,
          status,
        };
      });

      setLastOrders(formatted);
      return formatted

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
