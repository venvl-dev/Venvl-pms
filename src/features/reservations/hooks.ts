import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getReservations } from './api'
import type { GetReservationsParams } from './types'

export function useReservations(params: GetReservationsParams) {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: () => getReservations(params),
    placeholderData: keepPreviousData, 
  })
}