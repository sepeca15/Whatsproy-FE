import { onAddNewOrder, onAddStaticsAndData , loadingData} from "@/services/redux/Slices/homeDataSlice/homeDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLastOrders } from "../home_functions/useLastOrders";
import api from "@/services/api/admin";

export const useHomeData = () => {
    const { refreshLastOrders } = useLastOrders()

    const Dispatch = useDispatch();
    const { numberPedidos, numberClientes, numberIngresos, lastThreeOrders, loaded } = useSelector((state: any) => state.homeData);

    const handleAddStatistics = async (filterType: any) => {
        Dispatch(loadingData())
        try {
            const [lastOrders, statistics] = await Promise.all([
                await refreshLastOrders(),
                await api.order.getStatitics(filterType)
            ]);

            Dispatch(onAddStaticsAndData({ ...(statistics as Record<string, any>), lastOrders }));

        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    const handleAddNewOrder = (data: any) => {
        Dispatch(onAddNewOrder(data))
    }


    return {
        loaded,
        numberPedidos,
        numberClientes,
        numberIngresos,
        lastThreeOrders,
        handleAddStatistics,
        handleAddNewOrder
    };
};
