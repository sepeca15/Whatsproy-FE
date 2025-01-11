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

interface ProductParams {
  id: string;
  title: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: string;
  reviews: string;
  tags?: string;
  monthlabels: string[];
  monthdatasets?: string;
  dayslabels: string[];
  daysdatasets?: string;
  disponible: string;
  empresa_id: string;

}


export { ProductParams }; 