import { api } from '@/lib/apiClient'
import type { InviteBody } from './types'

export const getMe = async () => {
  const { data } = await api.get('/auth/me')
}

export const sendInvite = async (body: InviteBody) => {
  const { data } = await api.post('/auth/employee/invite', body)
  return data
}
