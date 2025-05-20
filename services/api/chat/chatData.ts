import ApiInstances from "@/services/axios/axiosConfig";



export const getchat = async (id: number) => {
    const {data} = await ApiInstances("current").get(`chat/${id}`);
    return data;
  };
  