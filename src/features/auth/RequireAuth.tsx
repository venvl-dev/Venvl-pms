import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/authStore'
import { refreshSession } from '@/lib/apiClient'

function useBootstrapAuth() {
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping)

  useEffect(() => {
    let cancelled = false
    async function bootstrap() {
      const { isAuthenticated, setAuthenticated, setBootstrapped } =
        useAuthStore.getState()
      if (isAuthenticated) { setBootstrapped(); return }
      try {
        await refreshSession()
        if (!cancelled) setAuthenticated()
      } catch {
        useAuthStore.getState().clearAuth()
      } finally {
        if (!cancelled) setBootstrapped()
      }
    }
    void bootstrap()
    return () => { cancelled = true }
  }, [])

  return isBootstrapping
}

export function RequireAuth() {
  const isBootstrapping = useBootstrapAuth()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isBootstrapping) return <div style={{ padding: '2rem' }}>Loading…</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
