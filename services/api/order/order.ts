import ApiInstances from "@/services/axios/axiosConfig";
import { CreateOrderDTO } from "./order.type";

export const getDetailsOfOrder = async (id: any) => {
  const { data } = await ApiInstances("current").get("pedido/details/" + id);
  return data;
};

export const getOrderForCalendar = async (selectedDate: string) => {
  const { data } = await ApiInstances("current").get(
    "pedido/calendar/formatCalendar/" + selectedDate,
  );

  return data;
};

export const getAvailableDates = async (fecha: string) => {
  const { data } = await ApiInstances("current").get(
    `pedido/calendar/dates-avaiable?fecha=${fecha}&withPast=true`,
  );
  return data;
};

export const getAllFinished = async (offset: number, limit: number) => {
  const { data } = await ApiInstances("current").get(`pedido/finished?offset=${offset}&limit=${limit}`);
  return data;
};

export const getAllPending = async (offset: number, limit: number) => {
  const { data } = await ApiInstances("current").get(`pedido/pending?offset=${offset}&limit=${limit}`);
  return data;
};

export const getAllActive = async (offset: number, limit: number) => {
  const { data } = await ApiInstances("current").get(`pedido/active?offset=${offset}&limit=${limit}`);
  return data;
};

export const subOrderStatus = async () => {
  const { data } = await ApiInstances("current").get("pedido/orderPlanStatus");
  return data;
};


export const confirmOrder = async (id: number) => {
  const { data } = await ApiInstances("current").get("pedido/confirm/" + id);

  return data;
};

export const createOrder = async (info: CreateOrderDTO) => {
  const { data } = await ApiInstances("current").post("pedido/", info);
  return data;
};

export const getNextDateAvailable = async () => {
  const { data } = await ApiInstances("current").get(
    "pedido/calendar/next-date-avaiable",
  );
  return data;
};

export const removeOrder = async (id: number) => {
  const { data } = await ApiInstances("current").delete("pedido/" + id);

  return data;
};

export const getMoneyInDay = async (date: string) => {
  const { data } = await ApiInstances("current").get(
    `/pedido/stats/momeyInDay/${date}`,
  );
  return data;
};

export const lastThreeOrders = async () => {
  const { data } = await ApiInstances("current").get("/pedido/stats/lastThree");
  return data;
};

export const getOrdersByDate = async (date: string) => {
  const { data } = await ApiInstances("current").get(
    `/pedido/stats/ordersDay/${date}`,
  );
  return data;
};
