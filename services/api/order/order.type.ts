export interface CreateOrderDTO {
  confirmado: boolean;
  clienteId?: number;
  estadoId: number;
  clientName?: string;
  products: any[];
  empresaType: any;
  messages: any[];
  numberSender?: number;
  infoLinesJson?: any;
  fecha?: any;
  detalles?: string;
}

export enum OrderEstadoDefault {
  CREADO = 1,
  PENDIENTE = 2,
  FINALIZADO = 3,
}
