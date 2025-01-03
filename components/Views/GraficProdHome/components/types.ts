export interface Product {
  id: number;
  title: string;
  price: number;
  currency: string;
  duration: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviews: number;
  tags: string[];
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

export interface ProductDetailProps {
  product: Product;
  salesData: SalesData;
  categoryData: CategoryData;
  satisfactionData: SatisfactionData;
}