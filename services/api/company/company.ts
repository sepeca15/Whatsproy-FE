import ApiInstances from "@/services/axios/axiosConfig"
import { IUserData } from "@/services/redux/Slices/userSlice/types"

export const updateCompany = async( companyData : IUserData , id_empresa: number) => {
    const { data } = await ApiInstances('global').patch('empresa/' + id_empresa, companyData)
    return data
}

export const LoadAuthCode = async({
    id_empresa,
    numberPhone
}:{
    id_empresa:number,
    numberPhone:number
}) => {
    const {data} = await ApiInstances('global').get(`empresa/authCode/${id_empresa}/${numberPhone}`)
    return data
}

export const LoadQR = async({id_empresa}:{id_empresa: number}) => {
    console.log(id_empresa);
    
    const {data} = await ApiInstances('global').get(`empresa/qr/${id_empresa}`)
    return data
}
