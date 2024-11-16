import globalApi from "@/services/axios/axiosConfig";

export const Login = async ({
    email,
    password
}: {
    email: string;
    password: string
}) => {
    const { data } = await globalApi.post(`auth/login`, {email,password})
    return data
}