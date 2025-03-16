export interface Cliente {
  id: number;
  empresa_id: number;
  nombre: string;
  telefono: string;
}

export interface CreateClient {
  empresaId: number;
  nombre: string;
  telefono: string;
}
