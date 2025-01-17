import ApiInstances from "@/services/axios/axiosConfig"
import { CreateClient } from "./cliente.types"

export const CreateOrReturnClient = async(clientData : CreateClient) => {
    const { data } = await ApiInstances('current').post('cliente', clientData)
    return data
}

export const findClientsWithQuery = async (query: string, empresaId: string) => {
    const data = await ApiInstances('current').get(`cliente?query=${query}&empresaId=${empresaId}`)
    return data;
}