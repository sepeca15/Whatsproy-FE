import { Espacio } from "@/services/api/espacio/types";
import { IEstado } from "../Status/Status";

interface IClient {
  name: string;
  phone: string;
  id: number;
}

export interface IProductoInfo {
  id: number;
  nombre: string;
  precio: number;
  empresa_id: number;
  descripcion: string;
  plazoDuracionEstimadoMinutos: number;
  disponible: boolean;
  imagen: string;
}

interface IProduct {
  productoInfo: IProductoInfo;
  pedidoId: number;
  detalle: string | null;
  cantidad: number;
  precio: number;
}

interface IChatId {
  createdAt: string;
  updatedAt: string;
  id: number;
}

export interface IOrderDetails {
  client: IClient;
  products: IProduct[];
  reclamo?: any;
  isDomicilio?: boolean;
  paymentMethod?: any;
  transferUrl?: string;
  chatId: IChatId;
  date: string;
  confirm: boolean;
  id: number;
  estimateTime: number;
  total: number;
  infoLines: any;
  cambiosEstado: any[]
  estadoActual: IEstado,
  detalle: string | null
  detalle_pedido?: string | null
  espacio?: Espacio
}
