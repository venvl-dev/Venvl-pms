import axios from 'axios'
import type { ApiErrorBody } from '@/features/auth/types'

export function apiErrorMessages(err: unknown): string[] {
  if (!axios.isAxiosError(err)) return []
  const body = err.response?.data as ApiErrorBody | undefined
  if (!body?.message) return []
  return Array.isArray(body?.message) ? body.message : [body.message]
}
