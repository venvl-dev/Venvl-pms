import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { Label } from '@/components/core/Label'
import { acceptInviteSchema } from './schemas'
import type { AcceptInviteValues } from './schemas'
import { useAcceptInvite } from './hooks'
import styles from './AuthForm.module.css'

export function AcceptInviteForm() {
  const [params] = useSearchParams()
  const token = params.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteValues>({ resolver: zodResolver(acceptInviteSchema) })

  const accept = useAcceptInvite()

  if (!token) {
    return (
      <p className={styles.error}>
        This invite link is missing its token. Ask your admin to send a new invite.
      </p>
    )
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((values) => accept.mutate({ token, ...values }))}
      noValidate
    >
      <div className={styles.field}>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
      </div>

      <div className={styles.field}>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
      </div>

      <div className={styles.field}>
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={accept.isPending}>
        {accept.isPending ? 'Setting up…' : 'Set password & continue'}
      </Button>
    </form>
  )
}
