export interface IUserUpdate {
  nombre?: string;
  apellido?: string;
  activo?: boolean;
  photo?: string;
}

export interface IUserCreate {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  id_empresa: number;
}


export interface WorkerUser {
  id: number;
  nombre: string;
  apellido: string;
  activo: boolean;
  image: string;
  createdAt: string;
}