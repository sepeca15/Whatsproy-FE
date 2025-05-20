// // src/contexts/NotificationPreferenceContext.tsx
// import React, { createContext, useState, useEffect, useContext } from "react";
// import { getNotificationPreference, setNotificationPreference } from "@/utils/notificaciones/notificationsStorage";

// interface NotificationContextType {
//   enabled: boolean;
//   toggle: (v: boolean) => Promise<void>;
// }

// const NotificationContext = createContext<NotificationContextType>({
//   enabled: false,
//   toggle: async () => {},
// });

// export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [enabled, setEnabled] = useState(false);

//   // Leo la preferencia solo UNA VEZ al montar
//   useEffect(() => {
//     (async () => {
//       const pref = await getNotificationPreference();
//       setEnabled(pref);
//     })();
//   }, []);

//   const toggle = async (v: boolean) => {
//     setEnabled(v);
//     await setNotificationPreference(v);
//   };

//   return (
//     <NotificationContext.Provider value={{ enabled, toggle }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotificationPreference = () => useContext(NotificationContext);
