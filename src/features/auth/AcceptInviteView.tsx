import { AuthLayout } from '@/features/auth/AuthLayout'
import { AcceptInviteForm } from '@/features/auth/AcceptInviteForm'

export function AcceptInviteView() {
  return (
    <AuthLayout
      title="Accept your invite"
      subtitle="Choose a password to activate your account."
    >
      <AcceptInviteForm />
    </AuthLayout>
  )
}
