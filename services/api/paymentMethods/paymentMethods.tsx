
import ApiInstances from "@/services/axios/axiosConfig";

export const getPaymentMethods = async () => {
  const { data } = await ApiInstances("current").get("payment-methods/getAll");
  return data;
};


export const editPaymentMethod = async (id: any, info: any) => {
  const { data } = await ApiInstances("current").put(`payment-methods/${id}`, info);
  return data;
};