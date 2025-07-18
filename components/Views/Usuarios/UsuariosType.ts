export interface IUser {
  id: number
  nombre: string
  correo: string
  activo: boolean
  image?: string
  isAdmin?: boolean
  password?: string
}

export interface IUserInfo {
  data: IUser[]
  loading: boolean
}
