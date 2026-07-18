import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { api } from '@/lib/apiClient'
import type { RefreshResponse, User } from './types'

function useBootstrapAuth() {
  const { isBootstrapping, setAuth, setBootstrapped } = useAuthStore()

  useEffect(() => {
    let cancelled = false
    async function bootstrap() {
      // Already authenticated this session (demo or fresh login) → no refresh needed.
      if (useAuthStore.getState().accessToken) {
        setBootstrapped()
        return
      }
      try {
        const { data } = await api.post<RefreshResponse>('/auth/refresh', {})
        useAuthStore.getState().setAccessToken(data.accessToken)
        const { data: user } = await api.get<User>('/auth/me')
        if (!cancelled) setAuth(data.accessToken, user)
      } catch {
        useAuthStore.getState().clearAuth()
      } finally {
        if (!cancelled) setBootstrapped()
      }
    }
    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [setAuth, setBootstrapped])

  return isBootstrapping
}

export function RequireAuth() {
  const isBootstrapping = useBootstrapAuth()
  const accessToken = useAuthStore((s) => s.accessToken)
  if (isBootstrapping) return <div style={{ padding: '2rem' }}>Loading…</div>
  if (!accessToken) return <Navigate to="/login" replace />
  return <Outlet />
}
