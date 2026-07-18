import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, Navigate } from 'react-router-dom'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { Label } from '@/components/core/Label'
import { otpSchema } from './schemas'
import type { OtpValues } from './schemas'
import { useVerifyOtp } from './hooks'
import styles from './AuthForm.module.css'

export function VerifyOtpForm() {
  const location = useLocation()
  const phone = (location.state as { phone?: string } | null)?.phone

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpValues>({ resolver: zodResolver(otpSchema) })

  const verify = useVerifyOtp()

  if (!phone) return <Navigate to="/register" replace />

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((values) => verify.mutate({ phone, code: values.code }))}
      noValidate
    >
      <p className={styles.switch}>
        Enter the 6-digit code sent to <strong>{phone}</strong>
      </p>

      <div className={styles.field}>
        <Label htmlFor="code">Verification code</Label>
        <Input
          id="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          {...register('code')}
        />
        {errors.code && <p className={styles.error}>{errors.code.message}</p>}
      </div>

      <Button type="submit" disabled={verify.isPending}>
        {verify.isPending ? 'Verifying…' : 'Verify & continue'}
      </Button>
    </form>
  )
}
