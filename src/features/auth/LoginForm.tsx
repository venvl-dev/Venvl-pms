import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { Label } from '@/components/core/Label'
import { loginSchema } from './schemas'
import type { LoginValues } from './schemas'
import { useLogin, useDemoLogin } from './hooks'
import styles from './AuthForm.module.css'



export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
      } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

      const{mutate,isPending}=useLogin()
      const demoLogin = useDemoLogin()


return(
    <form className={styles.form} onSubmit={handleSubmit((values) => mutate(values))} noValidate>
        <div className={styles.field}>
            <Label htmlFor='email'>Email</Label>
        <Input id="email" type="email"  {...register('email')} />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>
        <div className={styles.field}>
            <Label htmlFor='email'>Password</Label>
        <Input id="password" type="password"  {...register('password')} />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        <Button type='submit' disabled={isPending}>
            {isPending?'Signing in...' :'Sign in'}
        </Button>
        <div className={styles.divider}><span>or</span></div>

<Button type="button" variant="outline" onClick={demoLogin}>
  Use demo account
</Button>
<p className={styles.hint}>Demo · admin@venvl.dev · demo1234</p>

         {/* <p className={styles.switch}>
        No account? <Link to="/register">Create one</Link>
      </p> */}
  </form>
)}
