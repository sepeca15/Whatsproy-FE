import ApiInstances from "@/services/axios/axiosConfig"


export const getAll = async() => {    
    const {data} = await ApiInstances('current').get(`infoline`)
    return data
}

export const create = async({
    nombre,
    requerido,
    es_defecto,
    id_tipo_servicio,
    tipo,
} : {
    nombre: string,
    requerido: boolean,
    es_defecto: boolean,
    id_tipo_servicio: number,
    tipo: string,
}) => {
    
    const {data} = await ApiInstances('current').post('infoLine', {
        nombre,
        requerido,
        es_defecto,
        id_tipo_servicio,
        tipo
    })

    return data
}

export const deleteOrderDate = async(id: number) => {    
    const {data} = await ApiInstances('current').delete(`infoline/`+ id)
    return data
}