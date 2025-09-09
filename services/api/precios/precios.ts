import ApiInstances from "@/services/axios/axiosConfig";
import { Precio } from "./types";

export const getPreciosByEspacio = async (espacioId: number): Promise<Precio[]> => {
    const { data } = await ApiInstances("current").get(`espacios/precios/${espacioId}`);
    return data;
};

export const createPrecio = async ({
    espacioId,
    tipo_intervalo,
    duracion_intervalo,
    precio,
}: {
    espacioId: number;
    tipo_intervalo: "minutos" | "horas" | "dias";
    duracion_intervalo: number;
    precio: number;
}): Promise<Precio> => {
    const { data } = await ApiInstances("current").post(`espacios/precios/${espacioId}`, {
        tipo_intervalo,
        duracion_intervalo,
        precio,
    });
    return data;
};

export const updatePrecio = async ({
    id,
    tipo_intervalo,
    duracion_intervalo,
    precio,
}: {
    id: number;
    tipo_intervalo?: "minutos" | "horas" | "dias";
    duracion_intervalo?: number;
    precio?: number;
}): Promise<Precio> => {
    const { data } = await ApiInstances("current").put(`espacios/precios/${id}`, {
        tipo_intervalo,
        duracion_intervalo,
        precio,
    });
    return data;
};

export const deletePrecio = async (id: number): Promise<void> => {
    await ApiInstances("current").delete(`espacios/precios/${id}`);
};
