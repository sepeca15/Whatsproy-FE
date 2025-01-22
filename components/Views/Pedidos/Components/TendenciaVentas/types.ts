
export interface CategoryData {
  Hamburguesas: number;
  Chorizo: number;
  Salchichas: number;
  [key: string]: number; 
}
export interface MonthlySalesData {
  month: string;
  categories: CategoryData;
}

export interface SalesSegment {
  startAngle: number;
  endAngle: number;
  color: string;
  label: string;
  value: number;
  month: string;
  category: string;
}