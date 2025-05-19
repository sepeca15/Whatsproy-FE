import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useUser } from "./redux/useUser";

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [receivedNotification, setReceivedNotification] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  Notifications.setNotificationHandler({
    handleNotification: async () => {
      if (user?.id) {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      }

      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    },
  });

  const registerForPushNotifications = async () => {
    setLoading(true);
    try {
      if (!Device.isDevice) {
        console.log(
          "Las notificaciones push solo están disponibles en dispositivos físicos."
        );
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permiso de notificación denegado");
        return;
      }

      const token = (await Notifications.getDevicePushTokenAsync()).data;
      setExpoPushToken(token);
    } catch (error) {
      console.error("Error al obtener el token de push:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      registerForPushNotifications();

      const foregroundSubscription =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notificación recibida en primer plano:", notification);
        });

      const responseListener =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const { notification } = response;
          console.log(
            "Respuesta a la notificación (notificación abierta):",
            notification
          );
        });

      return () => {
        foregroundSubscription.remove();
        responseListener.remove();
      };
    }
  }, [user?.id]);

  const scheduleNotification = async (notification: any) => {
    try {
      if (notification.request.content.data?.processed) return;

      notification.request.content.data = {
        ...notification.request.content.data,
        processed: true,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.request.content.title || "Notificación",
          body:
            notification.request.content.body ||
            "Tienes una nueva notificación.",
          data: notification.request.content.data || {},
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error al programar la notificación:", error);
    }
  };

  useEffect(() => {
    if (receivedNotification) {
      scheduleNotification(receivedNotification);
      setReceivedNotification(null);
    }
  }, [receivedNotification]);

  return { expoPushToken, loading };
};
