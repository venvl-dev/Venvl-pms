import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder'
import { MODULES } from './modules'

const moduleRoutes = MODULES.map((m) =>
  m.path === '/'
    ? { index: true as const, element: <ModulePlaceholder /> }
    : { path: m.path.slice(1), element: <ModulePlaceholder /> },
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [...moduleRoutes, { path: '*', element: <ModulePlaceholder /> }],
  },
])
