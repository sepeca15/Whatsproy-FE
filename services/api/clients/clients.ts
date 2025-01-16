import ApiInstances from "@/services/axios/axiosConfig"

export const findClientsWithQuery = async (query: string, empresaId: string) => {
    const data = await ApiInstances('current').get(`cliente?query=${query}&empresaId=${empresaId}`)
    return data;
}