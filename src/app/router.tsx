import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ModulePlaceholder } from '@/components/common/ModulePlaceholder'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { LoginView } from '@/features/auth/LoginView'
import { RegisterView } from '@/features/auth/RegisterView'
import { VerifyOtpView } from '@/features/auth/VerifyOtpView'
import { DashboardView } from '@/features/dashboard/DashboardView'
import { MODULES } from './modules'
import { ReservationsView } from '@/features/reservations/ReservationsView'
import { PropertiesView } from '@/features/properties/PropertiesView'
import { PropertyDetailView } from '@/features/properties/PropertyDetailView'
import { MultiCalendarView } from '@/features/calendar/MultiCalendarView'
import ReservationDetails from '@/features/reservations/ReservationDetails'
import { RouteError } from '@/components/common/RouterError'

const moduleRoutes = MODULES.map((m) => {
  if (m.path === '/') return { index: true as const, element: <DashboardView /> }
  if (m.path === '/reservations') return { path: 'reservations', element: <ReservationsView /> }
  if (m.path === '/properties') return { path: 'properties', element: <PropertiesView /> }
  if (m.path === '/calendar') return { path: 'calendar', element: <MultiCalendarView /> }
  return { path: m.path.slice(1), element: <ModulePlaceholder /> }
})

export const router = createBrowserRouter([
  { path: '/login', element: <LoginView />, errorElement: <RouteError /> },
  { path: '/register', element: <RegisterView />, errorElement: <RouteError /> },
  { path: '/verify-otp', element: <VerifyOtpView />, errorElement: <RouteError /> },
  {
    path: '/',
    element: <RequireAuth />,
    errorElement: <RouteError />,
    children: [
      {
        element: <DashboardLayout />,
        children: [...moduleRoutes,
          {path:'properties/:propertyId',element:<PropertyDetailView/>},
          {path:'reservations/:reservationId',element:<ReservationDetails/>},
          { path: '*', element: <ModulePlaceholder /> }],
      },
    ],
  },
])
