import { months } from "../../Pedidos/components/data";
export interface Product {
  id: number;
  title: string;
  price: number;
  currency: string;
  duration: string;
  description: string;
  imageUrl: string;
  category: string;
  daydata: DayslySalesData;
  disponible?: boolean;
  monthdata: DayslySalesData;
  rating: number;
  reviews: number;
  currency_id?: string;
  tags: string[];
  disponible: string;
}

export interface SalesData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

export interface CategoryData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

export interface SatisfactionData {
  data: number[];
}

interface Dataset {
  data: number[];
}

export interface DayslySalesData {
  labels: string[];
  datasets: Dataset[];
}

export interface ProductDetailProps {
  product: Product;
  salesData: SalesData;
  categoryData: CategoryData;
  satisfactionData: SatisfactionData;
}

interface ProductParams {
  id: string;
  title: string;
  price: string;
  currency_id?: string;
  currency: string;
  duration: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: string;
  reviews: string;
  tags?: string;
  daydata: DayslySalesData;
  monthdata: DayslySalesData;
  disponible: string;
  empresa_id: string;
}

export { ProductParams };
