export interface IUserUpdate { 
    nombre?: string;
    apellido?: string;
    activo?: string;
}

export interface IUserCreate { 
    nombre: string;
    apellido: string;
    correo: string;
    contrasña: string;
    id_empresa: number
}