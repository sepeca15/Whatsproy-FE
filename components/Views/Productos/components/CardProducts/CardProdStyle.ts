import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    padding: 5,
    position:'relative',

  },
  iconConteiner: {

    backgroundColor: "#fff",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    padding: 5,

    height: 100,
  },
  icon: {
    width: "100%",
    height: "100%",
    marginRight: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    height: 100,
  },
  image: {
    width: '30%',
    height: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: '5%',
  },

  content: {
    flex: 1,
  },
  overlay1: {
    position: 'absolute',
    height: '110%',
    width: "85%",
    backgroundColor:'transparent',
    zIndex:100
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  price: {
    fontSize: 14,
    color: "#27ae60",
    marginVertical: 5,
  },
  description: {
    fontSize: 12,
    color: "#777",
  },
  moreButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  modalIcon: {
    marginRight: 10,
  },
  deleteText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  modalOptionText: {
    fontSize: 16,
  },
  disabledLabel: {
    position: "absolute",
    top: "45%",
    left: "1.3%",
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
    width: '30%',
    alignItems: 'center',

  },
  disabledText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },


  imagenspiner: {
    width: 100,  // Reduce el tamaño del contenedor
    height: 100, // Mantiene la proporción
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255,499, 0.8)', // Opcional: Fondo con transparencia
    borderRadius: 10, // Bordes redondeados
    position: 'absolute', // Asegura que se superponga a la imagen si es necesario
    top: '25%',
    left: '7%',
    transform: [{ translateX: -25 }, { translateY: -25 }], // Centra correctamente
  },
  spinner: {
    width: 40, // Tamaño del spinner más pequeño
    height: 40,
  },
  // imagePlaceholder: {
  //   width: 100,  // Reduce el tamaño del contenedor
  //   height: 100, // Mantiene la proporción
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: "#ddd",
  //   borderRadius: 10, // Bordes redondeados
  //   position: 'absolute', // Asegura que se superponga a la imagen si es necesario
  //   top: '0%',
  //   left: '0%',
  //   transform: [{ translateX: -25 }, { translateY: -25 }], // Centra correctamente
  // },
  animationContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255,499, 0.8)',
    borderRadius: 10,
    position: 'absolute',
    top: '25%',
    left: '7%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  animation: {
    width: 100,
    height: 100,
  },
});
