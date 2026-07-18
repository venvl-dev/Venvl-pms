import { api } from '@/lib/apiClient'
import type { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, VerifyOtpRequest } from './types'

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', body)
  return data
}
export async function register(body: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>('/auth/register', body)
  return data
}
export async function verifyOtp(body: VerifyOtpRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/verify-otp', body)
  return data
}
export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}