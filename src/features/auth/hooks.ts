import { useMutation, useQueryClient } from '@tanstack/react-query'
import {  useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login, register, completeSignup,  logout } from './api'
import { useAuthStore } from '@/features/auth/authStore'

function useAuthSuccess() {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)
  const navigate = useNavigate()
  return () => {
    setAuthenticated()
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
    onSuccess: (data, variables) => {
      toast.success('We sent a code to your phone')
      navigate('/verify-otp', {
        state: { signupId: data.signupId, phone: variables.phone },
      })
    },
        onError: () => toast.error('Could not start registration'),
  })
}

export function useCompleteSignup() {
  const onSuccess = useAuthSuccess()
  return useMutation({
    mutationFn: completeSignup,
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

// export function useDemoLogin() {
//   const setAuth = useAuthStore((s) => s.setAuth)
//   const navigate = useNavigate()
//   const queryClient = useQueryClient()

//   return () => {
//     const user = {
//       id: 'demo_1',
//       email: 'admin@venvl.dev',
//       ownerName: 'Demo Admin',
//       orgName: 'VENVL Demo',
//       phone: '+201000000000',
//     }
//     setAuth('demo.access.token', user)
//     queryClient.setQueryData(['auth', 'me'], user)
//     navigate('/', { replace: true })
//   }
// }
