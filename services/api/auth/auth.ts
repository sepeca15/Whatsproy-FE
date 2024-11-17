import ApiInstances from "@/services/axios/axiosConfig";

export const Login = async ({
    email,
    password
}: {
    email: string;
    password: string
}) => {    
    const { data } = await ApiInstances('global').post(`auth/login`, {email,password})
    return data
}

export const GetMyAccountData = async () => {    
    const { data } = await ApiInstances('current').get(`auth/me`)
    return data
}