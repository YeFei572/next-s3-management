import axios from 'axios'
import { toast } from 'sonner'

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const vendors = localStorage.getItem('vendors')
    if (vendors) {
      config.headers['x-vendors'] = vendors
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.error || error.message || '请求失败'
    toast.error(message)
    return Promise.reject(error)
  }
)

export default axiosInstance