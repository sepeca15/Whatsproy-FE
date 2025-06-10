import ApiInstances from "@/services/axios/axiosConfig";
import { CreateOrderDTO } from "./order.type";

export const getDetailsOfOrder = async (id: any) => {
  const { data } = await ApiInstances("current").get("pedido/details/" + id);
  return data;
};

export const getStatitics = async (filterType: any) => {
  const { data } = await ApiInstances("current").get("pedido/statistics?type=" + filterType);
  return data;
};

export const getOrderForCalendar = async (selectedDate: string, userId?: string) => {
  const { data } = await ApiInstances("current").get(
    "pedido/calendar/formatCalendar/" + selectedDate + `?userId=${userId}`,
  );

  return data;
};

export const getAvailableDates = async (fecha: string, workerId?: string) => {
  const { data } = await ApiInstances("current").get(
    `pedido/calendar/dates-avaiable?fecha=${fecha}&withPast=true&userId=${workerId}`,
  );
  return data;
};

export const getAvailableDatesByMonth = async (anio: string, mes: string, workerId?: string) => {
  const { data } = await ApiInstances("current").get(
    `pedido/calendar/dates-avaiable-by-month?anio=${anio}&mes=${mes}&userId=${workerId}`,
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
  console.log('enviare', id );
  
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

export const getNextDateAvailableForSingleDay = async (fecha: string, selectedWorkerId?: string) => {
  console.log("xd", fecha)
  const { data } = await ApiInstances("current").get(
    `pedido/calendar/dates-avaiable?fecha=${fecha}&withPast=false&userId${selectedWorkerId}`,
  );
  return data;
};

export const removeOrder = async (id: number, reason?: string) => {
  const { data } = await ApiInstances("current").delete("pedido/" + id, { data: { reason: reason } });

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

export const filterOrderWithQuery = async (query: string, selectedInfoLine: string) => {
  const { data } = await ApiInstances("current").get(
    `/pedido/filter/searchWIthQuery?query=${query}&keyInfoline=${selectedInfoLine}`,
  );

  return data;
};

