import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/features/auth/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})


let refreshPromise: Promise<void> | null = null

export async function refreshSession(): Promise<void> {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/organization/refresh`,
    {},
    { withCredentials: true },
  )
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        refreshPromise ??= refreshSession().finally(() => {
          refreshPromise = null
        })
        await refreshPromise
        return api(original)
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)
