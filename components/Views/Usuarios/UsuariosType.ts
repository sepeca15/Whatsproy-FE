export interface IUserInfo {
  data: IUser[] | [];
  loading: boolean;
}

export interface IUser {
  createdAt: string;
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  id_empresa: number;
  id_rol: number;
  activo: boolean;
  firstUser: boolean;
  photo: string
}
