import ApiInstances from "@/services/axios/axiosConfig";
import ProductoTypes from "./types";
import { UpdatePricesDto } from "./product.types";

export const findAllProducts = async () => {
  const { data, status } = await ApiInstances("current").get(`producto`);
  return data;
};

export const isEmpresaAvailable = async () => {
  const { status } = await ApiInstances("current").get(`producto`);
  return status;
};

export const findProductsWithQuery = async (query: string) => {
  const data = await ApiInstances("current").get(
    `producto/findWithQuery?query=${query}`,
  );
  return data;
};


export const findAllDailyMenu = async (query: string) => {
  const data = await ApiInstances("current").get(
    `producto/findAllDailyMenu?query=${query}`,
  );
  return data;
};

export const find = async (id: number) => {
  const data = await ApiInstances("current").get(`producto/${id}`);
  return data;
};

export const update = async (id: number, product: ProductoTypes) => {
  const data = await ApiInstances("current").put(`producto/${id}`, product);
  return data;
};

export const updatePrices = async (info: UpdatePricesDto) => {
  const data = await ApiInstances("current").post(`producto/actualizar-precios`, info);
  return data?.data;
};
export const deletProd = async (id: number) => {
  const data = await ApiInstances("current").delete(`producto/${id}`);
  return data;
};

export const create = async (product: ProductoTypes) => {
  console.log("mando a la api", product)
  const data = await ApiInstances("current").post(`producto`, product);
  return data;
};
