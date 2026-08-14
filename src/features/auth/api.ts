import { api } from '@/lib/apiClient'
import type {
  ApiEnvolope,  
  CompleteSignupRequest,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from './types'


export async function login(body: LoginRequest): Promise<void> {
  await api.post('/auth/organization/login', body)
}

export async function completeSignup(body: CompleteSignupRequest): Promise<void> {
  await api.post('/auth/organization/complete-signup', body)
}


export async function register(body: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await api.post<ApiEnvolope<RegisterResponse>>('/auth/organization/register', body)
  return data.data
}



export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
