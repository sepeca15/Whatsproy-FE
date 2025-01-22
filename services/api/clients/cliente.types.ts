export interface Cliente {
  id: number;
  empresa_id: number;
  nombre: string;
  telefono: string;
}

export interface CreateClient {
  empresa_id: number;
  nombre: string;
  telefono: string;
}