import { useEffect, useRef } from "react";
import { Vibration } from "react-native";
import * as Notifications from "expo-notifications";
import { getNotificationPreference } from "@/utils/notificaciones/notificationsStorage";
import useOrdersData from "@/hooks/home_functions/useOrdersData";

let lastOrderCount = 0;

const PedidosListener = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { rawOrders, refreshData } = useOrdersData();

  useEffect(() => {
    const checkForNewOrders = async () => {
      const isEnabled = await getNotificationPreference();
      if (!isEnabled) return; // Si las notificaciones están desactivadas, no hacemos nada

      await refreshData(); // Refresca los datos (incluye rawOrders)

      if (rawOrders && rawOrders.length > lastOrderCount) {
        const newOrdersCount = rawOrders.length - lastOrderCount;
        lastOrderCount = rawOrders.length;

        Vibration.vibrate();

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "📦 ¡Nuevo pedido recibido!",
            body: `Tienes ${newOrdersCount} nuevo(s) pedido(s).`,
            sound: true,
            data: { icon: "../../constants/logo.jpeg" }, // Agregar un icono en los datos
          },
          trigger: null,
        });
      } else if (rawOrders) {
        lastOrderCount = rawOrders.length;
      }
    };

    intervalRef.current = setInterval(checkForNewOrders, 10000); // cada 10 seg

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [rawOrders]);

  return null;
};

export default PedidosListener;
