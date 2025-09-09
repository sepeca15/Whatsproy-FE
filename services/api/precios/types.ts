export type PrecioTipoIntervalo = "minutos" | "horas" | "dias";

export interface Espacio {
    id: number;
    nombre: string;
    image?: string;
    descripcion: string;
    ubicacion: string;
    capacidad?: number;
    precios?: Precio[];
}

export interface Precio {
    id: number;
    tipo_intervalo: PrecioTipoIntervalo;
    duracion_intervalo: number;
    precio: number;
    espacio: Espacio;
}
