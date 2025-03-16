export interface ProductFormData {
  id: number;
  title: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  imageUrl?: string;
  disponible: boolean;
  empresa_id: number;
}

export interface EditProductProps {
  id: number;
  title: string;
  price: string;
  currency: string;
  duration: string;
  description: string;
  imageUrl?: string;
  disponible: boolean;
  empresa_id: number;
  onUpdateProduct: (updatedProduct: ProductFormData) => void;
}
