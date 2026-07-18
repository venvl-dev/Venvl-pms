import { Link } from 'react-router-dom'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { LoginForm } from '@/features/auth/LoginForm'

export function LoginView() {
  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back to VENVL Go."
      footer={
        <>
          Don’t have an account? <Link to="/register">Create one</Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
