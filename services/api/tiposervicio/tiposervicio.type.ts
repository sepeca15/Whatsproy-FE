export const ID_TIPOSERVICIO_DELIVERY = 1;
export const ID_TIPOSERVICIO_RESERVA = 2;
export const ID_TIPOSERVICIO_RESERVA_ESPACIO = 3;


export type TipoServicioType = 1 | 2 | 3;

export enum TipoPedidoStr {
  DELIVERY = "DELIVERY",
  RESERVA = "RESERVA",
  RESERVA_ESPACIO = "RESERVA_ESPACIO",

}

export const EmpresaTypeStr = {
  [ID_TIPOSERVICIO_RESERVA]: TipoPedidoStr.RESERVA,
  [ID_TIPOSERVICIO_DELIVERY]: TipoPedidoStr.DELIVERY,
  [ID_TIPOSERVICIO_RESERVA_ESPACIO]: TipoPedidoStr.DELIVERY,

};
