import axios, { AxiosRequestConfig } from 'axios'

interface ResponseType<T = any> {
  code: number;
  msg: string;
  data: T;
}

const asioxInstance = axios.create({
  baseURL: '/',
  timeout: 10000,
})

asioxInstance.interceptors.request.use(async config => {
  // auth token
  // const token = localStorage.getItem('auth_token')
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`
  // }

  return config
}, eror => {
  return Promise.reject(eror);
});

asioxInstance.interceptors.response.use(response => {
  return response
}, error => {
  // if (error.response && error.response.status === 403) {
  //   localStorage.removeItem('auth_token')
  // }

  return Promise.reject(error)
});

const request = async <T = any>(config: AxiosRequestConfig): Promise<ResponseType<T>> => {
  try {
    const response = await asioxInstance.request(config)
    return response.data
  } catch (error) {
    console.log('request error', error);
    
    return Promise.reject(error)
  }
}
export default request
