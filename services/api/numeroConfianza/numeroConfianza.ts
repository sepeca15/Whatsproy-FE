import ApiInstances from "@/services/axios/axiosConfig";

export const create = async (info : {nombre: string, telefono: string}) => {
    const { data } = await ApiInstances("global").post("numeroConfianza", info);
    return data;
};

export const getAllNumbers = async () => {
    const { data } = await ApiInstances("global").get("numeroConfianza/");
    return data;
};

export const deleteNumber = async (numberId : number) => {
    const { data } = await ApiInstances("global").delete("numeroConfianza/" + numberId);
    return data;
};
