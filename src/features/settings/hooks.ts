import { useMutation, useQuery } from '@tanstack/react-query'
import { getMe, sendInvite } from './api'
import { toast } from 'sonner'

export const useInviteEmp = () => {
  return useMutation({
    mutationFn: sendInvite,
    onSuccess: (data) => {
      toast.success(`Invitation Sent to ${data.data.email}`)
    },
    onError: () => toast.error('Failed To Invite User'),
  })
}

export const useGetMe = () => {
  return useQuery({
    queryKey: ['orgMe'],
    queryFn: getMe,
  })
}
