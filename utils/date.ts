import { IInfoItem } from "@/components/Views/Calendar/types";
import moment from "moment";

export const removeTimeZone = (dateString: any) => {
  const date = moment(dateString);
  const dateWithoutTimeZone = date.format("YYYY-MM-DD HH:mm:ss");
  return dateWithoutTimeZone;
};

export const getHourNumber = (hourStr: string): number => {
  const hour = hourStr?.split(":")[0];
  return Number(hour ?? 0);
};

export const removeTime = (hourStr: string): number => {
  const hour = hourStr?.split(":")[0];
  return Number(hour ?? 0);
};

export const removeAmPm = (time: string) => {
  return time.replace(/\s?(AM|PM|am|pm)/g, "").trim();
};

export const filterOnlyHours = (items: any) => {
  return items.filter((item: any) => /^\d{1,2}:\d{2}$/.test(item));
};


export type OrderPerDays = {
  [date: string]: IInfoItem[];
};

export const ordenarPedidosPorHora = (orderPerDays: OrderPerDays): OrderPerDays => {
  const ordenado: OrderPerDays = {};

  for (const fecha in orderPerDays) {
    ordenado[fecha] = (orderPerDays[fecha] ?? []).sort((a, b) => {
      const fechaA = moment(a.fecha);
      const fechaB = moment(b.fecha);
      return fechaA.diff(fechaB);
    });
  }

  return ordenado;
};