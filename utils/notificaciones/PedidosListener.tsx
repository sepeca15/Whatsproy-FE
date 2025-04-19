// import { useEffect, useRef } from "react";
// import { Vibration } from "react-native";
// import * as Notifications from "expo-notifications";
// import useOrdersData from "@/hooks/home_functions/useOrdersData";
// import { useNotificationPreference } from "@/contexts/NotificationPreferenceContext";

// const PedidosListener = () => {
//   const lastOrderCount = useRef(0);
//   const isMounted = useRef(true);
//   const { rawOrders, refreshData } = useOrdersData();
//   const { enabled: isEnabled } = useNotificationPreference();

//   useEffect(() => {
//     isMounted.current = true;
//     const poll = async () => {
//       try {
//         if (!isEnabled) return; 
//         await refreshData();
//         if (!isMounted.current) return;

//         if (rawOrders.length > lastOrderCount.current) {
//           const diff = rawOrders.length - lastOrderCount.current;
//           lastOrderCount.current = rawOrders.length;
//           Vibration.vibrate();
//           await Notifications.presentNotificationAsync({
//             title: "📦 Nuevo pedido",
//             body: `Tienes ${diff} pedido(s) nuevo(s).`,
//           });
//         } else {
//           lastOrderCount.current = rawOrders.length;
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         if (isMounted.current) setTimeout(poll, 100000000);
//       }
//     };
//     poll();
//     return () => { isMounted.current = false; };
//   }, [isEnabled]);

//   return null;
// };

// export default PedidosListener;
