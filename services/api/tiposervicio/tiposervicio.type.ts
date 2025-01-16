export const ID_TIPOSERVICIO_RESERVA = 2;
export const ID_TIPOSERVICIO_DELIVERY = 1;

export type TipoServicioType = 1 | 2;

export enum TipoPedidoStr {
  DELIVERY = "DELIVERY",
  RESERVA = "RESERVA",
}

export const EmpresaTypeStr = {
  [ID_TIPOSERVICIO_RESERVA]: TipoPedidoStr.RESERVA,
  [ID_TIPOSERVICIO_DELIVERY]: TipoPedidoStr.DELIVERY,
};
