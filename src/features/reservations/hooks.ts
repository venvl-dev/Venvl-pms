import { useQuery, keepPreviousData, useMutation } from '@tanstack/react-query'
import { getAllReservations, getReservations } from './api'
import type { GetReservationsParams } from './types'

export function useReservations(params: GetReservationsParams) {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: () => getReservations(params),
    placeholderData: keepPreviousData, 
  })
}

export function useExportAll() {
  return useMutation({
    mutationFn: getAllReservations,
  })
}