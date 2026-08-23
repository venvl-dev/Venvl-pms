import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/features/auth/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})


let refreshPromise: Promise<void> | null = null

async function requestRefresh(): Promise<void> {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  )
}

export function refreshSession(): Promise<void> {
  refreshPromise ??= requestRefresh().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await refreshSession()
        useAuthStore.getState().setAuthenticated()
        return api(original)
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
