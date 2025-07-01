import ApiInstances from "@/services/axios/axiosConfig";

export const getAll = async () => {
    const { data, status } = await ApiInstances("current").get(`horario`);
    return data;
};

export const getAllDailyMenu = async () => {
    const { data } = await ApiInstances("current").get(`horario/daily-menu`);
    return data;
};

export const createDailySchedule = async (newSchedule: any) => {
    console.log("newSchedule", newSchedule)
    const { data } = await ApiInstances("current").post(`horario/daily-menu`, newSchedule);
    return data;
};

export const updateDailySchedule = async (id: any, newSchedule: any) => {
    const { data } = await ApiInstances("current").put(`horario/daily-menu/${id}`, newSchedule);
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