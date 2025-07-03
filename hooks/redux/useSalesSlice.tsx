
import api from "@/services/api/admin";
import { onLoadData, onStartLoadingApi, onEndLoadingApi } from "@/services/redux/Slices/salesSlice/salesSlice";
import { useDispatch, useSelector } from "react-redux";

export const useSalesSlice = () => {
    const Dispatch = useDispatch();
    const {
        resumeSales,
        salesByCategory,
        salesChart,
        salesOverview,
        loadingApi,
        dataLoaded
    } = useSelector((state: any) => state.salesSlice);

    const handleLoadData = async (periodSalesByCategory: "lastDay" | "lastWeek" | "lastMonth") => {
        Dispatch(onStartLoadingApi())
        try {
            const [res, respSalesOverview, respSalesByCategory, salesChartResp] = await Promise.all([
                api.perfil.getResumenVentas(),
                api.order.getSalesOverview(),
                api.order.getSalesByCategory(periodSalesByCategory),
                api.order.getSalesChart(),
            ]);
            
            Dispatch(onLoadData({
                resumeSales: res,
                salesOverview: respSalesOverview,
                salesByCategory: respSalesByCategory,
                salesChart: salesChartResp
            }))

        } catch (error: any) {
            console.log('error aqui', error);
        } finally {
            Dispatch(onEndLoadingApi())
        }
    };


    return {
        dataLoaded,
        resumeSales,
        salesByCategory,
        salesChart,
        salesOverview,
        loadingApi,
        handleLoadData
    };
};
