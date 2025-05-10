// import { Center, Select, View, VStack } from "native-base";
// import { styles } from "./Step2Styles";
// import InputField from "@/components/InputField";
// import CustomText from "@/components/CustomText";
// import { useEffect, useState, useTransition } from "react";
// import api from "@/services/api/admin";
// import * as Progress from "react-native-progress";
// import { Colors } from "@/constants/Colors";
// import AlertText from "../AlertText";
// import { useIntl } from "react-intl";
// import { Alert } from "react-native";

// interface IDataStep2 {
//   hora_apertura: string;
//   hora_cierre: string;
//   tipoServicioId: number | null;
// }

// interface IStep2 {
//   formData: IDataStep2;
//   handleInputChange: (key: string, value: any) => void;
//   errors: any;
// }

// const Step2 = ({ formData, errors, handleInputChange }: IStep2) => {
//   const [services, setServices] = useState<any[]>([]);
//   const [isPending, startTransition] = useTransition();
//   const intl = useIntl();

//   const isValidTimeFormat = (time: string): boolean => {
//     const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
//     return timeRegex.test(time);
//   };

//   const getAllServices = async () => {
//     try {
//       const data = await api.typeServices.getAll();

//       startTransition(() => {
//         if (data.data) {
//           setServices(data.data);
//         }
//       });
//     } catch (error: any) {
//       console.log(error.response.data.message);
//     }
//   };

//   useEffect(() => {
//     getAllServices();
//   }, []);

//   try {
//     // Código relacionado con el error  error E_IAP_NOT_AVAILABLE Prueba_borrar
//   } catch (error: any) {
//     if (error.code === "E_IAP_NOT_AVAILABLE") {
//       Alert.alert(
//         "IAP no disponible",
//         "Las compras dentro de la aplicación no están disponibles en este entorno."
//       );
//     } else {
//       console.error("Error de IAP:", error);
//     }
//   }

//   return (
//     <VStack space={4}>
//       <View>
//         <InputField
//           label={intl.formatMessage({
//             id: "openingTime",
//             defaultMessage: "Opening Time",
//           })}
//           placeholder={intl.formatMessage({
//             id: "enterOpeningTime",
//             defaultMessage: "E.g.: 09:00",
//           })}
//           value={formData.hora_apertura}
//           onChangeText={(value) => handleInputChange("hora_apertura", value)}
//           onBlur={() => {
//             if (!isValidTimeFormat(formData.hora_apertura)) {
//               handleInputChange("hora_apertura", "");
//               alert(
//                 intl.formatMessage({
//                   id: "invalidTimeFormat",
//                   defaultMessage: "Invalid time format. Use HH:mm (24 hours).",
//                 }),
//               );
//             }
//           }}
//         />

//         {errors.hora_apertura && <AlertText text={errors.hora_apertura} />}
//       </View>
//       <View>
//         <InputField
//           label={intl.formatMessage({
//             id: "closingTime",
//             defaultMessage: "Closing Time",
//           })}
//           placeholder={intl.formatMessage({
//             id: "enterClosingTime",
//             defaultMessage: "E.g.: 10:00",
//           })}
//           value={formData.hora_cierre}
//           onChangeText={(value) => handleInputChange("hora_cierre", value)}
//           onBlur={() => {
//             if (!isValidTimeFormat(formData.hora_cierre)) {
//               handleInputChange("hora_cierre", "");
//               alert(
//                 intl.formatMessage({
//                   id: "invalidTimeFormat",
//                   defaultMessage: "Invalid time format. Use HH:mm (24 hours).",
//                 }),
//               );
//             }
//           }}
//         />
//         {errors.hora_cierre && <AlertText text={errors.hora_cierre} />}
//       </View>
//       {isPending ? (
//         <Center>
//           <Progress.Circle
//             color={Colors.light.primary}
//             indeterminate={true}
//             size={20}
//           />
//         </Center>
//       ) : (
//         <View>
//           <CustomText style={{ marginBottom: 6 }}>
//             {intl.formatMessage({
//               id: "serviceType",
//               defaultMessage: "Service Type",
//             })}
//           </CustomText>
//           <Select
//             selectedValue={formData.tipoServicioId?.toString()}
//             placeholder={intl.formatMessage({
//               id: "selectServiceType",
//               defaultMessage: "Select a service type",
//             })}
//             onValueChange={(value) =>
//               handleInputChange("tipoServicioId", value)
//             }
//           >
//             {services.map((service) => {
//               return (
//                 <Select.Item
//                   key={service.id}
//                   label={service.nombre}
//                   value={service.id.toString()}
//                 />
//               );
//             })}
//           </Select>
//           {errors.tipoServicioId && <AlertText text={errors.tipoServicioId} />}
//         </View>
//       )}
//     </VStack>
//   );
// };

// export default Step2;
