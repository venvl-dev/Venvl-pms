import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login, register, verifyOtp,  logout } from './api'
import type { AuthResponse } from './types'
import { useAuthStore } from '@/stores/authStore'

function useAuthSuccess() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return (data: AuthResponse) => {
    setAuth(data.accessToken, data.user)
    queryClient.setQueryData(['auth', 'me'], data.user)
    navigate('/', { replace: true })
  }
}

export function useLogin() {
  const onSuccess = useAuthSuccess()
  return useMutation({
    mutationFn: login,
    onSuccess,
    onError: () => toast.error('Invalid email or password'),
  })
}

export function useRegister() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast.success('We sent a code to your phone')
      navigate('/verify-otp', { state: { phone: data.phone } })
    },
    onError: () => toast.error('Could not start registration'),
  })
}

export function useVerifyOtp() {
  const onSuccess = useAuthSuccess()
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess,
    onError: () => toast.error('Invalid or expired code'),
  })
}


export function useLogout(){
      const clearAuth = useAuthStore((s) => s.clearAuth)
      const navigate=useNavigate()
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn:logout,
             onSettled: () => {
      clearAuth()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
        })
 
      
}

export function useDemoLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    const user = {
      id: 'demo_1',
      email: 'admin@venvl.dev',
      ownerName: 'Demo Admin',
      orgName: 'VENVL Demo',
      phone: '+201000000000',
    }
    setAuth('demo.access.token', user)
    queryClient.setQueryData(['auth', 'me'], user)
    navigate('/', { replace: true })
  }
}
