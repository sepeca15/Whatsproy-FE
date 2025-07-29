import ApiInstances from "@/services/axios/axiosConfig";
import { Espacio } from "./types"; // Asegúrate de tener este tipo definido según la entidad

export const getEspacios = async () => {
  const { data } = await ApiInstances("current").get("espacios");
  return data;
};

export const getEspacioById = async (id: number) => {
  const { data } = await ApiInstances("current").get(`espacios/${id}`);
  return data;
};

export const createEspacio = async (info: Partial<Espacio>) => {
  const { data } = await ApiInstances("current").post("espacios", info);
  return data;
};

export const updateEspacio = async (id: number, info: Partial<Espacio>) => {
  const { data } = await ApiInstances("current").put(`espacios/${id}`, info);
  return data;
};

export const deleteEspacio = async (id: number) => {
  const { data } = await ApiInstances("current").delete(`espacios/${id}`);
  return data;
};
