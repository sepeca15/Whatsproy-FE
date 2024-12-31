
import api from "@/services/api/admin"
import { onAddOrderPending, onConfirmOrder, onDeleteOrder, onFinishLoadingApi, onLoadingApi, onLoadOrdersFinished, onLoadOrdersPending } from "@/services/redux/Slices/ordersSlice/orderSlice"
import { useDispatch, useSelector } from "react-redux"

export const useOrders = () => {

    const Dispatch = useDispatch()
    const { loadingApi, ordersFinished, ordersPending } = useSelector((state: any) => state.orders)

    const handleLoadOrdersFinished = async () => {
        Dispatch(onLoadingApi())
        try {
            const data = await api.order.getFinished()

            if (data.ok === true && data.data.length > 0) {
                Dispatch(onLoadOrdersFinished(data.data))
            }

        } catch (error) {
            console.log('error', error);
        } finally {
            Dispatch(onFinishLoadingApi())
        }
    }

    const handleLoadOrdersPending = async () => {
        Dispatch(onLoadingApi())
        try {
            const data = await api.order.getPending()

            if (data.ok === true && data.data.length > 0) {
                Dispatch(onLoadOrdersPending(data.data))
            }

        } catch (error) {
            console.log('error', error);
        } finally {
            Dispatch(onFinishLoadingApi())
        }
    }

    const confirmOrder = async (infoOrder : any) => {        
        try {
            const data = await api.order.confirm(infoOrder.orderId)

            if (data.ok === true ) {
                console.log('CONFIRMAAAR PEDIDO');
                Dispatch(onConfirmOrder(infoOrder))
            }

        } catch (error) {
            console.log('error', error);
        }
    }


    const handleDeleteOrder = async (id : number, key: string) => {                
        try {
            const data = await api.order.remove(id)            
            
            if (data.ok === true) {            
                Dispatch(onDeleteOrder({orderId: id, key: key}))
            }

        } catch (error:any) {
            if (error.response && error.response.data) {
                console.log(error.response.data.message);
              } else {                
                console.log(error.message || 'Error inesperado');
              }
            
        }
    }

    const handleAddNewOrderPending = (newOrder : any) => {
        console.log('new order', newOrder);
        Dispatch(onAddOrderPending(newOrder))
    }

    return {
        loadingApi,
        ordersFinished,
        ordersPending,
        handleLoadOrdersFinished,
        handleLoadOrdersPending,
        confirmOrder,
        handleDeleteOrder,
        handleAddNewOrderPending
    }
}