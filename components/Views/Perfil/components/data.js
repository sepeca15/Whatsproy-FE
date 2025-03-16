// data.js
export const months = [
  "E",
  "F",
  "M",
  "A",
  "M",
  "J",
  "J",
  "A",
  "S",
  "O",
  "N",
  "D",
];

export const ordersData = [300, 600, 15, 30, 75, 60, 15, 45, 30, 60, 150, 30];
export const completedData = [25, 55, 10, 25, 70, 55, 20, 40, 25, 55, 10, 25];

//funcion para cargar los arrays de datos months, ordersData y completedData con un llamado a una api
// export const getData = async () => {
//   try {
//     const response = await fetch('https://jsonplaceholder.typicode.com/posts'); //Ejemplo
//     const data = await response.json();
//     const orders = data.map((item) => item.id);
//     const completed = data.map((item) => item.userId);
//     return { months, ordersData: orders, completedData: completed };
//     }
//     catch (error) {
//         console.error(error);
//         }
// }
