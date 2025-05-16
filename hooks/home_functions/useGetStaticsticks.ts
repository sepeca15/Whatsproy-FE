import api from "@/services/api/admin";
import { useState } from "react";
import { useIntl } from "react-intl";

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

export const useGetStatitics = () => {
  const [statitics, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const getStatitics = async (filterType: string) => {
    try {
      setLoading(true);
      const result = await api.order.getStatitics(filterType);
      setData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return { statitics, getStatitics, loading };
};
