
import { getData, removeData } from '@/storage/localStorage';
import axios, { AxiosResponse } from 'axios';
import { router } from 'expo-router';

type KeysApis = "global" | 'current';

const ApiInstances = (key : KeysApis) => {
  const globalApi = axios.create({
    baseURL: key === "global"? 'https://app.whatsproy.com/' : "https://works.whatsproy.com/",
  });
  
  globalApi.interceptors.request.use(
    async (config) => {
      const token = await getData('token');      
      if (token) {        
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  globalApi.interceptors.response.use(
    async (response : AxiosResponse<any, any>)=> {
      return response;
    },
    async (error)=> {            
      if(error?.response?.data?.statusCode === 401 && error?.response.data.message != "Invalid credentials") {
        await removeData('token')
        router.replace('/(auth)/login')
      }
      return Promise.reject(error);
    }
  )
  
  return globalApi
}

export default ApiInstances

