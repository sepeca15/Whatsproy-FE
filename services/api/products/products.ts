import ApiInstances from "@/services/axios/axiosConfig"

export const findAllProducts = async () => {
    const data = await ApiInstances('current').get(`producto`)
    return data
}

export const findProductsWithQuery = async (query: string) => {
    const data = await ApiInstances('current').get(`producto/findWithQuery?query=${query}`)
    return data;
}