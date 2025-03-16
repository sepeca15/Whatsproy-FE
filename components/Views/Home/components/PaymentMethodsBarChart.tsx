// import React from 'react';
// import { View, Dimensions } from 'react-native';
// import { BarChart } from 'react-native-chart-kit';
// import { Colors } from "../../../constants/Colors"; // Ajusta según tu paleta de colores

// const PaymentMethodsBarChart = ({ paymentMethods }) => {

//   const chartData = {
//     labels: paymentMethods.map((item) => item.method),
//     datasets: [
//       {
//         data: paymentMethods.map((item) => item.count),
//         color: (opacity = 1) => `rgba(7, 94, 84, ${opacity})`, // Color de las barras
//       },
//     ],
//   };

//   return (
//     <View style={{ alignItems: 'center' }}>
//       <BarChart
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
//         style={{ marginVertical: 8 }}
//       />
//     </View>
//   );
// };

// export default PaymentMethodsBarChart;
