import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { VerifyOtpPage } from '@/pages/VerifyOtpPage'
import { MODULES } from './modules'

const moduleRoutes = MODULES.map((m) =>
  m.path === '/'
    ? { index: true as const, element: <ModulePlaceholder /> }
    : { path: m.path.slice(1), element: <ModulePlaceholder /> },
)

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/verify-otp', element: <VerifyOtpPage /> },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [...moduleRoutes, { path: '*', element: <ModulePlaceholder /> }],
      },
    ],
  },
])
