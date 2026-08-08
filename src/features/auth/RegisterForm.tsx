import { useForm } from 'react-hook-form'
import { useRegister } from './hooks'
import { registerSchema, type RegisterValues } from './schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import styles from './AuthForm.module.css'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/core/Input'
import { Button } from '@/components/core/Button'
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"
import 'react-phone-number-input/style.css'


export function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const { mutate, isPending } = useRegister()

  return (
    <form className={styles.form} onSubmit={handleSubmit((values) => mutate(values))} noValidate>
      <div className={styles.field}>
        <Label htmlFor="name">Organization name</Label>
        <Input id="name" autoComplete="organization" {...register('name')} />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
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
       <PhoneInputWithCountry
  name="phone"
  control={control}
  id="phone"
  className={styles.phoneInput}
  international
  defaultCountry="EG"
  countryCallingCodeEditable={false}
  autoComplete="tel"
  placeholder="100 000 0000"
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
