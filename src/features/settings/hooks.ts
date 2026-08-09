import { useMutation } from '@tanstack/react-query'
import { sendInvite } from './api'
import { toast } from 'sonner'

export const useInviteEmp = () => {
  return useMutation({
    mutationFn: sendInvite,
    onSuccess: (data) => {
      toast.success(`Invitation Sent to ${data.data.email}`)
    },
  })
}
