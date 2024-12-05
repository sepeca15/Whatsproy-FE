import ApiInstances from "@/services/axios/axiosConfig"
import { IUserUpdate } from "./user.types"

export const updateUser = async(usuarioId : number, dataUser : IUserUpdate) => {
    console.log(usuarioId);
    console.log(dataUser);
    
    const { data } = await ApiInstances('global').patch(`usuario/${usuarioId}`, dataUser)

    return data
}