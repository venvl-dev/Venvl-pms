import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/core/Card'
import { VerifyOtpForm } from '@/features/auth/VerifyOtpForm'
import styles from './AuthView.module.css'

export function VerifyOtpView() {
  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Verify your phone</CardTitle>
          <CardDescription>One last step to finish signing up</CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyOtpForm />
        </CardContent>
      </Card>
    </div>
  )
}
