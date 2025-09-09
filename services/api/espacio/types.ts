import { Precio } from "../precios/types";

export interface Espacio {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  capacidad: number | null;
  pedido: any[],
  precios: Precio[]
  image?: string;
}