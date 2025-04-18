import ApiInstances from "@/services/axios/axiosConfig";


export const creteStatusChange = async (newData: any) => {
    const { data } = await ApiInstances("current").post(`cambioestadopedido/`, newData);
    return data;
};