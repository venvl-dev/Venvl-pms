import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  orgName: z.string().min(2, 'Enter your organization name'),
  ownerName: z.string().min(2, 'Enter the owner name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
 phone: z.string().regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number'),

})

export const otpSchema = z.object({
  code: z.string().regex(/^[0-9]{6}$/, 'Enter the 6-digit code'),
})



export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues=z.infer<typeof registerSchema>
export type OtpValues=z.infer<typeof otpSchema>