import { useMutation, useQueryClient } from '@tanstack/react-query'
import {  useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login, register, completeSignup,  logout,employeeLogin,acceptInvite } from './api'
import { useAuthStore } from '@/features/auth/authStore'
import { apiErrorMessages } from '@/lib/apiError'

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

export function useEmployeeLogin(){
  const onSuccess=useAuthSuccess()
    return useMutation({
      mutationFn:employeeLogin,
      onSuccess,
      onError:()=>toast.error("Invalid email or password please try again ")
    })
}

export function useAcceptInvite(){
  const onSuccess=useAuthSuccess()
  return useMutation({
    mutationFn:acceptInvite,
onSuccess: () => {
      toast.success('Welcome aboard!')
      onSuccess()
    },
   onError: (err) => {
      const [message] = apiErrorMessages(err)
      toast.error(message ?? 'This invite is invalid or has expired')
    }  })
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

