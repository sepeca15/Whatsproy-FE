interface ProductoTypes {
  nombre: string;
  precio: number;
  empresa_id: number;
  imagen: string;
  descripcion: string;
  plazoDuracionEstimadoMinutos: number;
  disponible: boolean;
  currency_id?: any;
  categoryIds? : any[]
}

export default ProductoTypes;
