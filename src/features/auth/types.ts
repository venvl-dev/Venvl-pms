export interface User {
  id: string
  email: string
  ownerName: string
  orgName: string
  phone: string
}



export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  ownerName: string
  email: string
  password: string
  phone: string
}

export interface RegisterResponse {
  signupId: string
  email: string
}




export interface ApiEnvolope<T>{
  message:string
  data:T
}

export interface CompleteSignupRequest {
  signupId:string
  code:string
}

export interface ApiErrorBody{
  message:string|string[]
  error:string
  statusCode:number
}