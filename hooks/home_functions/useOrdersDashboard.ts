import { useDailyStats } from "./useDailyStats";
import { useLastOrders } from "./useLastOrders";
import { usePendingOrders } from "./usePendingOrders";

export const useOrdersDashboard = () => {
  const daily = useDailyStats();
  const last = useLastOrders();
  const pending = usePendingOrders();

  const refreshData = async () => {
    await Promise.all([
      daily.refreshDailyStats(),
      last.refreshLastOrders(),
      pending.refreshPendingOrders(),
    ]);
  };

  const loading = daily.loading || last.loading || pending.loading;

  return {
    ...daily,
    ...last,
    ...pending,
    refreshData,
    loading,
  };
};
