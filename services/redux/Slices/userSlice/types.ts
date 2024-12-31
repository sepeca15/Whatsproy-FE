export interface IUserData {
    activo?:boolean;
    apellido?:string;
    apiUrl?: string;
    correo?: string;
    createdAt?: string;
    id?: number;
    id_empresa?: number;
    id_rol?: number;
    nombre?: string;
    updatedAt?: string;
    direccion?: string;
    paymentMade?: boolean;
    apiConfigured?: boolean;
    globalConfig?: boolean;
    userConfigured?: boolean;
    greenApiConfigured?: boolean;
    tipo_servicio?: number;
    tipo_servicioNombre?: string;
    firstUser?: boolean
}

export interface IUser {
    user: IUserData
} 