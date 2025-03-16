export interface CreateEmpresaDto {
  nombre: string;
  descripcion?: string;
  logo?: string;
  menu?: string;
  hora_cierre?: string;
  hora_apertura?: string;
  notificarReservaHoras?: boolean;
  tipoServicioId: number | null;
  userEmail: string;
  password: string;
  direction?: string;
}
