export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  empresa_id: number;
  descripcion: string;
  plazoDuracionEstimadoMinutos: number;
  disponible: boolean;
  imagen: string;
}

export type UpdatePricesDto = {
  tipoActualizacion: 'porcentaje' | 'monto' | any;
  valor: number
  categoriaId?: number;
  soloDisponibles?: boolean;
}
