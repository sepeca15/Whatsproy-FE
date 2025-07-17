// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { Colors } from "../../../../constants/Colors";

// const DesignSelector: React.FC = () => {
//   const [selectedLayout, setSelectedLayout] = useState("classic");

//   const handleLayoutChange = (layout: string) => {
//     setSelectedLayout(layout);
//     // Aquí puedes almacenar el diseño seleccionado, por ejemplo, en el localStorage o en un contexto
//     // Si lo usas con Redux, lo despacharías a tu store.
//   };

//   return (
//     <View style={styles.container}>
//       <Text allowFontScaling={false} style={styles.header}>Elige un diseño para la página de inicio</Text>
      
//       <TouchableOpacity
//         onPress={() => handleLayoutChange("classic")}
//         style={styles.layoutButton}
//       >
//         <Text allowFontScaling={false} style={styles.layoutText}>Diseño Clásico</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity
//         onPress={() => handleLayoutChange("modern")}
//         style={styles.layoutButton}
//       >
//         <Text allowFontScaling={false} style={styles.layoutText}>Diseño Moderno</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity
//         onPress={() => handleLayoutChange("minimal")}
//         style={styles.layoutButton}
//       >
//         <Text allowFontScaling={false} style={styles.layoutText}>Diseño Minimalista</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Colors.light.background,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   layoutButton: {
//     backgroundColor: Colors.light.primary,
//     padding: 10,
//     margin: 10,
//     borderRadius: 5,
//   },
//   layoutText: {
//     color: "white",
//     fontSize: 18,
//   },
// });

// export default DesignSelector;
