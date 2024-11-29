import ApiInstances from "@/services/axios/axiosConfig"

export const findAllProducts = async () => {    
    const data = await ApiInstances('current').get(`producto`)    
    return data
}