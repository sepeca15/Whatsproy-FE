import ApiInstances from "@/services/axios/axiosConfig";

export const getAll = async () => {
    const { data, status } = await ApiInstances("current").get(`horario`);
    return data;
};

export const create = async (newSchedule: any) => {
    const { data, status } = await ApiInstances("current").post(`horario`, newSchedule);
    return data;
};

export const remove = async (id: any) => {
    const { status } = await ApiInstances("current").delete(`horario/${id}`);
    return status === 200;
};