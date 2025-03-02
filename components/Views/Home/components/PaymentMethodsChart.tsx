// import React from 'react';
// import { View, Dimensions } from 'react-native';
// import { PieChart } from 'react-native-chart-kit';
// import { Colors } from "../../../constants/Colors"; // Ajusta según tu paleta de colores

// const PaymentMethodsChart = ({ paymentMethods }) => {
//   const chartData = paymentMethods.map((item) => ({
//     name: item.method,
//     population: item.count,
//     color: Colors.light.primary, // Puedes asignar colores específicos a cada método
//     legendFontColor: "#7F7F7F",
//     legendFontSize: 15,
//   }));

//   return (
//     <View style={{ alignItems: 'center' }}>
//       <PieChart
//         data={chartData}
//         width={Dimensions.get('window').width - 32}
//         height={220}
//         chartConfig={{
//           backgroundColor: "#ffffff",
//           backgroundGradientFrom: "#ffffff",
//           backgroundGradientTo: "#ffffff",
//           decimalPlaces: 0,
//           color: (opacity = 1) => `rgba(7, 94, 84, ${opacity})`,
//           style: {
//             borderRadius: 16,
//           },
//         }}
//         accessor="population"
//         style={{ marginVertical: 8 }}
//       />
//     </View>
//   );
// };

// export default PaymentMethodsChart;
