export interface Espacio {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  capacidad: number | null;
  pedido: any[],
  productos: any[]
  image?: string;
}