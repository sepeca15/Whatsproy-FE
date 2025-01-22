import ApiInstances from "@/services/axios/axiosConfig"


export const getAll = async() => {
    const { data } = await ApiInstances('global').get('tiposervicio')

    return data
}