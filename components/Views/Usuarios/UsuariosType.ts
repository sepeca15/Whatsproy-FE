export interface IUser {
  id: number
  nombre: string
  correo: string
  activo: boolean
  image?: string
  isAdmin?: boolean
}

export interface IUserInfo {
  data: IUser[]
  loading: boolean
}
