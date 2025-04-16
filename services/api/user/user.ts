import ApiInstances from "@/services/axios/axiosConfig";
import { IUserCreate, IUserUpdate } from "./user.types";

export const createUser = async (dataUser: IUserCreate) => {
  const { data } = await ApiInstances("global").post(`usuario/`, dataUser);

  return data;
};

export const findUser = async (usuarioId: number) => {
  const { data } = await ApiInstances("global").get(`usuario/${usuarioId}`);

  return data;
};

export const findAllUsers = async (empresaId: number) => {
  const { data } = await ApiInstances("global").get(`usuario/` + empresaId);

  return data;
};

export const updateUser = async (usuarioId: number, dataUser: IUserUpdate) => {
  const { data } = await ApiInstances("global").patch(
    `usuario/${usuarioId}`,
    dataUser,
  );

  return data;
};

export const deleteUser = async (usuarioId: number) => {
  const { data } = await ApiInstances("global").delete(`usuario/` + usuarioId);

  return data;
};
