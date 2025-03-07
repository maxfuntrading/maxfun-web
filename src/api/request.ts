import { toastError } from '@/components/toast';
import axios, { AxiosRequestConfig } from 'axios'
import { VITE_API_HOST } from "@/utils/runtime-config"

interface ResponseType<T = any> {
  code: number;
  msg: string;
  data: T;
}

const asioxInstance = axios.create({
  baseURL: VITE_API_HOST || '/',
  timeout: 10000,
})

asioxInstance.interceptors.request.use(async config => {
  // auth token
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, eror => {
  return Promise.reject(eror);
});

asioxInstance.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response && error.response.status === 403) {
    localStorage.removeItem('auth_token')
  }

  return Promise.reject(error)
});

const request = async <T = any>(config: AxiosRequestConfig, isSpecial: boolean = false): Promise<ResponseType<T>> => {
  try {
    const response = await asioxInstance.request(config)
    return response.data
  } catch (error: any) {
    
    if (!isSpecial && error?.response?.status !== 403) {
      toastError(error?.response?.data?.msg || 'Server Error')
    }
    console.error('request error', error);
    
    return Promise.reject(error)
  }
}
export default request
