// data.js
import { MonthlySalesData } from './TendenciaVentas/types';

export const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const completedData = [30, 50, 40, 70, 90, 80, 100, 95, 85, 110, 120, 130];
export const revenueData = [3000, 5000, 4000, 7000, 9000, 8000, 10000, 9500, 8500, 11000, 12000, 13000];

export const data: MonthlySalesData[] = [
    { month: 'Ene', categories: { Hamburguesas: 20, Chorizo: 15, Salchichas: 10 } },
    { month: 'Feb', categories: { Hamburguesas: 30, Chorizo: 25, Salchichas: 20 } },
    { month: 'Mar', categories: { Hamburguesas: 25, Chorizo: 20, Salchichas: 15 } },
    { month: 'Abr', categories: { Hamburguesas: 40, Chorizo: 35, Salchichas: 30 } },
    { month: 'May', categories: { Hamburguesas: 50, Chorizo: 45, Salchichas: 40 } },
    { month: 'Jun', categories: { Hamburguesas: 35, Chorizo: 30, Salchichas: 25 } },
];

export const categories = ['Hamburguesas', 'Chorizo', 'Salchichas'];
export const colors = ['#FF6384', '#36A2EB', '#FFCE56'];

export const totalValues = data.map(d => Object.values(d.categories).reduce((a, b) => a + b, 0));

// Función para cargar los arrays de datos months, ordersData y completedData con un llamado a una API
// export const getData = async () => {
//   try {
//     const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Ejemplo
//     const data = await response.json();
//     const orders = data.map((item) => item.id);
//     const completed = data.map((item) => item.userId);
//     return { months, ordersData: orders, completedData: completed };
//   } catch (error) {
//     console.error(error);
//   }
// };