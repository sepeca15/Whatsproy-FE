import ApiInstances from "@/services/axios/axiosConfig";


export const creteStatusChange = async (newData: {
    pedidoId: number;
    id_user: number;
    estadoId: number
}) => {
    const { data } = await ApiInstances("current").post(`cambioestadopedido/`, newData);
    return data;
};