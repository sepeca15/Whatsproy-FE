export enum EstadoDefecto {
  CREADO = "CREADO",
  PENDIENTE = "PENDIENTE",
  FINALIZADO = "FINALIZADO",
}

export const DEFAULT_ESTADO_CREADO = {
  id: 1,
  nombre: EstadoDefecto.CREADO,
  es_defecto: true,
};

export const DEFAULT_ESTADO_PENDIENTE = {
  id: 2,
  nombre: EstadoDefecto.PENDIENTE,
  es_defecto: true,
};

export const DEFAULT_ESTADO_FINALIZADO = {
  id: 3,
  nombre: EstadoDefecto.FINALIZADO,
  es_defecto: true,
};

export const DEFAULT_ESTADOS = [
  DEFAULT_ESTADO_CREADO,
  DEFAULT_ESTADO_PENDIENTE,
  DEFAULT_ESTADO_FINALIZADO,
];
