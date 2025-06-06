import { useGetStatitics } from "./useGetStaticsticks";
import { useLastOrders } from "./useLastOrders";
import { usePendingOrders } from "./usePendingOrders";

export const useOrdersDashboard = (filterType: any) => {
  const last = useLastOrders();
  const statitics = useGetStatitics();

  const refreshData = async () => {
    await Promise.all([
      last.refreshLastOrders(),
      statitics.getStatitics(filterType),
    ]);
  };

  const loading = last.loading || statitics.loading;

  return {
    ...last,
    ...statitics,
    refreshData,
    loading,
  };
};
