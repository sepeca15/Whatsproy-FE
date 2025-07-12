import ApiInstances from "@/services/axios/axiosConfig"


export const createCategory = async(info : {name: string, description: string, image: string}) => {
    const { data } = await ApiInstances('current').post('api/category/', info)

    return data
} 

export const getAllCategories = async() => {
    const { data } = await ApiInstances('current').get('api/category/')

    return data
}

export const getProductFromCategory = async({categoryId} : {categoryId : number}) => {
    const { data } = await ApiInstances('current').get('api/category/' + categoryId + "/products")
    
    return data
} 

export const getProductsWithoutCategories = async() => {
    const { data } = await ApiInstances('current').get('api/category/getProductsWithoutCategories')
    
    return data
} 


export const updateCategory = async({categoryId, dataUpdate} : {categoryId : number, dataUpdate: any}) => {
    const { data } = await ApiInstances('current').patch('api/category/' + categoryId, dataUpdate)
    
    return data
} 

export const deleteCategory = async({categoryId} : {categoryId : number}) => {    
    const { data } = await ApiInstances('current').delete('api/category/' + categoryId)

    return data
}