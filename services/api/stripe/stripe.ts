import ApiInstances from "@/services/axios/axiosConfig"


export const createIntent = async ({amount, currency} :{amount: number, currency :string}) => {
    const { data } = await ApiInstances('global').post('stripe/create-payment-intent',{amount, currency})
    return data
}