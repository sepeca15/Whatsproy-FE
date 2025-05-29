export interface InfoLineDTO {
  id: number;
  nombre: string;
  requerido: boolean;
  es_defecto: boolean;
  tipo: TipoInfoLine;
  show?: boolean;
  id_tipo_servicio: number;
}

export enum TipoInfoLine {
  "string" = "string",
  "number" = "number",
  "boolean" = "boolean",
  "date" = "date",
}

export const NOMBRE_INFOLINE_DELIVERY = 1;
export const DIRECCION_INFOLINE_DELIVERY = 2;
export const NOMBRE_INFOLINE_RESERVA = 3;
export const FECHA_HORA_INFOLINE_RESERVA = 4;
