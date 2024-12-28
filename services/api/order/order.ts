import ApiInstances from "@/services/axios/axiosConfig"

export const getDetailsOfOrder = async (id : any) => {
    
    const { data } = await ApiInstances('current').get('pedido/details/' + id)
    return data
}

export const getAllFinished = async() => {
    const { data } = await ApiInstances('current').get('pedido/finished')
    return data
}

export const getAllPending = async() => {
    const { data } = await ApiInstances('current').get('pedido/pending')
    return data
}

export const confirmOrder = async (id : number) => {    
    const { data } = await ApiInstances('current').get('pedido/confirm/' + id)

    return data
}

export const removeOrder = async (id : number) => {
    const { data } = await ApiInstances('current').delete('pedido/' + id)
    
    return data
}
