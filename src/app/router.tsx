import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder'
import { DashboardView } from '@/components/dashboard/DashboardView'
import { MODULES } from './modules'
import { ReservationsView } from '@/components/reservations/ReservationsView'
import { PropertiesView } from '@/components/properties/PropertiesView'

const moduleRoutes = MODULES.map((m) => {
  if (m.path === '/') return { index: true as const, element: <DashboardView /> }
  if (m.path === '/reservations') return { path: 'reservations', element: <ReservationsView /> }
  if (m.path === '/properties') return { path: 'properties', element: <PropertiesView /> }
  return { path: m.path.slice(1), element: <ModulePlaceholder /> }
})

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [...moduleRoutes, { path: '*', element: <ModulePlaceholder /> }],
  },
])
