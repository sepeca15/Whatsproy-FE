import ApiInstances from "@/services/axios/axiosConfig";



export const createStatus = async (statusData: any) => {
    const { data } = await ApiInstances("current").post(`estado`, statusData);
    return data;
};

export const findAllStatus = async () => {
    const { data } = await ApiInstances("current").get(`estado/`);
    return data;
};

export const findStatus = async (statusId: number) => {
    const { data } = await ApiInstances("current").get(`estado/` + statusId);
    return data;
};

export const updateStatus = async (statusId: any, newData: any) => {
    const { data } = await ApiInstances("current").patch(`estado/` + statusId, newData);
    return data;
};

export const deleteStatus = async (statusId: number) => {
    const { data } = await ApiInstances("current").delete(`estado/` + statusId);
    return data;
};