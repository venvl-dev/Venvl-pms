import { useForm } from 'react-hook-form'
import { useRegister } from './hooks'
import { registerSchema, type RegisterValues } from './schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import styles from './AuthForm.module.css'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/core/Input'
import { Button } from '@/components/core/Button'

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const { mutate, isPending } = useRegister()

  return (
    <form className={styles.form} onSubmit={handleSubmit((values) => mutate(values))} noValidate>
      <div className={styles.field}>
        <Label htmlFor="orgName">Organization name</Label>
        <Input id="orgName" autoComplete="organization" {...register('orgName')} />
        {errors.orgName && <p className={styles.error}>{errors.orgName.message}</p>}
      </div>
      <div className={styles.field}>
        <Label htmlFor="ownerName">Owner name</Label>
        <Input id="ownerName" autoComplete="name" {...register('ownerName')} />
        {errors.ownerName && <p className={styles.error}>{errors.ownerName.message}</p>}
      </div>

      <div className={styles.field}>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
      </div>
      <div className={styles.field}>
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+20..."
          {...register('phone')}
        />
        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
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

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Sending code…' : 'Create account'}
      </Button>
{/* 
      <p className={styles.switch}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p> */}
    </form>
  )
}
