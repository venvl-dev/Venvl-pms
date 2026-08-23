import { AuthLayout } from '@/features/auth/AuthLayout'
import { LoginForm } from '@/features/auth/LoginForm'

export function EmployeeLoginView() {
  return (
    <AuthLayout title="Staff sign in" subtitle="Sign in to your team account.">
      <LoginForm variant="employee" />
    </AuthLayout>
  )
}
