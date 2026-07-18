import { Link } from 'react-router-dom'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { RegisterForm } from '@/features/auth/RegisterForm'

export function RegisterView() {
  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Spin up a fresh organization and start managing properties."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}
