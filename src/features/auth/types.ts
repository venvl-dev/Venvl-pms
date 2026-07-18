export interface User {
  id: string
  email: string
  ownerName: string
  orgName: string
  phone: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  orgName: string
  ownerName: string
  email: string
  password: string
  phone: string
}

export interface RegisterResponse {
  phone: string
}

export interface VerifyOtpRequest {
  phone: string
  code: string
}

export interface RefreshResponse {
  accessToken: string
}
