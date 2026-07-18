import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore, getAccessToken } from '@/features/auth/authStore'
import type { RefreshResponse } from '@/features/auth/types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  
  const { data } = await axios.post<RefreshResponse>(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  )
  useAuthStore.getState().setAccessToken(data.accessToken)
  return data.accessToken
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const newToken = await refreshPromise
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
