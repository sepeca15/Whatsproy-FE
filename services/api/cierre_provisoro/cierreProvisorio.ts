import ApiInstances from "@/services/axios/axiosConfig";

export const createCierreProvisorio = async (info: {fecha_inicio: Date, fecha_fin: Date, empresaId: number}) => {
    const { data } = await ApiInstances("global").post('cierreProvisorio/', info);

    return data;
};

export const getAllCierreProvisorio = async (empresaId: number) => {
    const { data } = await ApiInstances("global").get('cierreProvisorio/all/' + empresaId);

    return data;
};

export const deleteCierreProvisorio = async (cierreId: number) => {
    const { data } = await ApiInstances("global").delete('cierreProvisorio/' + cierreId);

    return data;
};
