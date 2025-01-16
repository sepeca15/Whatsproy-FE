
import { useUser } from '@/hooks/redux/useUser';
import { getData, removeData } from '@/storage/localStorage';
import axios, { AxiosResponse } from 'axios';
import { router } from 'expo-router';

import { store } from '../redux/store';
import { selectUser } from '../redux/Slices/userSlice/userSlice';

type KeysApis = "global" | 'current';

const ApiInstances = (key: KeysApis) => {
  const globalApi = axios.create({
    baseURL: key === "global" ? 'https://app.whatsproy.com/' : undefined, 
  });

  globalApi.interceptors.request.use(
    async (config) => {
      const state = store.getState(); 
      const user = selectUser(state);
      config.baseURL = key === "global" ? 'https://app.whatsproy.com/' : user?.user.apiUrl;
      
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
    async (response: AxiosResponse<any, any>) => {
      return response;
    },
    async (error) => {
      if (
        (error?.response?.status === 401 || error?.response?.data?.statusCode === 401) &&
        error?.response.data.message !== "Invalid credentials"
      ) {
        await removeData('token');
        router.push('/(auth)/login');
      }
      return Promise.reject(error);
    }
  );

  return globalApi;
};


export default ApiInstances

