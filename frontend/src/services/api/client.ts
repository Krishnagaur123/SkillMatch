import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

if (!BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not set')
}


const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (!error.response) {

      return Promise.reject(new Error('Network error — please check your connection.'))
    }

    const { status } = error.response

    if (status === 401) {
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }

    if (status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'))
    }

    if (status >= 500) {
      return Promise.reject(new Error('A server error occurred. Please try again later.'))
    }

    return Promise.reject(error)
  },
)

export default apiClient
