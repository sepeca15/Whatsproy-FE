import { Path } from 'react-native-svg';
import ApiInstances from "@/services/axios/axiosConfig"
import ProductoTypes  from './types';


export const findAllProducts = async () => {
    const data = await ApiInstances('current').get(`producto`)
    return data
}

export const findProductsWithQuery = async (query: string) => {
    const data = await ApiInstances('current').get(`producto/findWithQuery?query=${query}`)
    return data;
}
export const find = async (id: number) => {
    const data = await ApiInstances('current').get(`producto/${id}`)
    return data;
}

export const update = async (id: number, product: ProductoTypes) => {
    const data = await ApiInstances('current').put(`producto/${id}`, product)
    return data;
}
export const deletProd = async (id: number) => {
    const data = await ApiInstances('current').delete(`producto/${id}`)
    return data;
}

export const create = async (product: ProductoTypes) => {
    const data = await ApiInstances('current').post(`producto`, product)
    return data;
}

