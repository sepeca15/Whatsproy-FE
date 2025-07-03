
import api from "@/services/api/admin";
import { onEndLoadData, onLoadData, onStartLoadData } from "@/services/redux/Slices/clientsSlice/clientSlice";
import { useDispatch, useSelector } from "react-redux";


export const useClientsData = () => {
    const Dispatch = useDispatch();
    const {
        limit,
        offset,
        clientsData,
        loaded,
        totalItems,
        loadingApi
    } = useSelector((state: any) => state.clientsData);

    const handleLoadClientData = async (nombre: any, reset: boolean) => {   
        const valueOffset = reset? 0 : offset     
        Dispatch(onStartLoadData())
        try {
            
            const resp = await api.client.findWithOrders({
                offset: valueOffset,
                limit,
                query: nombre,
            });
            console.log('responde', resp);
            

            if (resp.ok) {
                Dispatch((onLoadData({
                    clients: resp.data,
                    offset: valueOffset + limit,
                    totalItems: resp.totalItems,
                    reset
                })))
            }
        } catch (error: any) {
            console.log('error aqui', error);
        } finally {
            Dispatch(onEndLoadData())
        }
    };


    return {
        limit,
        offset,
        clientsData,
        loaded,
        totalItems,
        loadingApi,
        handleLoadClientData
    };
};
