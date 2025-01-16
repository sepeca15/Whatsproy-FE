export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  empresa_id: number;
  descripcion: string;
  plazoDuracionEstimadoMinutos: number;
  disponible: boolean;
}
