import AsyncStorage from "@react-native-async-storage/async-storage";



// Clave utilizada para almacenar la preferencia de notificaciones
const NOTIFICATION_KEY = "notifications_enabled";

// Función para guardar la preferencia de notificaciones (habilitado o deshabilitado)
export const saveNotificationPreference = async (enabled: boolean) => {
    try {
        // Guarda la preferencia como un string JSON en AsyncStorage
        await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(enabled));
    } catch (e) {
        // Manejo de errores en caso de que falle el almacenamiento
        console.error("Error al guardar preferencia de notificaciones", e);
    }
};

// Función para obtener la preferencia de notificaciones
export const getNotificationPreference = async (): Promise<boolean> => {
    try {
        // Obtiene el valor almacenado en AsyncStorage
        const value = await AsyncStorage.getItem(NOTIFICATION_KEY);
        // Si existe un valor, lo parsea como booleano, de lo contrario devuelve false
        return value ? JSON.parse(value) : false;
    } catch (e) {
        // Manejo de errores en caso de que falle la obtención del dato
        console.error("Error al obtener preferencia de notificaciones", e);
        return false;
    }
};
