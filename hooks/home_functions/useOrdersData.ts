// import { useState, useEffect } from "react";
// import api from "@/services/api/admin";

// const getFormattedDate = (): string => new Date().toISOString().split("T")[0];

// const getTimeAgo = (date: string): string => {
//   const now = new Date();
//   const createdAt = new Date(date);
//   const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

//   const minutes = Math.floor(diffInSeconds / 60);
//   const hours = Math.floor(minutes / 60);
//   const days = Math.floor(hours / 24);

//   if (days > 0) return `hace ${days} día${days > 1 ? "s" : ""}`;
//   if (hours > 0) return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
//   if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
//   return "hace unos segundos";
// };

// // Tipos
// interface Order {
//   id: number;
//   createdAt: string;
//   total: number;
//   status: string;
//   infoLinesJson: string;
// }

// interface FormattedOrder {
//   id: number;
//   time: string;
//   amount: string;
//   icon: string;
//   address: string;
//   status: string;
// }

// const useOrdersData = () => {
//   const [ordersCount, setOrdersCount] = useState(0);
//   const [dailyRevenue, setDailyRevenue] = useState(0);
//   const [lastOrders, setLastOrders] = useState<FormattedOrder[]>([]);
//   const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
//   const [rawOrders, setRawOrders] = useState<Order[]>([]);
//   const [isFetching, setIsFetching] = useState(false);

//   const getOrders = async () => {
//     setIsFetching(true);
//     try {
//       const response = await api.order.lastThreeOrders();
//       // console.log("recibo", response.data);
//       setRawOrders(response.data);
//       const formattedOrders = response.data.map((order: Order): FormattedOrder => {
//         let address = "No disponible";
//         let status = "sin status";

//         try {
//           const infoExtra = JSON.parse(order.infoLinesJson);
//           address = infoExtra.Direccion?.trim() || "No disponible";
//           status = order.status?.trim() || "sin status";
//         } catch (error) {
//           console.error("Error parsing infoLinesJson:", error);
//         }

//         return {
//           id: order.id,
//           time: getTimeAgo(order.createdAt),
//           amount: `$${order.total}`,
//           icon: "receipt",
//           address,
//           status,
//         };
//       });

//       setLastOrders(formattedOrders);
//     } catch (error) {
//       console.error("Error al obtener pedidos:", error);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   const getOrdersByDate = async () => {
//     setIsFetching(true);
//     try {
//       const today = getFormattedDate();
//       const response = await api.order.getOrdersByDate(today);
//       setOrdersCount(response.ordersDay || 0);
//       // console.log("Pedidos del día:", response.ordersDay);
//     } catch (error) {
//       console.error("Error al obtener pedidos por fecha:", error);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   const moneyinday = async () => {
//     setIsFetching(true);
//     try {
//       const today = getFormattedDate();
//       const response = await api.order.moneyinday(today);
//       setDailyRevenue(response.ganancia ?? 0);
//     } catch (error) {
//       console.error("Error al obtener ingresos del día:", error);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   const getPendingOrders = async () => {
//     setIsFetching(true);
//     try {
//       const response = await api.order.getPending();
//       setPendingOrders(response.data);
//       // console.log("Pedidos pendientes:", response.data);
//     } catch (error) {
//       console.error("Error al obtener pedidos pendientes:", error);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   const refreshData = async () => {
//     setIsFetching(true);
//     await Promise.all([getOrders(), getOrdersByDate(), moneyinday(), getPendingOrders()]);
//     setIsFetching(false);
//   };

//   useEffect(() => {
//     refreshData();
//   }, []);

//   return {
//     ordersCount,
//     dailyRevenue,
//     lastOrders,
//     loading: isFetching,
//     refreshData,
//     rawOrders,
//     pendingOrders,
//   };
// };

// export default useOrdersData;
