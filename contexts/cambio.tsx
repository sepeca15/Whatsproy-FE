// import React, { createContext, useContext, useState } from "react";
// import { Box, Text, VStack, HStack, Icon, useToast } from "native-base";
// import { Ionicons } from "@expo/vector-icons";
// import { RootSiblingParent } from "react-native-root-siblings";
// import Toast from "react-native-toast-message";


// const ToastContext = createContext<any>(null);


// export const ToastProvider = ({ children }: any) => {
//   console.log("holaaaa");
//   const toast = useToast();

//   const showToast = ({ title, description, status }: any) => {
//     console.log("showToast", { title, description, status });
//     Toast.show({
//       type: status,
//       text1: title,
//       text2: description,
//       position: "top",
//       visibilityTime: 3000,
//       autoHide: true,
//       topOffset: 50,
//     });
//   };

//   return (
//     <RootSiblingParent>
//       <ToastContext.Provider value={{ showToast }}>
//         {children}
//       </ToastContext.Provider>
//     </RootSiblingParent>
//   );
// };

// export const useToastContext = () => useContext(ToastContext);
