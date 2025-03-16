import ApiInstances from "@/services/axios/axiosConfig";

export const resumenVentas = async () => {
  try {
    const { data } = await ApiInstances("current").get(
      `/pedido/stats/lastTime`,
    );
    return data;
  } catch (error) {
    console.error("Error al obtener el resumen de ventas", error);
    throw error;
  }
};
